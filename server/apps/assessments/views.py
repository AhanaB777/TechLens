from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response

from . import services
from .models import AssessmentAttempt
from .serializers import (
    AttemptDetailSerializer,
    AttemptResultSerializer,
    BuildAttemptSerializer,
    SkillCooldownSerializer,
    SubmitAttemptSerializer,
)


class StartAttemptView(views.APIView):
    """
    Engine-driven: builds ONE attempt spanning several
    important/uncertain/eligible skills. The student does not pick a
    skill - the engine decides what's worth testing right now, respecting
    the per-skill cooldown. Returns 200 (no attempt) if nothing currently
    needs testing.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        input_serializer = BuildAttemptSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)

        attempt = services.build_attempt(
            request.user,
            num_skills=input_serializer.validated_data['num_skills'],
            questions_per_skill=input_serializer.validated_data['questions_per_skill'],
        )
        if attempt is None:
            return Response(
                {'detail': 'Nothing to assess right now - relevant skills are either '
                           'well-evidenced already or in cooldown.'},
                status=status.HTTP_200_OK,
            )
        return Response(AttemptDetailSerializer(attempt).data, status=status.HTTP_201_CREATED)


class AttemptDetailView(views.APIView):
    """Fetch an in-progress attempt's questions (e.g. on page refresh)."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, attempt_id):
        attempt = get_object_or_404(AssessmentAttempt, id=attempt_id, user=request.user)
        return Response(AttemptDetailSerializer(attempt).data)


class SubmitAttemptView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, attempt_id):
        attempt = get_object_or_404(AssessmentAttempt, id=attempt_id, user=request.user)
        input_serializer = SubmitAttemptSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)

        try:
            attempt = services.submit_attempt(attempt, input_serializer.validated_data['answers'])
        except ValueError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(AttemptResultSerializer(attempt).data)


class MyAttemptsView(generics.ListAPIView):
    serializer_class = AttemptResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            AssessmentAttempt.objects
            .filter(user=self.request.user)
            .prefetch_related('skill_results__skill')
        )


class SkillCooldownView(views.APIView):
    """Per-skill cooldown status, so the frontend can show e.g.
    'you can retest Python in 4 days' instead of just hiding it."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        data = services.get_cooldown_status(request.user)
        return Response(SkillCooldownSerializer(data, many=True).data)
