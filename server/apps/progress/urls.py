from django.urls import path
from .views import ProgressDashboardView

urlpatterns = [
    path('dashboard/', ProgressDashboardView.as_view(), name='progress-dashboard'),
]