from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from apps.career.models import Career, CareerSkillRequirement
from apps.competencies.models import Skill


CAREERS = [('backend-developer',
  'Backend Developer',
  'Software Development',
  [('Python', 'Programming', 80, 'Essential'),
   ('SQL', 'Databases', 75, 'Essential'),
   ('REST APIs', 'Backend Development', 78, 'Important'),
   ('Problem Solving', 'Professional Skills', 70, 'Supporting'),
   ('Django', 'Backend Development', 75, 'Important'),
   ('Docker', 'Tools & Workflow', 75, 'Important'),
   ('Testing', 'Tools & Workflow', 70, 'Important'),
   ('CI/CD', 'Tools & Workflow', 65, 'Supporting')]),
 ('frontend-developer',
  'Frontend Developer',
  'Software Development',
  [('HTML & CSS', 'Frontend Development', 80, 'Essential'),
   ('JavaScript', 'Programming', 82, 'Essential'),
   ('React', 'Frontend Development', 78, 'Essential'),
   ('Git', 'Tools & Workflow', 70, 'Important'),
   ('Accessibility', 'Frontend Development', 65, 'Important'),
   ('Testing', 'Tools & Workflow', 70, 'Important'),
   ('Performance', 'Frontend Development', 65, 'Supporting')]),
 ('full-stack-developer',
  'Full Stack Developer',
  'Software Development',
  [('JavaScript', 'Programming', 82, 'Essential'),
   ('React', 'Frontend Development', 78, 'Essential'),
   ('Python', 'Programming', 78, 'Important'),
   ('SQL', 'Databases', 75, 'Important'),
   ('REST APIs', 'Backend Development', 78, 'Essential'),
   ('Git', 'Tools & Workflow', 70, 'Important'),
   ('Testing', 'Tools & Workflow', 70, 'Important'),
   ('Docker', 'Tools & Workflow', 70, 'Supporting')]),
 ('software-engineer',
  'Software Engineer',
  'Software Development',
  [('JavaScript', 'Programming', 75, 'Important'),
   ('Python', 'Programming', 75, 'Important'),
   ('Problem Solving', 'Professional Skills', 80, 'Essential'),
   ('SQL', 'Databases', 70, 'Important'),
   ('Git', 'Tools & Workflow', 70, 'Important'),
   ('Testing', 'Tools & Workflow', 70, 'Important'),
   ('System Design', 'Software Engineering', 65, 'Supporting')]),
 ('data-analyst',
  'Data Analyst',
  'Data & Analytics',
  [('SQL', 'Databases', 82, 'Essential'),
   ('Python', 'Programming', 72, 'Important'),
   ('Statistics', 'Data & Analytics', 75, 'Essential'),
   ('Data Visualization', 'Data & Analytics', 72, 'Important'),
   ('Excel', 'Tools & Workflow', 75, 'Important'),
   ('Problem Solving', 'Professional Skills', 75, 'Important')]),
 ('data-scientist',
  'Data Scientist',
  'Data & AI',
  [('Python', 'Programming', 85, 'Essential'),
   ('SQL', 'Databases', 75, 'Important'),
   ('Statistics', 'Data & Analytics', 85, 'Essential'),
   ('Machine Learning', 'Data & AI', 80, 'Essential'),
   ('Data Visualization', 'Data & Analytics', 70, 'Important'),
   ('Problem Solving', 'Professional Skills', 80, 'Essential')]),
 ('machine-learning-engineer',
  'Machine Learning Engineer',
  'Data & AI',
  [('Python', 'Programming', 85, 'Essential'),
   ('Machine Learning', 'Data & AI', 85, 'Essential'),
   ('SQL', 'Databases', 70, 'Important'),
   ('Docker', 'Tools & Workflow', 70, 'Important'),
   ('Testing', 'Tools & Workflow', 70, 'Important'),
   ('CI/CD', 'Tools & Workflow', 65, 'Supporting')]),
 ('devops-engineer',
  'DevOps Engineer',
  'Cloud & Infrastructure',
  [('Linux', 'Infrastructure', 80, 'Essential'),
   ('Docker', 'Tools & Workflow', 80, 'Essential'),
   ('CI/CD', 'Tools & Workflow', 85, 'Essential'),
   ('Cloud', 'Infrastructure', 78, 'Important'),
   ('Git', 'Tools & Workflow', 75, 'Important'),
   ('Testing', 'Tools & Workflow', 65, 'Supporting')]),
 ('cloud-engineer',
  'Cloud Engineer',
  'Cloud & Infrastructure',
  [('Cloud', 'Infrastructure', 85, 'Essential'),
   ('Linux', 'Infrastructure', 80, 'Essential'),
   ('Docker', 'Tools & Workflow', 75, 'Important'),
   ('CI/CD', 'Tools & Workflow', 80, 'Important'),
   ('Networking', 'Infrastructure', 75, 'Important'),
   ('Git', 'Tools & Workflow', 70, 'Supporting')]),
 ('cybersecurity-analyst',
  'Cybersecurity Analyst',
  'Cybersecurity',
  [('Networking', 'Infrastructure', 80, 'Essential'),
   ('Linux', 'Infrastructure', 75, 'Important'),
   ('Security Fundamentals', 'Cybersecurity', 85, 'Essential'),
   ('Python', 'Programming', 70, 'Important'),
   ('Incident Response', 'Cybersecurity', 75, 'Important')]),
 ('mobile-developer',
  'Mobile Developer',
  'Software Development',
  [('JavaScript', 'Programming', 78, 'Important'),
   ('Mobile Development', 'Mobile Development', 82, 'Essential'),
   ('Git', 'Tools & Workflow', 70, 'Important'),
   ('Testing', 'Tools & Workflow', 70, 'Important'),
   ('Accessibility', 'Mobile Development', 65, 'Supporting')])]


IMPORTANCE_WEIGHT = {
    'Essential': 1.0,
    'Important': 0.75,
    'Supporting': 0.5,
}


class Command(BaseCommand):
    help = 'Seed the TechLens career catalogue and career skill requirements.'

    @transaction.atomic
    def handle(self, *args, **options):
        for career_slug, name, category, requirements in CAREERS:
            career, _ = Career.objects.update_or_create(
                slug=career_slug,
                defaults={
                    'name': name,
                    'category': category,
                    'is_active': True,
                },
            )

            for skill_name, skill_category, target_level, importance_label in requirements:
                skill, _ = Skill.objects.get_or_create(
                    slug=slugify(skill_name),
                    defaults={
                        'name': skill_name,
                        'category': skill_category,
                    },
                )
                if skill.category != skill_category:
                    skill.category = skill_category
                    skill.save(update_fields=['category'])

                CareerSkillRequirement.objects.update_or_create(
                    career=career,
                    skill=skill,
                    defaults={
                        'importance': IMPORTANCE_WEIGHT[importance_label],
                        'target_level': target_level,
                        'is_required': importance_label == 'Essential',
                    },
                )

            self.stdout.write(self.style.SUCCESS(
                f'Seeded {career.name} with {len(requirements)} requirements.'
            ))

        self.stdout.write(self.style.SUCCESS(
            f'Career catalogue ready: {Career.objects.filter(is_active=True).count()} careers.'
        ))
