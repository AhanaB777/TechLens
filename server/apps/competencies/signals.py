"""
Wires resume-extracted skills into the Competency Engine as evidence.

Deliberately lives here (competencies), not in resumes/signals.py, so we
don't collide with the resumes team's file. Uses a string sender reference
('resumes.Resume') rather than importing the model directly, so app-loading
order between competencies/resumes doesn't matter.
"""
import re

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import EvidenceRecord, Skill
from . import services as competency_services

# Heuristic bounds for the frequency-based estimate below. Still an
# ESTIMATE, not ground truth - the resume analyzer only tells us a skill
# is present, not how proficient the person actually is. Counting mentions
# in the extracted text is a reasonable proxy (more mentions generally
# means the skill shows up in both a skills list AND project descriptions,
# suggesting deeper real usage) but should be revisited once/if the
# analyzer returns real per-skill signals (years of experience, project
# context, etc).
BASE_SCORE = 45
SCORE_PER_MENTION = 8
MAX_SCORE = 82

BASE_CONFIDENCE = 0.45
CONFIDENCE_PER_MENTION = 0.05
MAX_CONFIDENCE = 0.7


def _slugify(name):
    return str(name).strip().lower().replace(' ', '-')


def _estimate_resume_evidence(extracted_text, skill_name):
    """
    Varies score/confidence based on how many times the skill name appears
    in the resume's extracted text - a skill mentioned in both a skills
    list AND a project description scores higher than one that only
    appears once. Falls back to the old flat baseline if no text is
    available (e.g. extraction only returned a skill list, no full text).
    """
    if not extracted_text:
        return BASE_SCORE + SCORE_PER_MENTION, BASE_CONFIDENCE + CONFIDENCE_PER_MENTION

    # whole-word, case-insensitive count - avoids "java" matching inside "javascript"
    pattern = r'\b' + re.escape(skill_name.lower()) + r'\b'
    mentions = len(re.findall(pattern, extracted_text.lower()))
    mentions = max(mentions, 1)  # it was extracted, so it's mentioned at least once somewhere

    score = min(BASE_SCORE + SCORE_PER_MENTION * mentions, MAX_SCORE)
    confidence = min(BASE_CONFIDENCE + CONFIDENCE_PER_MENTION * mentions, MAX_CONFIDENCE)
    return round(score, 1), round(confidence, 2)


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
    extracted_text = getattr(instance, 'extracted_text', '') or ''

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

        score, confidence = _estimate_resume_evidence(extracted_text, name)

        competency_services.record_evidence(
            user=instance.user, skill=skill, source_type='resume',
            raw_score=score, confidence=confidence,
            reference_id=str(instance.id),
        )