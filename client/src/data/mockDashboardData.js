// MOCK DATA — not backend data.
// Shaped exactly like the response dashboardApi.getDashboard() will
// eventually return, so swapping the mock for a real fetch later is a
// one-line change in services/dashboardApi.js, not a UI rewrite.

export const mockDashboardData = {
  user: {
    name: 'Alex',
    targetRole: 'Backend Developer',
    experienceLevel: 'Entry Level',
  },

  careerGoal: {
    isSet: true,
    role: 'Backend Developer',
    level: 'Entry Level',
    timeline: '6 months',
  },

  readiness: {
    score: 72,
    previousScore: 64,
  },

  competencies: [
    { name: 'Python', score: 87 },
    { name: 'Problem Solving', score: 84 },
    { name: 'SQL', score: 81 },
    { name: 'Django', score: 79 },
    { name: 'REST APIs', score: 76 },
  ],

  skillGaps: [
    { name: 'CI/CD', current: 45, target: 65, gap: 20 },
    { name: 'Docker', current: 62, target: 75, gap: 13 },
    { name: 'Testing', current: 58, target: 70, gap: 12 },
  ],

  // Note: `roadmap` is intentionally NOT defined here. dashboardApi.js
  // derives it from mockRoadmapData + roadmapUtils at request time, so
  // this file isn't a second, driftable copy of roadmap progress.

  nextAction: {
    title: 'Strengthen Docker',
    description:
      'Docker is currently your largest competency gap for Backend Developer — a 13-point gap against your target.',
    actionLabel: 'Continue learning',
  },

  recentActivity: [
    {
      id: 'act-1',
      type: 'completed',
      text: 'SQL assessment completed',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'act-2',
      type: 'improved',
      text: 'Python score improved from 82 to 87',
      timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'act-3',
      type: 'completed',
      text: 'Roadmap milestone completed: SQL & Databases',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
}

// A version with no career goal set, for exercising the empty state.
// Not wired up by default — see hooks/useDashboardData.js.
export const mockDashboardDataNewUser = {
  user: { name: 'Jordan', targetRole: null, experienceLevel: null },
  careerGoal: { isSet: false, role: null, level: null, timeline: null },
  readiness: { score: 0, previousScore: null },
  competencies: [],
  skillGaps: [],
  roadmap: { targetRole: null, progress: 0, currentFocus: null, steps: [] },
  nextAction: null,
  recentActivity: [],
}
