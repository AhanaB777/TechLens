from django.urls import path

from .views import (
    ActivateCareerGoalView,
    ActiveCareerGoalView,
    CareerDetailView,
    CareerGoalDetailView,
    CareerGoalListCreateView,
    CareerListView,
)

urlpatterns = [
    path('roles/', CareerListView.as_view(), name='career-list'),
    path('roles/<int:pk>/', CareerDetailView.as_view(), name='career-detail'),
    path('goals/', CareerGoalListCreateView.as_view(), name='career-goal-list-create'),
    path('goals/active/', ActiveCareerGoalView.as_view(), name='active-career-goal'),
    path('goals/<int:pk>/', CareerGoalDetailView.as_view(), name='career-goal-detail'),
    path('goals/<int:pk>/activate/', ActivateCareerGoalView.as_view(), name='career-goal-activate'),
]
