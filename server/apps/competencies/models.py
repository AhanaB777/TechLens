from django.conf import settings
from django.db import models


class Skill(models.Model):
    """
    Canonical skill definition, shared across assessments, competencies,
    roadmap and progress. Owned here because skill identity/taxonomy is
    fundamentally a competency concern.
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=110, unique=True)
    category = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class EvidenceWeightConfig(models.Model):
    """
    Configurable weights for the explainable weighted evidence model.
    Modeled as a table (not hardcoded constants) so weights can be tuned
    without a code deploy. Exactly one row should have is_active=True.
    """
    name = models.CharField(max_length=50, default='default')
    assessment_weight = models.FloatField(default=0.40)
    project_weight = models.FloatField(default=0.30)
    resume_weight = models.FloatField(default=0.20)
    self_assessment_weight = models.FloatField(default=0.10)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def weight_sum(self):
        return round(
            self.assessment_weight + self.project_weight +
            self.resume_weight + self.self_assessment_weight, 4
        )

    def __str__(self):
        return f"{self.name} ({'active' if self.is_active else 'inactive'})"


class EvidenceRecord(models.Model):
    """
    Normalized evidence entry point. Any app (assessments now; resumes /
    projects / careers later) writes here via
    competencies.services.record_evidence(...) instead of touching
    CompetencyScore directly. Keeps the competency engine decoupled from
    where evidence actually comes from.
    """
    SOURCE_ASSESSMENT = 'assessment'
    SOURCE_PROJECT = 'project'
    SOURCE_RESUME = 'resume'
    SOURCE_SELF = 'self_assessment'
    SOURCE_CHOICES = [
        (SOURCE_ASSESSMENT, 'Assessment'),
        (SOURCE_PROJECT, 'Project / Practical'),
        (SOURCE_RESUME, 'Resume'),
        (SOURCE_SELF, 'Self Assessment'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='evidence_records')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='evidence_records')
    source_type = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    raw_score = models.FloatField()          # 0-100, normalized by the producer
    confidence = models.FloatField(default=1.0)  # 0-1, trust in this single record
    reference_id = models.CharField(max_length=64, blank=True)  # e.g. AssessmentAttempt.id
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [models.Index(fields=['user', 'skill', 'source_type'])]

    def __str__(self):
        return f"{self.user} - {self.skill} - {self.source_type}: {self.raw_score}"


class CompetencyScore(models.Model):
    """
    A user's current computed competency for a skill. Derived/cached,
    recomputed by the Competency Engine whenever new evidence arrives.
    """
    LEVEL_BEGINNER = 'Beginner'
    LEVEL_INTERMEDIATE = 'Intermediate'
    LEVEL_ADVANCED = 'Advanced'
    LEVEL_EXPERT = 'Expert'
    LEVEL_CHOICES = [
        (LEVEL_BEGINNER, 'Beginner'),
        (LEVEL_INTERMEDIATE, 'Intermediate'),
        (LEVEL_ADVANCED, 'Advanced'),
        (LEVEL_EXPERT, 'Expert'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='competency_scores')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='competency_scores')
    score = models.FloatField(default=0)        # 0-100
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default=LEVEL_BEGINNER)
    confidence = models.FloatField(default=0)   # 0-1

    # explainability breakdown - each evidence source's contribution to `score`
    assessment_component = models.FloatField(default=0)
    project_component = models.FloatField(default=0)
    resume_component = models.FloatField(default=0)
    self_assessment_component = models.FloatField(default=0)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'skill')
        ordering = ['-score']

    def __str__(self):
        return f"{self.user} - {self.skill}: {self.score}"


class CompetencyScoreHistory(models.Model):
    """
    Append-only snapshot log. Consumed by the progress app to build the
    competencyGrowth time series.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='competency_history')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='history_entries')
    score = models.FloatField()
    confidence = models.FloatField()
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['recorded_at']


class SelfAssessment(models.Model):
    """User-reported skill rating - one of the four evidence sources."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='self_assessments')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='self_assessments')
    self_rating = models.PositiveSmallIntegerField()  # 0-100
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} rates {self.skill} at {self.self_rating}"
