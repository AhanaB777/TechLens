# TechLens Frontend Merge Notes

Merged sources:
1. `techlens-client-two-career-goals(1).zip` — retained as the main application base (dashboard and feature pages).
2. `tech_lens_frontend.zip` — integrated its landing, login, register, onboarding, and resume-upload flow.

Integration decisions:
- Main app structure/routes from the first frontend were preserved.
- Auth/onboarding routes from the second frontend were added.
- The second frontend's `resumeupload.jsx` was normalized to `ResumeUpload.jsx` so the import works on case-sensitive systems.
- Existing shared `Button.jsx` and `Card.jsx` from the main frontend were retained because the dashboard already depends on them; the teammate auth pages are compatible with these components.
- Main frontend Tailwind configuration/design tokens were retained to avoid breaking the existing dashboard.
- `axios` was added to dependencies because it was part of the teammate project's dependency set.
- `.git` history from the source projects was not copied into the merged project.
- `package-lock.json` was intentionally omitted; run `npm install` in the merged `client` folder to regenerate it for the current environment.

Route flow:
`/` → Landing
`/register` → Register → `/onboarding` → `/resume-upload` → `/dashboard`
`/login` → `/dashboard`
`/dashboard` → existing TechLens dashboard
`/career-goal`, `/competency-profile`, `/skill-gaps`, `/roadmap`, `/progress`, `/assessment` → existing feature pages
