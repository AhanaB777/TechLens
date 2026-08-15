from django.contrib import admin

from .models import Assessment, AssessmentAttempt, Question, QuestionResponse, SkillResult


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1


@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'skill', 'difficulty', 'is_active')
    list_filter = ('difficulty', 'is_active')
    inlines = [QuestionInline]


@admin.register(AssessmentAttempt)
class AssessmentAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'overall_score', 'started_at', 'completed_at')
    list_filter = ('status',)


@admin.register(SkillResult)
class SkillResultAdmin(admin.ModelAdmin):
    list_display = ('attempt', 'skill', 'score', 'correct_count', 'total_count', 'recorded_at')
    list_filter = ('skill',)


admin.site.register(Question)
admin.site.register(QuestionResponse)
