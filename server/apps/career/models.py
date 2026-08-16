from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class Career(models.Model):
    """A reusable career definition and its competency requirements."""

    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=170, unique=True)
    description = models.TextField(blank=True, default='')
    category = models.CharField(max_length=100, blank=True, default='')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class CareerSkillRequirement(models.Model):
    """Connects a career to a reusable competency skill."""

    career = models.ForeignKey(
        Career,
        on_delete=models.CASCADE,
        related_name='skill_requirements',
    )
    skill = models.ForeignKey(
        'competencies.Skill',
        on_delete=models.PROTECT,
        related_name='career_requirements',
    )
    importance = models.FloatField(default=0.5)
    target_level = models.FloatField(default=70)
    is_required = models.BooleanField(default=False)

    class Meta:
        ordering = ['-is_required', '-importance', 'skill__name']
        constraints = [
            models.UniqueConstraint(
                fields=['career', 'skill'],
                name='unique_career_skill_requirement',
            ),
        ]

    def clean(self):
        errors = {}
        if not 0 <= self.importance <= 1:
            errors['importance'] = 'importance must be between 0 and 1.'
        if not 0 <= self.target_level <= 100:
            errors['target_level'] = 'target_level must be between 0 and 100.'
        if errors:
            raise ValidationError(errors)

    def __str__(self):
        return f'{self.career} - {self.skill}'


class CareerGoal(models.Model):
    """A user's selected career direction. A user may keep up to two goals."""

    EXPERIENCE_LEVELS = [
        ('Entry Level', 'Entry Level'),
        ('Early Career', 'Early Career'),
        ('Mid Level', 'Mid Level'),
        ('Senior Level', 'Senior Level'),
    ]
    TIMELINE_OPTIONS = [
        ('3 months', '3 months'),
        ('6 months', '6 months'),
        ('9 months', '9 months'),
        ('12 months', '12 months'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='career_goals',
    )
    career = models.ForeignKey(
        Career,
        on_delete=models.PROTECT,
        related_name='user_goals',
    )
    experience_level = models.CharField(
        max_length=30,
        choices=EXPERIENCE_LEVELS,
        default='Entry Level',
    )
    target_timeline = models.CharField(
        max_length=20,
        choices=TIMELINE_OPTIONS,
        default='6 months',
    )
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_primary', '-updated_at']
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'career'],
                name='unique_user_career_goal',
            ),
        ]

    def save(self, *args, **kwargs):
        if not self.pk and not CareerGoal.objects.filter(user=self.user).exists():
            self.is_primary = True

        if self.is_primary:
            CareerGoal.objects.filter(user=self.user).exclude(pk=self.pk).update(is_primary=False)

        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.user} → {self.career}'
