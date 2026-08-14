"""
API client service for communicating with the FastAPI Resume Analyzer service
"""
import requests
import logging
from typing import Dict, Optional
from django.conf import settings
from django.core.files.base import File
import io

logger = logging.getLogger(__name__)


class ResumeAnalyzerClient:
    """Client for FastAPI Resume Analyzer service"""
    
    def __init__(self):
        self.base_url = getattr(settings, 'RESUME_ANALYZER_URL', 'http://localhost:8001')
        self.timeout = 300  # 5 minutes timeout for large files
    
    def is_available(self) -> bool:
        """Check if the analyzer service is available"""
        try:
            response = requests.get(
                f"{self.base_url}/",
                timeout=5
            )
            return response.status_code == 200
        except Exception as e:
            logger.warning(f"Resume Analyzer service not available: {str(e)}")
            return False
    
    def analyze_resume(self, file_obj: File, filename: str) -> Dict:
        """
        Send resume file to FastAPI analyzer for skill extraction
        
        Args:
            file_obj: File object (from Django FileField)
            filename: Name of the file
            
        Returns:
            Dictionary with extracted data or error info
        """
        try:
            # Prepare file for upload
            files = {
                'file': (filename, file_obj.read(), 'application/octet-stream')
            }
            
            # Call FastAPI endpoint
            response = requests.post(
                f"{self.base_url}/upload-resume",
                files=files,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                extracted_text = result.get('extracted_text', '')
                
                # Now analyze the extracted text for skills
                analysis = self._analyze_text_for_skills(extracted_text)
                
                return {
                    "status": "completed",
                    "resume_text": extracted_text,
                    "skills": analysis.get('skills', []),
                    "tech_stack": analysis.get('tech_stack', []),
                    "skills_by_category": analysis.get('skills_by_category', {}),
                    "error": None
                }
            else:
                error_msg = response.json().get('detail', 'Unknown error from analyzer')
                logger.error(f"Analyzer returned error: {error_msg}")
                return {
                    "status": "failed",
                    "resume_text": "",
                    "skills": [],
                    "tech_stack": [],
                    "skills_by_category": {},
                    "error": error_msg
                }
        
        except requests.exceptions.ConnectionError:
            error_msg = "Resume Analyzer service is not available. Using fallback local analysis."
            logger.warning(error_msg)
            # Fall back to local analysis
            file_obj.seek(0)
            return self._fallback_local_analysis(file_obj, filename)
        except Exception as e:
            logger.error(f"Error calling Resume Analyzer: {str(e)}")
            return {
                "status": "failed",
                "resume_text": "",
                "skills": [],
                "tech_stack": [],
                "skills_by_category": {},
                "error": str(e)
            }
    
    def _analyze_text_for_skills(self, text: str) -> Dict:
        """
        Fallback: Analyze extracted text for skills using local keyword matching
        This mimics the Resume-Analyzer's skill extraction logic
        """
        import re
        
        SKILL_CATEGORIES = {
            "programming_languages": [
                "python", "java", "javascript", "typescript", "c++", "c#", "go", "rust",
                "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "sql", "html",
                "css", "perl", "shell", "bash", "powershell", "c", "objective-c", "groovy",
                "dart", "elixir", "haskell", "lisp", "lua"
            ],
            "frameworks_and_libraries": [
                "react", "angular", "vue", "django", "flask", "fastapi", "spring",
                "express", "node.js", "node", "asp.net", "laravel", "rails", "tensorflow",
                "pytorch", "keras", "scikit-learn", "pandas", "numpy", "matplotlib",
                "seaborn", "beautifulsoup", "requests", "torch"
            ],
            "databases": [
                "mysql", "postgresql", "mongodb", "redis", "oracle", "sqlite",
                "cassandra", "elasticsearch", "dynamodb", "firebase", "couchdb",
                "neo4j", "mariadb", "influxdb"
            ],
            "cloud_and_devops": [
                "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s",
                "jenkins", "ci/cd", "terraform", "ansible", "git", "github", "gitlab",
                "bitbucket", "heroku", "digitalocean", "openstack", "helm"
            ],
            "data_and_analytics": [
                "data analysis", "data science", "machine learning", "deep learning",
                "statistics", "data visualization", "tableau", "power bi", "sql",
                "etl", "data warehousing", "big data", "hadoop", "spark", "r", "spss"
            ],
            "tools_and_platforms": [
                "jira", "confluence", "slack", "excel", "vba", "power query",
                "jupyter", "anaconda", "git", "svn", "postman", "swagger", "datadog"
            ],
            "soft_skills": [
                "leadership", "communication", "teamwork", "problem solving",
                "project management", "agile", "scrum", "collaboration", "mentoring"
            ]
        }
        
        normalized_text = text.lower()
        normalized_text = re.sub(r'[^\w\s]', ' ', normalized_text)
        normalized_text = ' '.join(normalized_text.split())
        
        found_skills = {}
        tech_stack = []
        all_skills = []
        
        for category, skills in SKILL_CATEGORIES.items():
            found_skills[category] = []
            for skill in skills:
                pattern = r'\b' + re.escape(skill.lower()) + r'\b'
                if re.search(pattern, normalized_text, re.IGNORECASE):
                    found_skills[category].append(skill)
                    all_skills.append(skill)
                    
                    # Add to tech stack if in relevant category
                    if category in ["programming_languages", "frameworks_and_libraries", "databases", "cloud_and_devops"]:
                        tech_stack.append(skill)
        
        return {
            "skills": sorted(list(set(all_skills))),
            "tech_stack": sorted(list(set(tech_stack))),
            "skills_by_category": found_skills
        }
    
    def _fallback_local_analysis(self, file_obj: File, filename: str) -> Dict:
        """
        Fallback local analysis if FastAPI service is unavailable
        Extract text locally and analyze for skills
        """
        try:
            from pathlib import Path
            import tempfile
            
            # Create a temporary file to work with
            file_extension = Path(filename).suffix.lower()
            with tempfile.NamedTemporaryFile(suffix=file_extension, delete=False) as tmp:
                tmp.write(file_obj.read())
                tmp_path = tmp.name
            
            # Import local extraction functions
            from .services import extract_text_from_file
            
            extracted_text = extract_text_from_file(tmp_path)
            analysis = self._analyze_text_for_skills(extracted_text)
            
            return {
                "status": "completed",
                "resume_text": extracted_text,
                "skills": analysis.get('skills', []),
                "tech_stack": analysis.get('tech_stack', []),
                "skills_by_category": analysis.get('skills_by_category', {}),
                "error": None
            }
        except Exception as e:
            logger.error(f"Fallback analysis failed: {str(e)}")
            return {
                "status": "failed",
                "resume_text": "",
                "skills": [],
                "tech_stack": [],
                "skills_by_category": {},
                "error": str(e)
            }


# Singleton instance
_analyzer_client = None


def get_analyzer_client() -> ResumeAnalyzerClient:
    """Get or create the analyzer client instance"""
    global _analyzer_client
    if _analyzer_client is None:
        _analyzer_client = ResumeAnalyzerClient()
    return _analyzer_client
