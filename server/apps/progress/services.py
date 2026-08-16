from apps.competencies import services as competency_services
from .models import ReadinessSnapshot


def record_readiness_snapshot(user):
    """
    Computes current readiness and stores it as a history point. Call this
    periodically (e.g. after each assessment submission, or on a daily
    scheduled job) - it's what makes readinessHistory non-empty over time.
    """
    data = competency_services.calculate_career_readiness(user)
    readiness_score = data['readiness'] if data else None

    profile = getattr(user, 'profile', None)
    career = getattr(profile, 'career_goal', None) if profile else None

    return ReadinessSnapshot.objects.create(user=user, career=career, readiness_score=readiness_score)