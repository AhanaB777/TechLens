"""
Django signals for resume processing and profile auto-population
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
import logging

from .models import Resume
from .analyzer_client import get_analyzer_client
from apps.profiles.models import Profile

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Resume)
def process_resume_on_upload(sender, instance, created, **kwargs):
    """
    Signal handler that triggers resume analysis when a new resume is uploaded
    Calls FastAPI Resume Analyzer to extract skills and updates user's profile
    """
    if not created:
        return  # Only process on creation, not on updates
    
    try:
        # Update status to processing
        instance.extraction_status = 'processing'
        instance.save(update_fields=['extraction_status'])
        
        # Get analyzer client and analyze resume
        analyzer = get_analyzer_client()
        
        # Read file and analyze
        instance.file.seek(0)
        analysis_result = analyzer.analyze_resume(instance.file, instance.file_name)
        
        # Update resume model with extracted data
        instance.extraction_status = analysis_result['status']
        instance.extracted_text = analysis_result.get('resume_text', '')
        instance.extracted_skills = analysis_result.get('skills', [])
        instance.extracted_tech_stack = analysis_result.get('tech_stack', [])
        instance.extraction_error = analysis_result.get('error') or ''
        instance.save(update_fields=['extraction_status', 'extracted_text', 'extracted_skills', 
                                     'extracted_tech_stack', 'extraction_error'])
        
        logger.info(f"Resume analysis completed for user {instance.user.username}: "
                   f"Status={analysis_result['status']}, "
                   f"Skills={len(analysis_result.get('skills', []))} found")
        
        # Auto-populate user's profile with extracted data
        if analysis_result['status'] == 'completed':
            profile, created = Profile.objects.get_or_create(user=instance.user)
            
            # Update profile with extracted skills and tech stack
            profile.skills = analysis_result.get('skills', [])
            profile.tech_stack = analysis_result.get('tech_stack', [])
            profile.save(update_fields=['skills', 'tech_stack'])
            
            logger.info(f"Profile updated for user {instance.user.username} with "
                       f"{len(analysis_result.get('skills', []))} skills")
    
    except Exception as e:
        # Update resume with error status
        logger.error(f"Error processing resume {instance.file_name}: {str(e)}")
        instance.extraction_status = 'failed'
        instance.extraction_error = str(e)
        instance.save(update_fields=['extraction_status', 'extraction_error'])

