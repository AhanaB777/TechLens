# Career Django App

Owns TechLens career definitions and user career goals.

## Responsibilities

- Career catalogue (`Career`)
- Career-to-skill competency requirements (`CareerSkillRequirement`)
- User career goals (`CareerGoal`)
- Primary/secondary goal selection (maximum two per user)
- Career APIs consumed by React
- Career seed data

The app deliberately does not own assessment scoring or competency scoring. Those remain in
`apps.assessments` and `apps.competencies`.

## Endpoints

- `GET /api/career/roles/`
- `GET /api/career/roles/<id>/`
- `GET /api/career/goals/`
- `POST /api/career/goals/`
- `GET /api/career/goals/active/`
- `GET /api/career/goals/<id>/`
- `PATCH /api/career/goals/<id>/`
- `DELETE /api/career/goals/<id>/`
- `POST /api/career/goals/<id>/activate/`

## Seed

From `server/`:

```bash
python manage.py migrate
python manage.py seed_careers
```

Career requirements are data-driven; no career names are hardcoded into competency logic.
