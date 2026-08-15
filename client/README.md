# TechLens — Frontend

Greenfield React + Vite + Tailwind frontend.

- **Part 1** — app shell, design system, and a fully working Dashboard.
- **Part 3** — Competency Profile.
- **Part 4** — Skill Gaps.
- **Part 5** — Roadmap.
- **Part 6** — Progress.
- **Part 7** — cross-page QA and integration polish (this build). Career
  Goal (Part 2) remains a placeholder — see "Known gap" below.

## Known gap

Part 2 (Career Goal) was never actually implemented — `CareerGoal.jsx`
is still the Part 1 placeholder. Competency Profile, Skill Gaps,
Roadmap, and Progress intentionally don't depend on it: each gets the
target role from its own mock data, the same way the Dashboard does,
rather than from any real Career Goal state.

Roadmap task completion is local component state only — there's no
persistence endpoint yet (noted in `services/roadmapApi.js`), so
checking off a task doesn't survive a page reload.

## Cross-module consistency fixes (found while building Progress)

Building Progress meant composing numbers from Dashboard, Competency
Profile, Skill Gaps, and Roadmap side by side, which surfaced two real
inconsistencies that got fixed at the source rather than worked around:

1. **Dashboard's roadmap summary was a second, hand-maintained copy**
   of roadmap progress (a hardcoded 72%) that had drifted from what the
   actual Roadmap page computes (53%, since Roadmap was built after
   Dashboard's mock data was written). `dashboardApi.js` now derives
   its roadmap summary from `mockRoadmapData` + `roadmapUtils` directly
   — one source of truth instead of two numbers that could disagree.
2. **Roadmap's milestone order contradicted Skill Gaps' own priority
   ranking.** Skill Gaps ranks Docker (gap 13) above Testing (gap 12),
   but Roadmap listed Testing before Docker, so the roadmap's *derived*
   "current focus" was Testing — silently disagreeing with the
   Dashboard's next-action card and Skill Gaps' own recommendation,
   both of which point to Docker. Reordered Docker before Testing in
   `mockRoadmapData.js` so the roadmap's sequence agrees with its own
   priority data instead of contradicting it.
3. Docker had no trend history in `mockCompetencyData.js` (`trend:
   { available: false }`), which meant Progress's "biggest
   improvement" section — the one place that needed it — would have had
   to either fabricate one or omit Docker. Added a real history array
   (`[45, 53, 62]`) to the one source Competency Profile already reads
   from, rather than inventing a separate copy inside Progress's own
   mock data.

## Part 7 — QA and integration findings

Real issues found by auditing (grep + actual code execution, not
assumption) and fixed at the source:

1. **Skill Gaps ↔ Roadmap priority contradiction.** Skill Gaps computed
   Docker as "Medium priority"; Roadmap independently hardcoded its
   Docker milestone as "High priority" — the exact skill Part 7's own
   brief uses as its worked example of what should *not* happen.
   Roadmap milestone priority is now derived at request time in
   `roadmapApi.js` via a new `skillGapUtils.priorityForSkills()`, from
   the same computation Skill Gaps uses — never a second guess. Verified
   by actually running `getRoadmap()` and confirming Docker now reads
   "Medium priority" in both places. CI/CD's roadmap priority (which
   had been asserting "Medium" for a skill that isn't even assessed
   yet) is now correctly `null` — no priority claim without gap data.
2. **Dashboard had no link to Progress**, despite linking to every
   other module — a dead spot in the six-page journey. Added to
   `RecentActivity`.
3. **A genuinely dead button**: Dashboard's "Continue learning" action
   (`NextActionCard`) had no `onClick` and no destination. Wired to
   `/roadmap`, consistent with Skill Gaps' equivalent next-focus card.
4. **Two more inert buttons**: Navbar's notification bell and profile
   avatar had no destination or handler (there's no notifications or
   profile page in this build's scope). Disabled intentionally
   (`disabled`, `title="Coming soon"`) rather than left looking
   clickable with no effect.
5. **Mobile nav drawer had no scroll lock, no Escape-to-close, and no
   focus management** — a real accessibility gap. Fixed using the same
   pattern already established in `CompetencyDetailModal`.
6. Programmatic sweeps found **zero** `console.log`/`console.debug`
   calls, **zero** unsupported claims ("guaranteed", "job-ready",
   "you're an expert" — the one "guarantee" hit was the *correct*
   disclaimer in `RoadmapStates.jsx`: "isn't a guarantee of job
   readiness"), **zero** stray product-language synonyms
   (talent/knowledge/ability instead of competency/skill), and **zero**
   likely-unused imports across all 84 files.

**Not done in this pass** — genuinely outside what I can verify without
a browser: the six-breakpoint responsive QA (1440/1280/1024/768/480/375)
in section 17 was reviewed by code inspection (flex-wrap, truncate,
min-w-0, no hardcoded pixel widths found), not actual rendering at
each width. Career Goal (Part 2) is still a placeholder, so sections 6
and 7 (Career Goal → Competency Profile / Skill Gaps context) have
nothing real to audit yet — every other page already sources its
target role independently and consistently ("Backend Developer"
everywhere), but none of them are actually *wired to* a real Career
Goal state, because one doesn't exist.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (default `http://localhost:5173`) and
you'll land on `/dashboard`.

To produce a production build:

```bash
npm run build
npm run preview
```

## What's here

- `src/components/` — reusable design-system primitives (Button, Card,
  ProgressBar, SkillBar, SkillBadge, ScoreCard, ReadinessScore,
  EvidenceBadge, AssessmentCard, RoadmapItem, LoadingSpinner, Navbar,
  Sidebar) plus a small local icon set (`icons.jsx`).
- `src/layouts/DashboardLayout.jsx` — authenticated shell (sidebar +
  navbar + routed content), including the mobile nav drawer.
- `src/pages/Dashboard.jsx` — the full Dashboard, composed from
  `src/pages/dashboard/*` section components.
- `src/pages/{CareerGoal,CompetencyProfile,SkillGaps,Roadmap,Progress}.jsx`
  — placeholder pages so sidebar navigation works end-to-end. Each will
  be replaced with a real implementation in its own part.
- `src/data/mockDashboardData.js` — isolated mock data, shaped like the
  future API response.
- `src/services/dashboardApi.js` — the only data-access point the
  Dashboard talks to. Swap its body for a real `fetch` call later; no
  other file needs to change.
- `src/hooks/useDashboardData.js` — owns loading/success/error state.
- `src/pages/CompetencyProfile.jsx` — full implementation, composed from
  `src/pages/competency/*` (hero summary, category-filtered breakdown,
  strengths/improvement preview, completeness checklist, detail modal).
- `src/data/mockCompetencyData.js` / `src/services/competencyApi.js` /
  `src/hooks/useCompetencyProfile.js` — same mock → service → hook
  pattern as the Dashboard, so the future backend swap is a one-line
  change in `competencyApi.js` only.
- `src/utils/competencyUtils.js` — category grouping, strengths/gaps
  derivation (UI-only; competency *status* is always shown as given
  by the data, never calculated by the frontend).
- `src/pages/SkillGaps.jsx` — full implementation, composed from
  `src/pages/skill-gaps/*` (career target, readiness/distribution
  overview, filterable current-vs-required comparison cards, on-track
  and biggest-gaps summaries, next-focus recommendation).
- `src/data/mockSkillGapData.js` / `src/services/skillGapApi.js` /
  `src/hooks/useSkillGapData.js` — same mock → service → hook pattern.
  Handles three distinct states (no career goal / competency profile
  not ready / all competencies on track) plus loading and error.
- `src/utils/skillGapUtils.js` — derives gap, priority (size +
  importance, not size alone), and summary counts from current +
  required + importance, so there's one source of truth instead of
  numbers that could drift out of sync. "Not assessed" is tracked as
  its own state throughout and is never treated as a score of 0.
  `priorityForSkills()` lets other modules (Roadmap) derive a priority
  for a set of skills from this same computation instead of guessing.
- `src/components/PillFilter.jsx` — generic pill filter bar, promoted
  out of the Competency Profile's page-local category filter once
  Skill Gaps needed the same pattern for its status filter. Both pages
  use this one component now instead of two near-identical copies.
- `src/pages/Roadmap.jsx` — full implementation, composed from
  `src/pages/roadmap/*` (overall progress, current-focus spotlight,
  phase/milestone breakdown with expandable task lists).
- `src/data/mockRoadmapData.js` / `src/services/roadmapApi.js` /
  `src/hooks/useRoadmapData.js` — same mock → service → hook pattern.
  Handles four distinct states (no career goal / no gaps / plan not
  yet generated / roadmap complete) plus loading and error. The hook
  also owns task-completion toggling (in-memory only — see "Known gap").
- `src/utils/roadmapUtils.js` — every status and progress number
  (task → milestone → phase → overall) is derived from `task.completed`
  here, never stored or hand-maintained, so a milestone can't show a
  percentage that disagrees with its own task list.
- `src/pages/Progress.jsx` — full implementation, composed from
  `src/pages/progress/*` (headline summary, hand-built SVG readiness
  trend chart, competency growth, roadmap progress, milestone/assessment
  history, a plain-text insight generated from real numbers, next step).
- `src/data/mockProgressData.js` — deliberately small: only readiness
  history and milestone-completion dates, the two things that don't
  exist anywhere else. Competency growth, roadmap %, priority areas,
  and assessment history are NOT duplicated here.
- `src/services/progressApi.js` — the one place that composes Progress's
  full payload from `mockCompetencyData`, `mockSkillGapData`, and
  `mockRoadmapData` together (via `utils/progressUtils.js`), rather than
  each page maintaining its own copy of the same numbers.
- `src/utils/progressUtils.js` — readiness deltas, growth-list/average/
  biggest-improvement derivation, and "remaining priority areas" (reuses
  `skillGapUtils.biggestGaps`, excluding whatever the roadmap is already
  focused on) — all pure functions over the other modules' real data.

## Design tokens

Defined centrally in `tailwind.config.js` — colors (`primary`,
`accent`, `success`, `warning`, `critical`, `ink`, `canvas`, `surface`,
`border`), fonts (`font-display` = Space Grotesk, `font-body` = IBM
Plex Sans, `font-mono` = IBM Plex Mono for all scores/percentages),
radius, and shadow scale. No arbitrary hex values in components.

## Validation performed

- Every `.js`/`.jsx` file (84 total) was syntax-checked offline with
  esbuild's JSX transformer — 0 errors — after every Part 7 edit.
- `getRoadmap()`'s derived-priority output was actually executed in
  Node and confirmed to match Skill Gaps' own priority computation
  (not just assumed from reading the code).
- The full `progressApi.js` data composition was actually **executed**
  in Node (not just syntax-checked) to confirm every derived number —
  readiness deltas, competency growth, roadmap %, priority areas — comes
  out internally consistent. Output is in this session's history if
  you want to see it.
- Every relative import path was checked to resolve to a real file —
  0 unresolved.
- **Not performed:** `npm install`, `npm run dev`, `npm run build`, or
  any in-browser check. The build sandbox this project was written in
  has no network access, so dependencies could not be installed and
  the dev server could not actually be started. Please run the two
  commands above yourself — if anything doesn't compile, it's most
  likely a version mismatch in `package.json`, not a logic error, and
  the fix is usually just bumping/pinning a dependency version.


## Merged frontend
This build combines the landing/auth/onboarding/resume-upload flow with the dashboard, career goal, competency, skill gaps, roadmap, progress, and assessment pages.
