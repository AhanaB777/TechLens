# Assessment Engine & Competency Engine

Owner: Ahana
Apps: `apps/assessments`, `apps/competencies`

This doc explains what these two apps do, why they're built the way they are, and how to get them running locally.

---

## 1. What problem this solves

TechLens measures how ready a student is for their target career. Two apps do the measuring:

- **`assessments`** — decides which skills are worth testing right now, builds a test, grades it.
- **`competencies`** — takes evidence from assessments (and eventually resumes, projects, self-ratings) and turns it into one explainable competency score per skill, plus overall career readiness.

**The most important design rule: Assessment score ≠ Competency score.**

An assessment tells you "how did the student do on this one test." The competency engine blends that with other evidence (resume, project work, self-rating) into "how competent is this student, really." A student can ace a test and still show a modest competency score if that's the only evidence that exists for that skill — and that's intentional, not a bug.

---

## 2. How the pipeline connects

```
Resume (resumes app)
    │
    ▼
apps.competencies.services.record_evidence(source_type='resume', ...)
    │
apps.assessments  ──build_attempt()──►  student takes ONE test spanning
    │                                    several skills at once
    │
    ▼
apps.assessments.services.submit_attempt()
    │  grades per-skill, calls record_evidence(source_type='assessment', ...)
    ▼
apps.competencies.services.recompute_competency_score()
    │  weighted blend: 40% assessment / 30% project / 20% resume / 10% self
    ▼
CompetencyScore (per skill)  ──►  career readiness, dashboard, strengths/gaps
```

Every app that has evidence about a student's skill (resumes, assessments, later roadmap/progress) calls **one function**:

```python
from apps.competencies import services as competency_services

competency_services.record_evidence(
    user=user, skill=skill,
    source_type='resume',   # or 'assessment' / 'project' / 'self_assessment'
    raw_score=65,            # 0-100
    confidence=0.6,          # 0-1, how much to trust this evidence
)
```

That's the entire integration contract. Nothing else needs to know how the competency engine works internally.

---

## 3. Key design decisions (and why)

| Decision | Why |
|---|---|
| Assessment score is never the final competency score | A test result alone shouldn't override everything else known about a student — it's one input among several. |
| Weights are configurable (`EvidenceWeightConfig` table) | So the 40/30/20/10 split can be tuned later without a code deploy. |
| One test can span multiple skills | Nobody should have to take 10 separate tests for 10 skills. The engine picks a handful of relevant/uncertain skills and builds one combined test. |
| 10-day per-skill cooldown | Prevents students from repeatedly retesting the same skill to game their score. Enforced as a hard rule at selection time, not a soft preference. |
| `career_readiness` is separate from `competency_score` | A student can be broadly competent but still "not ready" for a specific career if that career weights their weakest skills heavily. These are genuinely different numbers. |
| "Verified" = confidence ≥ 0.5, not "self-claimed" | Verification means TechLens has *actual evidence*, not that the student said so. |
| Career-importance integration is a soft seam (`get_career_requirements`) | The `careers` app doesn't exist yet. Rather than block on it, this returns `{}` gracefully until it's wired in — readiness just shows `null` until then. |

---

## 4. Models (what's actually stored)

**`competencies` app**
- `Skill` — canonical skill list (shared across the whole project)
- `EvidenceRecord` — one row per piece of evidence (assessment result, resume mention, self-rating, project)
- `CompetencyScore` — current blended score per (user, skill), recomputed on every new evidence record
- `CompetencyScoreHistory` — append-only log for the `progress` app to build growth charts later
- `EvidenceWeightConfig` — the configurable 40/30/20/10 weights
- `SelfAssessment` — student's own rating of a skill

**`assessments` app**
- `Assessment` — a question **pool** for one skill+difficulty (not a single test — a bank the engine pulls from)
- `Question` — belongs to a pool, therefore belongs to a skill
- `AssessmentAttempt` — one test session; can include questions from multiple pools/skills at once
- `QuestionResponse` — student's answer to one question in one attempt
- `SkillResult` — per-skill outcome within an attempt; this is both the evidence AND the cooldown clock

---

## 5. API endpoints

**Competencies** (`/api/competencies/`)
| Method | Path | What it does |
|---|---|---|
| GET | `dashboard/` | Composed response: competency_score, career_readiness, verified counts, strengths, areas_to_improve |
| GET | `readiness/` | Career readiness detail with per-skill breakdown (null until `careers` app exists) |
| GET | `skills/` | List all skills |
| GET | `scores/` | Current user's competency scores |
| GET | `scores/<skill_id>/explain/` | Full breakdown of one skill's score (why it is what it is) |
| POST | `self-assessments/` | Submit a self-rating for a skill |

**Assessments** (`/api/assessments/`)
| Method | Path | What it does |
|---|---|---|
| POST | `start/` | Engine builds a multi-skill test attempt. Returns 200 (no attempt) if nothing needs testing right now. |
| GET | `attempts/<id>/` | Fetch an in-progress attempt's questions |
| POST | `attempts/<id>/submit/` | Submit answers, get per-skill results back |
| GET | `attempts/mine/` | List past attempts with results |
| GET | `cooldowns/` | Per-skill cooldown status ("retest available in 4 days") |

All endpoints require authentication (session-based, matching the rest of the project).

---

## 6. How to set this up locally

```powershell
# 1. Make sure Postgres is running
docker compose up -d postgres

# 2. Install dependencies (includes django-cors-headers now)
pip install -r requirements.txt

# 3. From server/, generate and apply migrations
cd server
python manage.py makemigrations
python manage.py migrate

# 4. Create a superuser for testing
python manage.py createsuperuser

# 5. Run the test suite — should show 29 passing
python manage.py test apps.competencies apps.assessments -v 2

# 6. Run the server
python manage.py runserver
```

If you pull a fresh copy of this repo and these two apps already have old migrations from before this version, **delete and regenerate them** — the schema changed (new `SkillResult` table, `Question`/`Assessment` relationship redesigned to support multi-skill pools):

```powershell
python manage.py migrate assessments zero
python manage.py migrate competencies zero
Remove-Item apps\assessments\migrations\0*.py
Remove-Item apps\competencies\migrations\0*.py
python manage.py makemigrations assessments competencies
python manage.py migrate
```

---

## 7. Try it yourself (shell walkthrough)

```powershell
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
from apps.competencies.models import Skill
from apps.assessments.models import Assessment, Question
from apps.assessments import services as assessment_services
from apps.competencies import services as competency_services

User = get_user_model()
user = User.objects.create_user(username='demo', email='demo@example.com', password='pass12345')

# set up a skill with a question pool
skill = Skill.objects.create(name='Python', slug='python')
pool = Assessment.objects.create(title='Python Basics', skill=skill, difficulty='beginner')
Question.objects.create(assessment=pool, text='2+2=?', correct_answer='4', points=1)
Question.objects.create(assessment=pool, text='Python is dynamically typed?', correct_answer='true', points=1)

# engine builds and grades an attempt
attempt = assessment_services.build_attempt(user, num_skills=1, questions_per_skill=2)
answers = [{'question_id': q.id, 'answer': q.correct_answer} for q in attempt.questions.all()]
assessment_services.submit_attempt(attempt, answers)

# check the resulting competency score, fully explained
print(competency_services.explain_score(user, skill))

# try again immediately - should be blocked by the 10-day cooldown
print(assessment_services.build_attempt(user, num_skills=1, questions_per_skill=2))  # None
```

---

## 8. Known gaps / what's still pending

- **`careers` app doesn't exist yet.** Career importance and readiness calculations gracefully fall back to `{}`/`null` until it's built. Once it exists, only `competencies/services.py::get_career_requirements()` needs updating — nothing else.
- **Resume evidence uses a placeholder score.** The resume analyzer currently returns a flat list of skill names with no per-skill confidence, so resume evidence is recorded with a flat `raw_score=65, confidence=0.6` for now. Once the analyzer returns real per-skill confidence, update wherever `record_evidence(source_type='resume', ...)` is called.
- **CORS is configured for common dev ports (5173, 3000)** but hasn't been tested against a real frontend yet, since it doesn't exist in the repo. Once someone scaffolds the frontend, confirm its actual dev port matches `CORS_ALLOWED_ORIGINS` in `config/settings.py`.
- **`roadmap` and `progress` apps** are next — they consume `CompetencyScore`/`SkillResult` data from these two apps but haven't been built yet.