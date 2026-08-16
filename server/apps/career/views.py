from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response

from .models import Career, CareerGoal
from .serializers import (
    CareerGoalSerializer,
    CareerGoalWriteSerializer,
    CareerSerializer,
)
from .services import get_primary_career_goal, set_primary_career_goal


class CareerListView(generics.ListAPIView):
    queryset = Career.objects.filter(is_active=True).prefetch_related('skill_requirements__skill')
    serializer_class = CareerSerializer
    permission_classes = [permissions.IsAuthenticated]


class CareerDetailView(generics.RetrieveAPIView):
    queryset = Career.objects.filter(is_active=True).prefetch_related('skill_requirements__skill')
    serializer_class = CareerSerializer
    permission_classes = [permissions.IsAuthenticated]


class CareerGoalListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            CareerGoal.objects
            .filter(user=self.request.user)
            .select_related('career')
            .prefetch_related('career__skill_requirements__skill')
        )

    def get_serializer_class(self):
        return CareerGoalWriteSerializer if self.request.method == 'POST' else CareerGoalSerializer

    def perform_create(self, serializer):
        serializer.save()


class CareerGoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            CareerGoal.objects
            .filter(user=self.request.user)
            .select_related('career')
            .prefetch_related('career__skill_requirements__skill')
        )

    def get_serializer_class(self):
        return CareerGoalWriteSerializer if self.request.method in {'PUT', 'PATCH'} else CareerGoalSerializer

    def perform_destroy(self, instance):
        was_primary = instance.is_primary
        instance.delete()
        if was_primary:
            replacement = self.get_queryset().first()
            if replacement:
                set_primary_career_goal(self.request.user, replacement)


class ActivateCareerGoalView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        goal = get_object_or_404(CareerGoal, pk=pk, user=request.user)
        goal = set_primary_career_goal(request.user, goal)
        return Response(CareerGoalSerializer(goal).data)


class ActiveCareerGoalView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        goal = get_primary_career_goal(request.user)
        if goal is None:
            return Response({'goal': None})
        return Response({'goal': CareerGoalSerializer(goal).data})
