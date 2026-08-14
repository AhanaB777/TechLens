from django.contrib import admin

from .models import Resume


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('user', 'file_name', 'uploaded_at', 'is_primary', 'extraction_status')
    list_filter = ('is_primary', 'extraction_status', 'uploaded_at')
    search_fields = ('user__username', 'file_name')
    readonly_fields = ('uploaded_at', 'updated_at', 'extraction_status', 'extracted_skills', 'extracted_experience', 'extracted_education')
