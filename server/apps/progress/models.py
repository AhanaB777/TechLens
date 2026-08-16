from django.conf import settings
from django.db import models


class ReadinessSnapshot(models.Model):
    """
    A point-in-time readiness reading. Nothing else in the system stores
    this over time - competencies.calculate_career_readiness() is always
    computed live. This model exists specifically to give `progress`
    something to chart.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='readiness_snapshots')
    career = models.ForeignKey('career.Career', on_delete=models.SET_NULL, null=True, blank=True)
    readiness_score = models.FloatField(null=True, blank=True)  # null if no career goal was set at snapshot time
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'readiness_snapshot'
        ordering = ['recorded_at']

    def __str__(self):
        return f"{self.user.email} - {self.readiness_score} at {self.recorded_at.date()}"