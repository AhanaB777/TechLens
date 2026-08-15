"""
Assessment Engine.

Three responsibilities:
1. Decide WHICH skills are worth testing right now (career-relevant,
   low-confidence, not in cooldown) - never "test every skill".
2. Build ONE attempt spanning several of those skills at once, at a
   difficulty matched to the student's current estimated level.
3. Grade the attempt per-skill and feed each skill's result into the
   Competency Engine as evidence.

Assessment scores are NEVER the final competency score - they're one
input the Competency Engine blends with project/resume/self evidence.
"""
import random
from datetime import timedelta

from django.db.models import Max
from django.utils import timezone

from apps.competencies import services as competency_services
from apps.competencies.models import CompetencyScore

from .models import Assessment, AssessmentAttempt, Question, QuestionResponse, SkillResult

# A skill that was just tested can't be tested again for this many days,
# so students aren't hammered with repeat tests for the same skill.
COOLDOWN_DAYS = 10


# ---------------------------------------------------------------------------
# Cooldown
# ---------------------------------------------------------------------------

def _is_skill_in_cooldown(user, skill):
    cutoff = timezone.now() - timedelta(days=COOLDOWN_DAYS)
    return SkillResult.objects.filter(attempt__user=user, skill=skill, recorded_at__gte=cutoff).exists()


def get_cooldown_status(user):
    """
    Per-skill cooldown status for the user, so the frontend can show
    "you can retest Python in 4 days" instead of just hiding it silently.
    """
    rows = (
        SkillResult.objects
        .filter(attempt__user=user)
        .values('skill_id', 'skill__name')
        .annotate(last_tested=Max('recorded_at'))
    )
    now = timezone.now()
    result = []
    for row in rows:
        available_at = row['last_tested'] + timedelta(days=COOLDOWN_DAYS)
        result.append({
            'skill': row['skill__name'],
            'last_tested': row['last_tested'],
            'in_cooldown': available_at > now,
            'available_at': available_at,
        })
    return result


# ---------------------------------------------------------------------------
# Skill selection (which skills deserve a test right now)
# ---------------------------------------------------------------------------

def _get_target_skill_importance(user):
    """Career importance per skill, via the competencies integration seam."""
    requirements = competency_services.get_career_requirements(user)
    return {skill_id: req['importance'] for skill_id, req in requirements.items()}


def _current_competency(user, skill):
    score = CompetencyScore.objects.filter(user=user, skill=skill).first()
    if not score:
        return 0.0, 0.0
    return score.score, score.confidence


def _previous_performance_factor(user, skill):
    """
    Recently-good performance lowers priority to retest; never-tested or
    poor performance raises it. Returns a multiplier in (0, 1].
    """
    last_result = (
        SkillResult.objects
        .filter(attempt__user=user, skill=skill)
        .order_by('-recorded_at')
        .first()
    )
    if not last_result:
        return 1.0
    return round(max(0.1, 1 - (last_result.score / 100)), 2)


def select_skills_to_assess(user, limit=3):
    """
    priority = career_importance x (1 - current_confidence) x previous_performance_factor

    Skills currently in cooldown are excluded entirely, regardless of
    priority - the cooldown is a hard rule, not a factor to outweigh.
    """
    importance_map = _get_target_skill_importance(user)

    from apps.competencies.models import Skill
    candidate_skills = Skill.objects.filter(id__in=importance_map.keys()) if importance_map else Skill.objects.filter(
        assessment_pools__is_active=True
    ).distinct()

    scored = []
    for skill in candidate_skills:
        if _is_skill_in_cooldown(user, skill):
            continue
        importance = importance_map.get(skill.id, 0.5)
        _current_score, confidence = _current_competency(user, skill)
        perf_factor = _previous_performance_factor(user, skill)
        priority = round(importance * (1 - confidence) * perf_factor, 4)
        scored.append((priority, skill))

    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [skill for _priority, skill in scored[:limit]]


# ---------------------------------------------------------------------------
# Building and grading attempts
# ---------------------------------------------------------------------------

def _difficulty_for_score(score):
    if score >= 70:
        return Assessment.DIFFICULTY_ADVANCED
    if score >= 40:
        return Assessment.DIFFICULTY_INTERMEDIATE
    return Assessment.DIFFICULTY_BEGINNER


def build_attempt(user, num_skills=3, questions_per_skill=5):
    """
    Builds ONE AssessmentAttempt spanning up to `num_skills` skills that
    are worth testing right now, at a difficulty matched to the student's
    current estimated level for each skill.

    Returns None if there's nothing worth testing (everything relevant is
    either well-evidenced already or in cooldown) - the student is never
    forced into a pointless test.
    """
    skills_to_assess = select_skills_to_assess(user, limit=num_skills)
    if not skills_to_assess:
        return None

    selected_questions = []
    for skill in skills_to_assess:
        current_score, _confidence = _current_competency(user, skill)
        difficulty = _difficulty_for_score(current_score)

        pool = Assessment.objects.filter(skill=skill, is_active=True, difficulty=difficulty).first()
        if not pool:
            pool = Assessment.objects.filter(skill=skill, is_active=True).first()
        if not pool:
            continue

        pool_questions = list(pool.questions.all())
        random.shuffle(pool_questions)
        selected_questions.extend(pool_questions[:questions_per_skill])

    if not selected_questions:
        return None

    attempt = AssessmentAttempt.objects.create(user=user)
    attempt.questions.set(selected_questions)
    return attempt


def submit_attempt(attempt, answers):
    """
    answers: list of {"question_id": int, "answer": str}

    Grades per-skill (an attempt can span several skills), persists a
    SkillResult per skill, and feeds each skill's result into the
    Competency Engine as evidence. Returns the completed attempt.
    """
    if attempt.status == AssessmentAttempt.STATUS_COMPLETED:
        raise ValueError('This attempt has already been submitted.')

    questions = list(attempt.questions.select_related('assessment__skill').all())
    if not questions:
        raise ValueError('This attempt has no questions.')

    answer_map = {}
    for item in answers:
        qid = item.get('question_id')
        answer_map[qid] = str(item.get('answer', '')).strip()

    by_skill = {}
    for question in questions:
        by_skill.setdefault(question.skill, []).append(question)

    total_earned, total_points = 0, 0

    for skill, skill_questions in by_skill.items():
        skill_earned, skill_points, correct_count = 0, 0, 0

        for question in skill_questions:
            submitted = answer_map.get(question.id, '')
            is_correct = submitted.lower() == question.correct_answer.strip().lower()

            QuestionResponse.objects.update_or_create(
                attempt=attempt, question=question,
                defaults={'submitted_answer': submitted, 'is_correct': is_correct},
            )

            skill_points += question.points
            if is_correct:
                skill_earned += question.points
                correct_count += 1

        skill_score = round((skill_earned / skill_points) * 100, 2) if skill_points else 0.0

        SkillResult.objects.create(
            attempt=attempt, skill=skill, score=skill_score,
            correct_count=correct_count, total_count=len(skill_questions),
        )

        # Assessment evidence is high-confidence: a controlled, graded
        # measurement rather than a self-report.
        competency_services.record_evidence(
            user=attempt.user, skill=skill, source_type='assessment',
            raw_score=skill_score, confidence=0.9, reference_id=str(attempt.id),
        )

        total_earned += skill_earned
        total_points += skill_points

    attempt.overall_score = round((total_earned / total_points) * 100, 2) if total_points else 0.0
    attempt.status = AssessmentAttempt.STATUS_COMPLETED
    attempt.completed_at = timezone.now()
    attempt.save(update_fields=['overall_score', 'status', 'completed_at'])

    return attempt


def abandon_attempt(attempt):
    attempt.status = AssessmentAttempt.STATUS_ABANDONED
    attempt.completed_at = timezone.now()
    attempt.save(update_fields=['status', 'completed_at'])
    return attempt
