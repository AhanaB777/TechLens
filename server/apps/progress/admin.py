from django.contrib import admin
from .models import ReadinessSnapshot

@admin.register(ReadinessSnapshot)
class ReadinessSnapshotAdmin(admin.ModelAdmin):
    list_display = ['user', 'career', 'readiness_score', 'recorded_at']
    list_filter = ['recorded_at', 'career']
    search_fields = ['user__email']
    readonly_fields = ['recorded_at']