"""
Django management command to analyze a resume from the terminal
Usage: python manage.py analyze_resume /path/to/resume.pdf
"""
from django.core.management.base import BaseCommand
from django.conf import settings
import os
import sys
import json
from apps.resumes.analyzer_client import get_analyzer_client


class Command(BaseCommand):
    help = 'Analyze a resume and extract skills, tech stack, and other information'

    def add_arguments(self, parser):
        parser.add_argument(
            'resume_path',
            type=str,
            help='Path to the resume file (PDF, DOCX, or TXT)'
        )
        parser.add_argument(
            '--output',
            type=str,
            help='Save results to JSON file (optional)',
            default=None
        )

    def handle(self, *args, **options):
        resume_path = options['resume_path']
        output_file = options.get('output')

        # Validate file exists
        if not os.path.exists(resume_path):
            self.stdout.write(
                self.style.ERROR(f"❌ Error: File not found - {resume_path}")
            )
            sys.exit(1)

        # Validate file extension
        valid_extensions = ['.pdf', '.docx', '.doc', '.txt']
        file_extension = os.path.splitext(resume_path)[1].lower()
        if file_extension not in valid_extensions:
            self.stdout.write(
                self.style.ERROR(
                    f"❌ Error: Unsupported file format - {file_extension}\n"
                    f"Supported formats: {', '.join(valid_extensions)}"
                )
            )
            sys.exit(1)

        self.stdout.write(
            self.style.SUCCESS(f"📄 Analyzing resume: {resume_path}")
        )
        self.stdout.write("-" * 80)

        try:
            # Get analyzer client
            analyzer = get_analyzer_client()

            # Check if analyzer service is available
            is_available = analyzer.is_available()
            if is_available:
                self.stdout.write(
                    self.style.SUCCESS(f"✓ Resume Analyzer service is running")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f"⚠ Resume Analyzer service unavailable - using local fallback")
                )

            # Open and analyze the resume
            with open(resume_path, 'rb') as f:
                from django.core.files.uploadedfile import InMemoryUploadedFile
                filename = os.path.basename(resume_path)
                
                # Create a file-like object
                file_obj = InMemoryUploadedFile(
                    f,
                    'file',
                    filename,
                    'application/octet-stream',
                    os.path.getsize(resume_path),
                    None
                )
                
                # Analyze
                result = analyzer.analyze_resume(file_obj, filename)

            # Display results
            self.stdout.write("\n" + "=" * 80)
            self.stdout.write(self.style.SUCCESS("📊 ANALYSIS RESULTS"))
            self.stdout.write("=" * 80 + "\n")

            # Status
            status_style = self.style.SUCCESS if result['status'] == 'completed' else self.style.ERROR
            self.stdout.write(f"Status: {status_style(result['status'].upper())}")

            # Error info
            if result['error']:
                self.stdout.write(
                    self.style.ERROR(f"Error: {result['error']}")
                )
            else:
                # Skills found
                skills = result.get('skills', [])
                self.stdout.write(f"\n✓ Total Skills Found: {len(skills)}")
                if skills:
                    self.stdout.write(self.style.SUCCESS(f"\nAll Skills ({len(skills)}):"))
                    for i, skill in enumerate(skills, 1):
                        self.stdout.write(f"  {i:2}. {skill}")

                # Tech Stack
                tech_stack = result.get('tech_stack', [])
                self.stdout.write(
                    f"\n🔧 Tech Stack ({len(tech_stack)}): {', '.join(tech_stack) if tech_stack else 'None found'}"
                )

                # Skills by category
                skills_by_category = result.get('skills_by_category', {})
                if skills_by_category:
                    self.stdout.write(self.style.SUCCESS(f"\n📂 Skills by Category:"))
                    for category, category_skills in skills_by_category.items():
                        if category_skills:
                            category_display = category.replace('_', ' ').title()
                            self.stdout.write(f"\n  {category_display}:")
                            for skill in category_skills:
                                self.stdout.write(f"    • {skill}")

                # Extracted text preview
                resume_text = result.get('resume_text', '')
                if resume_text:
                    self.stdout.write(
                        f"\n📝 Resume Text Preview ({len(resume_text)} characters):"
                    )
                    preview = resume_text[:500] + "..." if len(resume_text) > 500 else resume_text
                    self.stdout.write(f"  {preview}\n")

            # Save to file if requested
            if output_file:
                with open(output_file, 'w') as f:
                    json.dump(result, f, indent=2)
                self.stdout.write(
                    self.style.SUCCESS(f"\n✓ Results saved to: {output_file}")
                )

            self.stdout.write("=" * 80)
            self.stdout.write(self.style.SUCCESS("\n✓ Analysis complete!\n"))

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"❌ Error during analysis: {str(e)}")
            )
            sys.exit(1)
