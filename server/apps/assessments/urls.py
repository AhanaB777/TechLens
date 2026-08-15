from django.urls import path

from . import views

app_name = 'assessments'

urlpatterns = [
    path('start/', views.StartAttemptView.as_view(), name='start'),
    path('attempts/mine/', views.MyAttemptsView.as_view(), name='my-attempts'),
    path('attempts/<int:attempt_id>/', views.AttemptDetailView.as_view(), name='attempt-detail'),
    path('attempts/<int:attempt_id>/submit/', views.SubmitAttemptView.as_view(), name='submit'),
    path('cooldowns/', views.SkillCooldownView.as_view(), name='cooldowns'),
]
