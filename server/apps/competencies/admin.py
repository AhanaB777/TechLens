from django.contrib import admin

from .models import (
    CompetencyScore,
    CompetencyScoreHistory,
    EvidenceRecord,
    EvidenceWeightConfig,
    SelfAssessment,
    Skill,
)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'slug')
    search_fields = ('name', 'category')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(EvidenceWeightConfig)
class EvidenceWeightConfigAdmin(admin.ModelAdmin):
    list_display = ('name', 'assessment_weight', 'project_weight', 'resume_weight', 'self_assessment_weight', 'is_active')


@admin.register(EvidenceRecord)
class EvidenceRecordAdmin(admin.ModelAdmin):
    list_display = ('user', 'skill', 'source_type', 'raw_score', 'confidence', 'created_at')
    list_filter = ('source_type',)


@admin.register(CompetencyScore)
class CompetencyScoreAdmin(admin.ModelAdmin):
    list_display = ('user', 'skill', 'score', 'level', 'confidence', 'updated_at')
    list_filter = ('level',)


@admin.register(CompetencyScoreHistory)
class CompetencyScoreHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'skill', 'score', 'confidence', 'recorded_at')


@admin.register(SelfAssessment)
class SelfAssessmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'skill', 'self_rating', 'created_at')
