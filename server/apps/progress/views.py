from rest_framework import permissions, views
from rest_framework.response import Response

from apps.assessments.models import AssessmentAttempt
from apps.competencies.models import CompetencyScoreHistory
from apps.competencies import services as competency_services
from .models import ReadinessSnapshot


class ProgressDashboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = getattr(user, 'profile', None)
        career = getattr(profile, 'career_goal', None) if profile else None

        readiness_history = [
            {'date': s.recorded_at.date().isoformat(), 'readiness': s.readiness_score}
            for s in ReadinessSnapshot.objects.filter(user=user).order_by('recorded_at')
        ]

        competency_growth = [
            {'date': h.recorded_at.date().isoformat(), 'skill': h.skill.name, 'score': h.score}
            for h in CompetencyScoreHistory.objects.filter(user=user).select_related('skill').order_by('recorded_at')
        ]

        assessments_history = [
            {
                'date': a.completed_at.date().isoformat() if a.completed_at else None,
                'overall_score': a.overall_score,
                'skills': [r.skill.name for r in a.skill_results.all()],
            }
            for a in AssessmentAttempt.objects.filter(user=user, status='completed').select_related().prefetch_related('skill_results__skill').order_by('-completed_at')[:20]
        ]

        readiness_data = competency_services.calculate_career_readiness(user)
        open_priority_areas = (
            [{'skill': s['skill'], 'gap': s['gap']} for s in readiness_data['weakest_areas']]  # changed to skill name to match spec
            if readiness_data and 'weakest_areas' in readiness_data else []
        )

        return Response({
            'careerGoal': {'role': career.role, 'level': career.get_level_display()} if career else None,
            'readinessHistory': readiness_history,
            'competencyGrowth': competency_growth,
            'roadmapProgress': {},   # placeholder until `roadmap` exists
            'milestones': [],        # placeholder until `roadmap` exists
            'assessments': assessments_history,
            'openPriorityAreas': open_priority_areas,
        })