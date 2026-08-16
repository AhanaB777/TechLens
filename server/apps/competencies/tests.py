from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from . import services
from .models import CompetencyScore, EvidenceRecord, EvidenceWeightConfig, Skill

User = get_user_model()


class CompetencyEngineServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='alice@example.com', password='testpass123', name='Alice')
        self.skill = Skill.objects.create(name='Python', slug='python')
        EvidenceWeightConfig.objects.filter(is_active=True).update(is_active=False)
        self.config = EvidenceWeightConfig.objects.create(
            name='test-default', is_active=True,
            assessment_weight=0.40, project_weight=0.30,
            resume_weight=0.20, self_assessment_weight=0.10,
        )

    def test_no_evidence_yields_zero_score(self):
        score = services.recompute_competency_score(self.user, self.skill)
        self.assertEqual(score.score, 0)
        self.assertEqual(score.confidence, 0)
        self.assertEqual(score.level, 'Beginner')

    def test_weighted_score_matches_manual_calculation(self):
        services.record_evidence(self.user, self.skill, EvidenceRecord.SOURCE_ASSESSMENT, raw_score=90, confidence=1.0)
        services.record_evidence(self.user, self.skill, EvidenceRecord.SOURCE_PROJECT, raw_score=80, confidence=0.9)
        services.record_evidence(self.user, self.skill, EvidenceRecord.SOURCE_RESUME, raw_score=70, confidence=0.8)
        services.record_evidence(self.user, self.skill, EvidenceRecord.SOURCE_SELF, raw_score=60, confidence=0.5)

        expected = round(90 * 0.40 + 80 * 0.30 + 70 * 0.20 + 60 * 0.10, 2)
        score = CompetencyScore.objects.get(user=self.user, skill=self.skill)
        self.assertEqual(score.score, expected)
        self.assertEqual(score.level, 'Advanced')  # 82 -> Advanced

    def test_multiple_records_same_source_are_confidence_weighted(self):
        services.record_evidence(self.user, self.skill, EvidenceRecord.SOURCE_ASSESSMENT, raw_score=100, confidence=1.0)
        services.record_evidence(self.user, self.skill, EvidenceRecord.SOURCE_ASSESSMENT, raw_score=50, confidence=0.2)
        # (100*1.0 + 50*0.2) / (1.0+0.2) = 91.67
        assessment_score, _ = services._aggregate_source(self.user, self.skill, EvidenceRecord.SOURCE_ASSESSMENT)
        self.assertAlmostEqual(assessment_score, 91.67, places=1)

    def test_score_to_level_thresholds(self):
        self.assertEqual(services.score_to_level(90), 'Expert')
        self.assertEqual(services.score_to_level(75), 'Advanced')
        self.assertEqual(services.score_to_level(50), 'Intermediate')
        self.assertEqual(services.score_to_level(10), 'Beginner')

    def test_history_entry_created_on_recompute(self):
        services.record_evidence(self.user, self.skill, EvidenceRecord.SOURCE_ASSESSMENT, raw_score=80, confidence=1.0)
        self.assertEqual(self.user.competency_history.count(), 1)


class CompetencyAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='bob@example.com', password='testpass123', name='Bob')
        self.skill = Skill.objects.create(name='SQL', slug='sql')
        self.client.force_authenticate(self.user)

    def test_skill_list_requires_auth(self):
        self.client.force_authenticate(None)
        response = self.client.get('/api/competencies/skills/')
        # Exact code (401 vs 403) depends on which DEFAULT_AUTHENTICATION_CLASSES
        # your project's settings.py configures - both mean "blocked".
        self.assertIn(response.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

    def test_skill_list(self):
        response = self.client.get('/api/competencies/skills/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_self_assessment_creates_evidence_and_score(self):
        response = self.client.post('/api/competencies/self-assessments/', {
            'skill': self.skill.id, 'self_rating': 70,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        score = CompetencyScore.objects.get(user=self.user, skill=self.skill)
        self.assertGreater(score.score, 0)

    def test_explain_endpoint(self):
        self.client.post('/api/competencies/self-assessments/', {'skill': self.skill.id, 'self_rating': 60})
        response = self.client.get(f'/api/competencies/scores/{self.skill.id}/explain/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('breakdown', response.data)

    def test_dashboard_endpoint_returns_expected_shape(self):
        self.client.post('/api/competencies/self-assessments/', {'skill': self.skill.id, 'self_rating': 60})
        response = self.client.get('/api/competencies/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for key in ('competency_score', 'career_readiness', 'verified', 'needs_verification', 'strengths', 'areas_to_improve'):
            self.assertIn(key, response.data)

    def test_readiness_endpoint_returns_none_without_career_requirements(self):
        # No `careers` app / career goal wired up yet -> should degrade gracefully.
        response = self.client.get('/api/competencies/readiness/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(response.data['readiness'])


class CareerReadinessAndVerificationTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='erin@example.com', password='testpass123', name='Erin')
        self.skill = Skill.objects.create(name='Docker', slug='docker')

    def test_readiness_returns_none_with_no_requirements(self):
        # get_career_requirements() falls back to {} until `careers` exists.
        self.assertIsNone(services.calculate_career_readiness(self.user))

    def test_verification_counts_split_by_confidence_threshold(self):
        skill_2 = Skill.objects.create(name='CI/CD', slug='cicd')
        CompetencyScore.objects.create(user=self.user, skill=self.skill, score=80, confidence=0.9)   # verified
        CompetencyScore.objects.create(user=self.user, skill=skill_2, score=20, confidence=0.1)       # not verified

        summary = services.get_verification_summary(self.user)
        self.assertEqual(summary['verified_count'], 1)
        self.assertEqual(summary['needs_verification_count'], 1)

    def test_dashboard_strengths_and_gaps_ordering(self):
        strong_skill = Skill.objects.create(name='Git', slug='git')
        CompetencyScore.objects.create(user=self.user, skill=self.skill, score=20, confidence=0.5)
        CompetencyScore.objects.create(user=self.user, skill=strong_skill, score=90, confidence=0.9)

        dashboard = services.build_dashboard(self.user)
        self.assertEqual(dashboard['strengths'][0]['skill'], 'Git')
        self.assertEqual(dashboard['areas_to_improve'][0]['skill'], 'Docker')
