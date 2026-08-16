"""
Seeds one shared demo user with realistic resume evidence across the 9
question-bank skills, so every teammate gets IDENTICAL demo data locally
after pulling the repo - no manual shell copy-pasting, no drift between
machines.

Deliberately does NOT seed any assessment evidence - every skill should
stay eligible for a live "Take assessment" click during the actual demo,
not locked in cooldown from a pre-seeded test result.

Idempotent: safe to re-run. Won't duplicate the user or pile up duplicate
evidence records on repeat runs.

Usage:
    python manage.py seed_demo_data
"""
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.competencies.models import EvidenceRecord, Skill
from apps.competencies import services as competency_services

DEMO_EMAIL = 'demo_final@example.com'
DEMO_PASSWORD = 'demoday2026'
DEMO_NAME = 'Demo Final'

# Deliberately varied, not flat, so the profile looks like a real student
# rather than obviously synthetic data.
RESUME_SCORES = {
    'python': 75, 'sql': 70, 'docker': 55,
    'javascript': 60, 'html': 68, 'css': 62,
    'java': 50, 'github': 72, 'mysql': 58,
}


class Command(BaseCommand):
    help = 'Seeds the shared demo user (demo_final) with resume evidence, identically on every machine.'

    @transaction.atomic
    def handle(self, *args, **options):
        User = get_user_model()

        user, created = User.objects.get_or_create(
            email=DEMO_EMAIL, defaults={'name': DEMO_NAME},
        )
        if created:
            user.set_password(DEMO_PASSWORD)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Created demo user: {DEMO_EMAIL}'))
        else:
            self.stdout.write(f'Demo user already exists: {DEMO_EMAIL}')

        seeded_count = 0
        for slug, raw_score in RESUME_SCORES.items():
            try:
                skill = Skill.objects.get(slug=slug)
            except Skill.DoesNotExist:
                self.stdout.write(self.style.WARNING(
                    f'Skill "{slug}" not found - run seed_question_bank first.'
                ))
                continue

            # idempotency guard: don't pile up duplicate resume evidence on repeat runs
            already_seeded = EvidenceRecord.objects.filter(
                user=user, skill=skill, source_type=EvidenceRecord.SOURCE_RESUME,
            ).exists()
            if already_seeded:
                continue

            competency_services.record_evidence(
                user=user, skill=skill, source_type='resume',
                raw_score=raw_score, confidence=0.6,
            )
            seeded_count += 1

        self.stdout.write(self.style.SUCCESS(
            f'Demo data ready. Login: {DEMO_EMAIL} / {DEMO_PASSWORD}. '
            f'Seeded {seeded_count} new resume evidence records.'
        ))
