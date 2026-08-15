// MOCK DATA — not backend data.
//
// This file is intentionally small. Competency growth, roadmap
// completion, remaining priority areas, and assessment history are NOT
// duplicated here — progressApi.js composes them live from
// mockCompetencyData.js, mockSkillGapData.js, and mockRoadmapData.js via
// utils/progressUtils.js. This file only holds the two things that
// genuinely don't exist anywhere else in the app: a readiness time
// series, and the dates completed milestones were finished on.
//
// The final readinessHistory point (72) matches the readiness score
// used across Dashboard, Competency Profile, and Skill Gaps. The
// second-to-last point (64) matches Dashboard's readiness.previousScore
// — both read from the same three-point history here, not two
// independently authored numbers.

export const mockProgressData = {
  readinessHistory: [
    { date: '2026-07-10', score: 60 },
    { date: '2026-07-24', score: 64 },
    { date: '2026-08-10', score: 72 },
  ],

  // Keyed by the milestone ids already defined in mockRoadmapData.js —
  // cross-referenced by id, not by duplicating milestone titles/status.
  milestoneCompletions: {
    'python-fundamentals': '2026-07-20',
    'sql-fundamentals': '2026-08-02',
    'rest-apis': '2026-08-09',
  },
}

// Exercises the empty/insufficient-history state — not wired up by default.
export const mockProgressDataEmpty = {
  readinessHistory: [],
  milestoneCompletions: {},
}
