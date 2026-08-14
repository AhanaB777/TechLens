"""
Service module for resume analysis and skill extraction
"""
import os
import tempfile
from pathlib import Path
from typing import Dict, List, Set
import re
from collections import Counter


# Skill categories matching the Resume-Analyzer
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


def normalize_text(text: str) -> str:
    """Normalize text for better matching"""
    text = text.lower()
    # Remove special characters but keep spaces
    text = re.sub(r'[^\w\s]', ' ', text)
    # Normalize whitespace
    text = ' '.join(text.split())
    return text


def extract_skills_from_text(text: str) -> Dict[str, List[str]]:
    """
    Extract skills from text by matching against skill keywords
    
    Args:
        text: Input text to extract skills from
        
    Returns:
        Dictionary with skills organized by category
    """
    normalized_text = normalize_text(text)
    found_skills = {}
    
    # Check all skill categories
    for category, skills in SKILL_CATEGORIES.items():
        found_skills[category] = []
        for skill in skills:
            # Use word boundaries for better matching
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, normalized_text, re.IGNORECASE):
                found_skills[category].append(skill)
    
    return found_skills


def extract_text_from_file(file_path: str) -> str:
    """
    Extract text from resume file (PDF, DOCX, or TXT)
    
    Args:
        file_path: Path to the resume file
        
    Returns:
        Extracted text from the resume
    """
    try:
        file_path = Path(file_path)
        file_extension = file_path.suffix.lower()
        
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Resume file not found: {file_path}")
        
        if file_extension == '.pdf':
            return extract_from_pdf(file_path)
        elif file_extension in ['.docx', '.doc']:
            return extract_from_docx(file_path)
        elif file_extension == '.txt':
            return extract_from_txt(file_path)
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
    except Exception as e:
        raise Exception(f"Error extracting text from {file_path}: {str(e)}")


def extract_from_pdf(file_path: Path) -> str:
    """Extract text from PDF file (with OCR support for scanned PDFs)"""
    text = ""
    
    # Try pdfplumber first (better text extraction)
    try:
        import pdfplumber
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        text = text.strip()
        if text and len(text) > 0:
            return text
    except ImportError:
        pass  # Fall back to PyPDF2
    except Exception:
        pass  # Fall back to PyPDF2
    
    # Fall back to PyPDF2
    try:
        import PyPDF2
        text = ""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_pages = len(pdf_reader.pages)
            
            if num_pages == 0:
                raise ValueError("PDF file appears to be empty or corrupted")
            
            for page_num, page in enumerate(pdf_reader.pages):
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        
        text = text.strip()
        
        if text and len(text) > 0:
            return text
    except ImportError:
        pass
    except Exception:
        pass
    
    # If no text extracted, try OCR for scanned PDFs
    try:
        return extract_from_pdf_with_ocr(file_path)
    except Exception as ocr_error:
        raise Exception(f"Failed to extract text from PDF. Error: {str(ocr_error)}")


def extract_from_pdf_with_ocr(file_path: Path) -> str:
    """Extract text from scanned PDF using OCR (Tesseract)"""
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        import pytesseract
        import os
        
        # Configure pytesseract to use system Tesseract installation
        # Try common Windows installation paths
        common_paths = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        ]
        
        for tesseract_path in common_paths:
            if os.path.exists(tesseract_path):
                pytesseract.pytesseract.pytesseract_cmd = tesseract_path
                logger.info(f"Using Tesseract from: {tesseract_path}")
                break
        
        logger.info(f"Attempting OCR extraction from {file_path}")
        
        # Convert PDF pages to images using PyMuPDF (doesn't require Poppler)
        try:
            import pymupdf  # PyMuPDF (replaces deprecated fitz)
            from PIL import Image
            import io
            
            doc = pymupdf.open(str(file_path))
            images = []
            for page_num in range(len(doc)):
                page = doc[page_num]
                # Render page to image (300 DPI for better OCR)
                pix = page.get_pixmap(matrix=pymupdf.Matrix(2, 2), alpha=False)
                img_data = pix.tobytes("ppm")
                img = Image.open(io.BytesIO(img_data))
                images.append(img)
            doc.close()
            
            if not images:
                raise ValueError("No pages found in PDF")
        except ImportError:
            # Fallback to pdf2image if available
            try:
                from pdf2image import convert_from_path
                images = convert_from_path(str(file_path))
            except Exception as e:
                raise ImportError(f"Failed to convert PDF to images. Install PyMuPDF: pip install PyMuPDF")
        except Exception as e:
            raise ImportError(f"PyMuPDF failed to convert PDF to images: {str(e)}")
        
        # Extract text from images using OCR
        text = ""
        ocr_errors = []
        
        for i, image in enumerate(images):
            try:
                page_text = pytesseract.image_to_string(image)
                if page_text and page_text.strip():
                    text += page_text + "\n"
            except pytesseract.TesseractNotFoundError as e:
                error_msg = (
                    f"Tesseract OCR engine not found. "
                    f"Please install it from: https://github.com/UB-Mannheim/tesseract/wiki\n"
                    f"On Windows: Download and run the .exe installer, then restart your terminal."
                )
                logger.error(error_msg)
                raise ImportError(error_msg)
            except Exception as e:
                ocr_errors.append(f"Page {i + 1}: {str(e)}")
                logger.warning(f"OCR failed on page {i + 1}: {str(e)}")
                continue
        
        text = text.strip()
        if text:
            logger.info(f"OCR extraction successful: {len(text)} characters extracted from {len(images)} pages")
            return text
        else:
            error_detail = " | ".join(ocr_errors) if ocr_errors else "No text extracted"
            raise ValueError(f"OCR extraction produced no text ({error_detail})")
    
    except pytesseract.TesseractNotFoundError:
        raise ImportError(
            "Tesseract-OCR engine not found!\n"
            "To use OCR for scanned PDFs, install Tesseract from:\n"
            "https://github.com/UB-Mannheim/tesseract/wiki\n\n"
            "Windows: Download tesseract-ocr-w64-setup-v5.x.x.exe and run the installer.\n"
            "After installation, restart your terminal."
        )
    except ImportError as e:
        raise e
    except Exception as e:
        raise Exception(f"OCR extraction failed: {str(e)}")



def extract_from_docx(file_path: Path) -> str:
    """Extract text from DOCX file"""
    try:
        from docx import Document
        doc = Document(file_path)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text
    except ImportError:
        raise ImportError("python-docx is required for DOCX processing. Install it with: pip install python-docx")
    except Exception as e:
        raise Exception(f"Error reading DOCX: {str(e)}")


def extract_from_txt(file_path: Path) -> str:
    """Extract text from TXT file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        raise Exception(f"Error reading TXT: {str(e)}")


def analyze_resume(file_path: str) -> Dict:
    """
    Analyze resume and extract skills, tech stack, experience, education
    
    Args:
        file_path: Path to the resume file
        
    Returns:
        Dictionary containing extracted resume data
    """
    try:
        # Extract text from file
        resume_text = extract_text_from_file(file_path)
        
        # Extract skills by category
        skills_by_category = extract_skills_from_text(resume_text)
        
        # Flatten skills into simple lists for different categories
        all_skills = []
        tech_stack = []
        
        for category, skills in skills_by_category.items():
            all_skills.extend(skills)
            if category in ["programming_languages", "frameworks_and_libraries", "databases", "cloud_and_devops"]:
                tech_stack.extend(skills)
        
        # Remove duplicates and sort
        all_skills = sorted(list(set(all_skills)))
        tech_stack = sorted(list(set(tech_stack)))
        
        return {
            "status": "completed",
            "resume_text": resume_text,
            "skills": all_skills,
            "tech_stack": tech_stack,
            "skills_by_category": skills_by_category,
            "error": None
        }
    except Exception as e:
        return {
            "status": "failed",
            "resume_text": "",
            "skills": [],
            "tech_stack": [],
            "skills_by_category": {},
            "error": str(e)
        }
