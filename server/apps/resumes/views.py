from rest_framework import generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Resume
from .serializers import ResumeSerializer, ResumeUploadSerializer


class ResumeViewSet(ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return ResumeUploadSerializer
        return ResumeSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def set_primary(self, request, pk=None):
        """Set this resume as the primary resume for the user."""
        resume = self.get_object()
        Resume.objects.filter(user=request.user).update(is_primary=False)
        resume.is_primary = True
        resume.save()
        return Response({'status': 'primary resume updated'})

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def primary(self, request):
        """Get the user's primary resume."""
        primary_resume = Resume.objects.filter(user=request.user, is_primary=True).first()
        if primary_resume:
            serializer = self.get_serializer(primary_resume)
            return Response(serializer.data)
        return Response({'detail': 'No primary resume found'}, status=status.HTTP_404_NOT_FOUND)
