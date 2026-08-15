from django.conf import settings
from django.db import models

from apps.competencies.models import Skill


class Assessment(models.Model):
    """
    A question POOL for one skill at one difficulty level - NOT a single
    test a student takes. The engine pulls questions from one or more of
    these pools into a single AssessmentAttempt that can span several
    skills, so a student takes ONE test covering multiple
    important/uncertain skills instead of one test per skill.
    """
    DIFFICULTY_BEGINNER = 'beginner'
    DIFFICULTY_INTERMEDIATE = 'intermediate'
    DIFFICULTY_ADVANCED = 'advanced'
    DIFFICULTY_CHOICES = [
        (DIFFICULTY_BEGINNER, 'Beginner'),
        (DIFFICULTY_INTERMEDIATE, 'Intermediate'),
        (DIFFICULTY_ADVANCED, 'Advanced'),
    ]

    title = models.CharField(max_length=150)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='assessment_pools')
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default=DIFFICULTY_BEGINNER)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['skill', 'difficulty']

    def __str__(self):
        return f"{self.skill.name} question pool ({self.difficulty})"


class Question(models.Model):
    TYPE_MCQ = 'mcq'
    TYPE_TRUE_FALSE = 'true_false'
    QUESTION_TYPE_CHOICES = [
        (TYPE_MCQ, 'Multiple Choice'),
        (TYPE_TRUE_FALSE, 'True/False'),
    ]

    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE_CHOICES, default=TYPE_MCQ)
    options = models.JSONField(default=list, blank=True)  # e.g. ["A", "B", "C", "D"]
    correct_answer = models.CharField(max_length=255)
    points = models.PositiveSmallIntegerField(default=1)

    @property
    def skill(self):
        """A question's skill is inherited from its pool."""
        return self.assessment.skill

    def __str__(self):
        return self.text[:60]


class AssessmentAttempt(models.Model):
    """
    One testing SESSION for a user. Can span multiple skills at once - the
    engine decides which skills/questions go into it. This is what the
    frontend calls "take an assessment": one sitting, several skills.
    """
    STATUS_IN_PROGRESS = 'in_progress'
    STATUS_COMPLETED = 'completed'
    STATUS_ABANDONED = 'abandoned'
    STATUS_CHOICES = [
        (STATUS_IN_PROGRESS, 'In Progress'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_ABANDONED, 'Abandoned'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assessment_attempts')
    questions = models.ManyToManyField(Question, related_name='attempts', blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_IN_PROGRESS)
    overall_score = models.FloatField(null=True, blank=True)  # percentage across ALL questions, all skills
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.user} attempt #{self.pk} ({self.status})"


class QuestionResponse(models.Model):
    attempt = models.ForeignKey(AssessmentAttempt, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='responses')
    submitted_answer = models.CharField(max_length=255, blank=True)
    is_correct = models.BooleanField(default=False)

    class Meta:
        unique_together = ('attempt', 'question')


class SkillResult(models.Model):
    """
    Per-skill outcome within one attempt. An attempt spanning
    Python + SQL + Docker produces 3 of these. This is:
      1. the "evidence" handed to the Competency Engine, and
      2. what enforces the 10-day per-skill cooldown (see services.py).
    """
    attempt = models.ForeignKey(AssessmentAttempt, on_delete=models.CASCADE, related_name='skill_results')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='assessment_results')
    score = models.FloatField()  # 0-100, this skill's slice of the attempt
    correct_count = models.PositiveSmallIntegerField()
    total_count = models.PositiveSmallIntegerField()
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-recorded_at']
        unique_together = ('attempt', 'skill')

    def __str__(self):
        return f"{self.attempt.user} - {self.skill}: {self.score}"
