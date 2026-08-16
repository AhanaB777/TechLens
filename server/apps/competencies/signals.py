"""
Wires resume-extracted skills into the Competency Engine as evidence.

Deliberately lives here (competencies), not in resumes/signals.py, so we
don't collide with the resumes team's file. Uses a string sender reference
('resumes.Resume') rather than importing the model directly, so app-loading
order between competencies/resumes doesn't matter.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import EvidenceRecord, Skill
from . import services as competency_services

# PLACEHOLDER: the resume analyzer currently returns skill presence only
# (a flat list of strings), not a per-skill confidence/score. Using a flat
# moderate score/confidence until the analyzer returns real per-skill data -
# same placeholder used elsewhere (see README "Known gaps").
RESUME_EVIDENCE_SCORE = 65
RESUME_EVIDENCE_CONFIDENCE = 0.6


def _slugify(name):
    return str(name).strip().lower().replace(' ', '-')


@receiver(post_save, sender='resumes.Resume')
def record_resume_evidence(sender, instance, **kwargs):
    """
    Fires on every Resume save. Only acts once extraction has actually
    completed, and is idempotent per (user, skill, resume) - re-saving an
    already-processed Resume (e.g. unrelated field updates) won't create
    duplicate evidence records.
    """
    if getattr(instance, 'extraction_status', None) != 'completed':
        return

    skill_names = list(getattr(instance, 'extracted_skills', None) or []) + \
        list(getattr(instance, 'extracted_tech_stack', None) or [])

    seen = set()
    for raw_name in skill_names:
        name = str(raw_name).strip()
        if not name or name.lower() in seen:
            continue
        seen.add(name.lower())

        skill, _ = Skill.objects.get_or_create(
            slug=_slugify(name), defaults={'name': name.title()},
        )

        already_recorded = EvidenceRecord.objects.filter(
            user=instance.user, skill=skill, source_type=EvidenceRecord.SOURCE_RESUME,
            reference_id=str(instance.id),
        ).exists()
        if already_recorded:
            continue

        competency_services.record_evidence(
            user=instance.user, skill=skill, source_type='resume',
            raw_score=RESUME_EVIDENCE_SCORE, confidence=RESUME_EVIDENCE_CONFIDENCE,
            reference_id=str(instance.id),
        )
