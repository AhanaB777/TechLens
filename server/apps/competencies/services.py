"""
Competency Engine.

Implements an explainable weighted evidence model:

    final_score = (assessment_score * assessment_weight)
                 + (project_score    * project_weight)
                 + (resume_score     * resume_weight)
                 + (self_score       * self_assessment_weight)

Weights are configurable via EvidenceWeightConfig, default 40/30/20/10.
No black-box ML - every score can be fully explained via explain_score().
"""
from django.db.models import Avg

from .models import (
    CompetencyScore,
    CompetencyScoreHistory,
    EvidenceRecord,
    EvidenceWeightConfig,
)

LEVEL_THRESHOLDS = [
    (85, 'Expert'),
    (70, 'Advanced'),
    (40, 'Intermediate'),
    (0, 'Beginner'),
]


def get_active_weight_config():
    config = EvidenceWeightConfig.objects.filter(is_active=True).first()
    if config is None:
        config = EvidenceWeightConfig.objects.create(name='default', is_active=True)
    return config


def score_to_level(score):
    for threshold, label in LEVEL_THRESHOLDS:
        if score >= threshold:
            return label
    return 'Beginner'


def _aggregate_source(user, skill, source_type):
    """
    Collapses all evidence of one source type into a single (score, confidence)
    pair, using a confidence-weighted average so one low-confidence data point
    can't dominate a source that already has stronger evidence.
    """
    records = EvidenceRecord.objects.filter(user=user, skill=skill, source_type=source_type)
    if not records.exists():
        return 0.0, 0.0

    total_weight = sum(r.confidence for r in records) or 1e-9
    weighted_score = sum(r.raw_score * r.confidence for r in records) / total_weight
    avg_confidence = records.aggregate(avg=Avg('confidence'))['avg'] or 0.0
    return round(weighted_score, 2), round(avg_confidence, 2)


def recompute_competency_score(user, skill):
    """
    Recomputes and persists CompetencyScore for (user, skill) from all
    currently stored EvidenceRecords, and appends a history snapshot.
    """
    config = get_active_weight_config()

    assessment_score, assessment_conf = _aggregate_source(user, skill, EvidenceRecord.SOURCE_ASSESSMENT)
    project_score, project_conf = _aggregate_source(user, skill, EvidenceRecord.SOURCE_PROJECT)
    resume_score, resume_conf = _aggregate_source(user, skill, EvidenceRecord.SOURCE_RESUME)
    self_score, self_conf = _aggregate_source(user, skill, EvidenceRecord.SOURCE_SELF)

    assessment_component = assessment_score * config.assessment_weight
    project_component = project_score * config.project_weight
    resume_component = resume_score * config.resume_weight
    self_component = self_score * config.self_assessment_weight

    final_score = round(
        assessment_component + project_component + resume_component + self_component, 2
    )

    # Confidence reflects how much evidence actually backs the score - a
    # skill with only a self-rating (weight 0.10) should end up with low
    # overall confidence even if that one rating was reported confidently.
    weighted_confidence = (
        assessment_conf * config.assessment_weight +
        project_conf * config.project_weight +
        resume_conf * config.resume_weight +
        self_conf * config.self_assessment_weight
    )
    final_confidence = round(min(max(weighted_confidence, 0.0), 1.0), 2)

    score_obj, _created = CompetencyScore.objects.update_or_create(
        user=user, skill=skill,
        defaults={
            'score': final_score,
            'level': score_to_level(final_score),
            'confidence': final_confidence,
            'assessment_component': round(assessment_component, 2),
            'project_component': round(project_component, 2),
            'resume_component': round(resume_component, 2),
            'self_assessment_component': round(self_component, 2),
        }
    )

    CompetencyScoreHistory.objects.create(
        user=user, skill=skill, score=final_score, confidence=final_confidence,
    )

    return score_obj


def record_evidence(user, skill, source_type, raw_score, confidence=1.0, reference_id=''):
    """
    Single entry point every app (assessments, resumes, projects, self-report
    forms) uses to submit new evidence. Automatically triggers a recompute.
    """
    raw_score = max(0.0, min(100.0, raw_score))
    confidence = max(0.0, min(1.0, confidence))

    record = EvidenceRecord.objects.create(
        user=user, skill=skill, source_type=source_type,
        raw_score=raw_score, confidence=confidence, reference_id=reference_id,
    )
    recompute_competency_score(user, skill)
    return record


def explain_score(user, skill):
    """
    Returns a breakdown of *why* a score is what it is - required so the
    result is explainable rather than a mysterious AI prediction.
    """
    score_obj, _ = CompetencyScore.objects.get_or_create(user=user, skill=skill)
    config = get_active_weight_config()
    return {
        'skill': skill.name,
        'score': score_obj.score,
        'level': score_obj.level,
        'confidence': score_obj.confidence,
        'breakdown': {
            'assessment': {'contribution': score_obj.assessment_component, 'weight': config.assessment_weight},
            'project': {'contribution': score_obj.project_component, 'weight': config.project_weight},
            'resume': {'contribution': score_obj.resume_component, 'weight': config.resume_weight},
            'self_assessment': {'contribution': score_obj.self_assessment_component, 'weight': config.self_assessment_weight},
        },
    }


def get_user_competency_scores(user):
    return CompetencyScore.objects.filter(user=user).select_related('skill')


# ---------------------------------------------------------------------------
# Career Readiness
#
# Competency answers "how capable is this student in a skill". Readiness
# answers "how well does that competency profile match THIS career's
# requirements". A student can have high competency overall but low
# readiness for a specific career if the skills that career weights most
# heavily are the student's weakest ones.
# ---------------------------------------------------------------------------

VERIFIED_CONFIDENCE_THRESHOLD = 0.5


def get_career_requirements(user):
    """
    Integration seam into the (not-yet-built) `careers` app.

    Expected shape once it exists: a CareerSkillRequirement model with
    `career`, `skill`, `importance` (0-1), and `target_level` (0-100)
    fields, resolved against the user's selected career goal (likely
    reached via profiles). Returns {} gracefully until that's wired up,
    so competencies/assessments aren't blocked waiting on it.

    Returns: {skill_id: {'importance': float, 'target_level': float}}
    """
    try:
        from apps.careers.models import CareerSkillRequirement  # noqa

        profile = getattr(user, 'profile', None)
        career_goal = getattr(profile, 'career_goal', None) if profile else None
        if not career_goal:
            return {}

        requirements = CareerSkillRequirement.objects.filter(career=career_goal).select_related('skill')
        return {
            r.skill_id: {
                'importance': getattr(r, 'importance', 0.5),
                'target_level': getattr(r, 'target_level', 70),
            }
            for r in requirements
        }
    except Exception:
        return {}


def calculate_career_readiness(user):
    """
    readiness = weighted current competency / weighted target competency x 100

    Explainable weighted competency coverage - never presented as a
    mysterious AI prediction. Returns None if the user has no career goal
    / requirements wired up yet (rather than a misleading 0%).
    """
    requirements = get_career_requirements(user)
    if not requirements:
        return None

    scores = {
        s.skill_id: s
        for s in CompetencyScore.objects.filter(user=user, skill_id__in=requirements.keys())
    }

    weighted_current = 0.0
    weighted_target = 0.0
    per_skill = []

    for skill_id, req in requirements.items():
        importance = req['importance']
        target_level = req['target_level']
        current = scores[skill_id].score if skill_id in scores else 0.0

        weighted_current += current * importance
        weighted_target += target_level * importance

        per_skill.append({
            'skill_id': skill_id,
            'current': current,
            'target': target_level,
            'importance': importance,
            'gap': round(max(target_level - current, 0), 2),
        })

    if weighted_target == 0:
        return None

    readiness = round(min((weighted_current / weighted_target) * 100, 100), 2)
    strongest = sorted(per_skill, key=lambda s: s['current'], reverse=True)[:3]
    weakest = sorted(per_skill, key=lambda s: s['gap'], reverse=True)[:3]

    return {
        'readiness': readiness,
        'per_skill': per_skill,
        'strongest_areas': strongest,
        'weakest_areas': weakest,
    }


def get_verification_summary(user):
    """
    'Verified' does NOT mean "skills the student claims". It means
    "skills TechLens has sufficient confidence in", based on the
    confidence produced by the weighted evidence model.
    """
    scores = CompetencyScore.objects.filter(user=user)
    verified = scores.filter(confidence__gte=VERIFIED_CONFIDENCE_THRESHOLD).count()
    needs_verification = scores.filter(confidence__lt=VERIFIED_CONFIDENCE_THRESHOLD).count()
    return {'verified_count': verified, 'needs_verification_count': needs_verification}


def get_strengths_and_gaps(user, limit=3):
    scores = CompetencyScore.objects.filter(user=user).select_related('skill')
    strengths = list(scores.order_by('-score')[:limit])
    gaps = list(scores.order_by('score')[:limit])
    return strengths, gaps


def build_dashboard(user):
    """
    One composed response for the frontend dashboard, so React doesn't have
    to call five endpoints and stitch them together itself.

    Deliberately does NOT compute profile_completeness - that's owned by
    profiles/resumes, not competencies. If the dashboard needs it, compose
    it at the API-gateway/frontend level, not inside this engine.
    """
    competency_score = round(
        CompetencyScore.objects.filter(user=user).aggregate(avg=Avg('score'))['avg'] or 0.0, 2
    )
    readiness_data = calculate_career_readiness(user)
    verification = get_verification_summary(user)
    strengths, gaps = get_strengths_and_gaps(user)

    return {
        'competency_score': competency_score,
        'career_readiness': readiness_data['readiness'] if readiness_data else None,
        'verified': {'count': verification['verified_count']},
        'needs_verification': {'count': verification['needs_verification_count']},
        'strengths': [{'skill': s.skill.name, 'score': s.score} for s in strengths],
        'areas_to_improve': [{'skill': s.skill.name, 'score': s.score} for s in gaps],
    }
