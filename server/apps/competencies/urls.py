from django.urls import path

from . import views

app_name = 'competencies'

urlpatterns = [
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('readiness/', views.CareerReadinessView.as_view(), name='readiness'),
    path('skills/', views.SkillListView.as_view(), name='skill-list'),
    path('scores/', views.MyCompetencyScoresView.as_view(), name='my-scores'),
    path('scores/<int:skill_id>/explain/', views.CompetencyExplainView.as_view(), name='score-explain'),
    path('scores/<int:skill_id>/history/', views.SkillScoreHistoryView.as_view(), name='score-history'),
    path('self-assessments/', views.SelfAssessmentCreateView.as_view(), name='self-assessment-create'),
]
