from django.conf import settings
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, default='')
    location = models.CharField(max_length=120, blank=True, default='')
    website = models.URLField(blank=True, default='')
    headline = models.CharField(max_length=200, blank=True, default='')
    
    # Skills extracted from resume
    skills = models.JSONField(default=list, blank=True, help_text="List of extracted skills")
    tech_stack = models.JSONField(default=list, blank=True, help_text="List of technologies and frameworks")
    
    # Experience and education extracted from resume
    experience = models.JSONField(default=list, blank=True, help_text="Work experience extracted from resume")
    education = models.JSONField(default=list, blank=True, help_text="Education details extracted from resume")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s profile"
