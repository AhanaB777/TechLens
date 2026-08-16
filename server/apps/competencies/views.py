from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, views
from rest_framework.response import Response

from . import services
from .models import Skill
from .serializers import (
    CompetencyExplainSerializer,
    CompetencyScoreHistorySerializer,
    CompetencyScoreSerializer,
    DashboardSerializer,
    SelfAssessmentCreateSerializer,
    SkillSerializer,
)


class SkillListView(generics.ListAPIView):
    """Read-only skill catalogue. Skill creation is an admin/seed concern."""
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]


class MyCompetencyScoresView(generics.ListAPIView):
    """All current competency scores for the logged-in user."""
    serializer_class = CompetencyScoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return services.get_user_competency_scores(self.request.user)


class CompetencyExplainView(views.APIView):
    """Explainable breakdown of one skill's score for the logged-in user."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, skill_id):
        skill = get_object_or_404(Skill, id=skill_id)
        data = services.explain_score(request.user, skill)
        return Response(CompetencyExplainSerializer(data).data)


class DashboardView(views.APIView):
    """
    Composed response for the competency dashboard - competency_score,
    career_readiness, verified/needs_verification counts, strengths, and
    areas_to_improve, in one call.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        data = services.build_dashboard(request.user)
        return Response(DashboardSerializer(data).data)


class CareerReadinessView(views.APIView):
    """
    Career readiness detail: overall readiness percentage plus the
    per-skill breakdown (current vs target vs gap) that explains it.

    By default, evaluates against the user's current profile.career_goal.
    Pass ?career_id=<id> to check readiness against ANY career - lets a
    student compare readiness across multiple career paths without
    changing their actual profile goal.

    Returns null readiness if no career goal/requirements are set yet, or
    if the requested career_id doesn't resolve to a real career (until
    the `careers` app exists, this will always be the case).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        career = None
        career_id = request.query_params.get('career_id')
        if career_id:
            try:
                from apps.careers.models import Career  # noqa
                career = Career.objects.filter(id=career_id).first()
            except Exception:
                career = None

        data = services.calculate_career_readiness(request.user, career=career)
        if data is None:
            return Response({
                'readiness': None,
                'detail': 'No career goal or requirements found for this user yet.',
            })
        return Response(data)


class SkillScoreHistoryView(generics.ListAPIView):
    """Historical score points for one skill - powers frontend trend charts."""
    serializer_class = CompetencyScoreHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        from .models import CompetencyScoreHistory
        return CompetencyScoreHistory.objects.filter(
            user=self.request.user, skill_id=self.kwargs['skill_id'],
        ).order_by('recorded_at')


class SelfAssessmentCreateView(generics.CreateAPIView):
    """
    Lets a user submit a self-rating for a skill. Becomes one of the four
    evidence sources in the weighted competency model.
    """
    serializer_class = SelfAssessmentCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        self_assessment = serializer.save(user=self.request.user)
        services.record_evidence(
            user=self.request.user,
            skill=self_assessment.skill,
            source_type='self_assessment',
            raw_score=self_assessment.self_rating,
            confidence=0.5,  # self-reported evidence is inherently lower-confidence
            reference_id=str(self_assessment.id),
        )
