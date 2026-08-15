from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.competencies.models import CompetencyScore, Skill

from . import services
from .models import Assessment, AssessmentAttempt, Question, SkillResult

User = get_user_model()


def make_pool(skill, difficulty='beginner', num_questions=3, correct_prefix='ans'):
    pool = Assessment.objects.create(title=f'{skill.name} pool', skill=skill, difficulty=difficulty)
    questions = []
    for i in range(num_questions):
        questions.append(Question.objects.create(
            assessment=pool, text=f'{skill.name} Q{i}', correct_answer=f'{correct_prefix}{i}', points=1,
        ))
    return pool, questions


class SkillSelectionAndCooldownTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='alice', email='alice@example.com', password='testpass123')
        self.python = Skill.objects.create(name='Python', slug='python')
        self.sql = Skill.objects.create(name='SQL', slug='sql')
        make_pool(self.python)
        make_pool(self.sql)

    def test_untested_skills_are_selected(self):
        selected = services.select_skills_to_assess(self.user, limit=5)
        self.assertIn(self.python, selected)
        self.assertIn(self.sql, selected)

    def test_recently_tested_skill_is_excluded_by_cooldown(self):
        attempt = AssessmentAttempt.objects.create(user=self.user, status=AssessmentAttempt.STATUS_COMPLETED)
        SkillResult.objects.create(attempt=attempt, skill=self.python, score=90, correct_count=3, total_count=3)

        selected = services.select_skills_to_assess(self.user, limit=5)
        self.assertNotIn(self.python, selected)
        self.assertIn(self.sql, selected)

    def test_cooldown_expires_after_window(self):
        attempt = AssessmentAttempt.objects.create(user=self.user, status=AssessmentAttempt.STATUS_COMPLETED)
        old_result = SkillResult.objects.create(
            attempt=attempt, skill=self.python, score=90, correct_count=3, total_count=3,
        )
        # backdate past the cooldown window
        SkillResult.objects.filter(id=old_result.id).update(
            recorded_at=timezone.now() - timedelta(days=services.COOLDOWN_DAYS + 1)
        )
        self.assertFalse(services._is_skill_in_cooldown(self.user, self.python))

    def test_cooldown_status_reports_correctly(self):
        attempt = AssessmentAttempt.objects.create(user=self.user, status=AssessmentAttempt.STATUS_COMPLETED)
        SkillResult.objects.create(attempt=attempt, skill=self.python, score=90, correct_count=3, total_count=3)

        status_list = services.get_cooldown_status(self.user)
        python_status = next(s for s in status_list if s['skill'] == 'Python')
        self.assertTrue(python_status['in_cooldown'])


class BuildAndGradeAttemptTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='bob', email='bob@example.com', password='testpass123')
        self.python = Skill.objects.create(name='Python', slug='python')
        self.sql = Skill.objects.create(name='SQL', slug='sql')
        self.python_pool, self.python_questions = make_pool(self.python, num_questions=2, correct_prefix='py')
        self.sql_pool, self.sql_questions = make_pool(self.sql, num_questions=2, correct_prefix='sql')

    def test_build_attempt_spans_multiple_skills(self):
        attempt = services.build_attempt(self.user, num_skills=2, questions_per_skill=2)
        self.assertIsNotNone(attempt)
        skills_in_attempt = {q.skill for q in attempt.questions.all()}
        self.assertEqual(skills_in_attempt, {self.python, self.sql})

    def test_build_attempt_returns_none_when_nothing_to_assess(self):
        # put both skills in cooldown
        completed = AssessmentAttempt.objects.create(user=self.user, status=AssessmentAttempt.STATUS_COMPLETED)
        SkillResult.objects.create(attempt=completed, skill=self.python, score=80, correct_count=2, total_count=2)
        SkillResult.objects.create(attempt=completed, skill=self.sql, score=80, correct_count=2, total_count=2)

        attempt = services.build_attempt(self.user, num_skills=2, questions_per_skill=2)
        self.assertIsNone(attempt)

    def test_submit_attempt_produces_per_skill_results(self):
        attempt = services.build_attempt(self.user, num_skills=2, questions_per_skill=2)
        answers = []
        for q in attempt.questions.all():
            answers.append({'question_id': q.id, 'answer': q.correct_answer})  # answer everything correctly

        attempt = services.submit_attempt(attempt, answers)

        self.assertEqual(attempt.status, AssessmentAttempt.STATUS_COMPLETED)
        self.assertEqual(attempt.overall_score, 100.0)
        skill_results = {r.skill: r for r in attempt.skill_results.all()}
        self.assertEqual(skill_results[self.python].score, 100.0)
        self.assertEqual(skill_results[self.sql].score, 100.0)

    def test_submit_attempt_feeds_competency_engine_per_skill(self):
        attempt = services.build_attempt(self.user, num_skills=2, questions_per_skill=2)
        answers = [{'question_id': q.id, 'answer': q.correct_answer} for q in attempt.questions.all()]
        services.submit_attempt(attempt, answers)

        python_score = CompetencyScore.objects.get(user=self.user, skill=self.python)
        sql_score = CompetencyScore.objects.get(user=self.user, skill=self.sql)
        self.assertEqual(python_score.score, round(100 * 0.40, 2))
        self.assertEqual(sql_score.score, round(100 * 0.40, 2))

    def test_cannot_resubmit_completed_attempt(self):
        attempt = services.build_attempt(self.user, num_skills=1, questions_per_skill=2)
        answers = [{'question_id': q.id, 'answer': q.correct_answer} for q in attempt.questions.all()]
        services.submit_attempt(attempt, answers)
        with self.assertRaises(ValueError):
            services.submit_attempt(attempt, answers)

    def test_difficulty_selection_matches_current_competency(self):
        make_pool(self.python, difficulty='advanced', num_questions=2, correct_prefix='adv')
        CompetencyScore.objects.create(user=self.user, skill=self.python, score=85, confidence=0.9)
        self.assertEqual(services._difficulty_for_score(85), Assessment.DIFFICULTY_ADVANCED)


class AssessmentAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='carol', email='carol@example.com', password='testpass123')
        self.skill = Skill.objects.create(name='Testing', slug='testing')
        self.pool, self.questions = make_pool(self.skill, num_questions=2, correct_prefix='t')
        self.client.force_authenticate(self.user)

    def test_unauthenticated_cannot_access(self):
        self.client.force_authenticate(None)
        response = self.client.post('/api/assessments/start/')
        self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

    def test_start_returns_built_attempt(self):
        response = self.client.post('/api/assessments/start/', {'num_skills': 1, 'questions_per_skill': 2}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data['questions']), 2)

    def test_start_returns_200_when_nothing_to_assess(self):
        completed = AssessmentAttempt.objects.create(user=self.user, status=AssessmentAttempt.STATUS_COMPLETED)
        SkillResult.objects.create(attempt=completed, skill=self.skill, score=80, correct_count=2, total_count=2)

        response = self.client.post('/api/assessments/start/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('detail', response.data)

    def test_full_start_submit_flow(self):
        start_response = self.client.post('/api/assessments/start/', {'num_skills': 1, 'questions_per_skill': 2}, format='json')
        attempt_id = start_response.data['id']
        answers = [{'question_id': q['id'], 'answer': self.questions[i].correct_answer}
                   for i, q in enumerate(start_response.data['questions'])]

        submit_response = self.client.post(
            f'/api/assessments/attempts/{attempt_id}/submit/', {'answers': answers}, format='json',
        )
        self.assertEqual(submit_response.status_code, status.HTTP_200_OK)
        self.assertEqual(submit_response.data['overall_score'], 100.0)
        self.assertEqual(len(submit_response.data['skill_results']), 1)

    def test_cooldown_endpoint(self):
        completed = AssessmentAttempt.objects.create(user=self.user, status=AssessmentAttempt.STATUS_COMPLETED)
        SkillResult.objects.create(attempt=completed, skill=self.skill, score=80, correct_count=2, total_count=2)

        response = self.client.get('/api/assessments/cooldowns/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data[0]['in_cooldown'])
