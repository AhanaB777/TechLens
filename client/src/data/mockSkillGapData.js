// MOCK DATA — not backend data.
// Shaped like the future skillGapApi.getSkillGaps() response.
//
// `gap` and `priority` are deliberately NOT stored here — they're
// derived (calculateGap / getGapPriority in utils/scoreUtils.js) from
// current + required + importance, so there's one source of truth
// instead of numbers that can drift out of sync with each other.
//
// current: null means "not assessed", which the UI must never treat
// as equivalent to a score of 0.

export const mockSkillGapData = {
  careerGoal: {
    isSet: true,
    role: 'Backend Developer',
    level: 'Entry Level',
    timeline: '6 months',
  },

  competencyProfileReady: true,

  readiness: 72,

  competencies: [
    {
      id: 'python',
      name: 'Python',
      category: 'Programming',
      current: 87,
      required: 80,
      importance: 'Essential',
    },
    {
      id: 'sql',
      name: 'SQL',
      category: 'Databases',
      current: 81,
      required: 75,
      importance: 'Essential',
    },
    {
      id: 'problem-solving',
      name: 'Problem Solving',
      category: 'Professional Skills',
      current: 84,
      required: 80,
      importance: 'Essential',
    },
    {
      id: 'django',
      name: 'Django',
      category: 'Backend Development',
      current: 79,
      required: 75,
      importance: 'Important',
    },
    {
      id: 'rest-apis',
      name: 'REST APIs',
      category: 'Backend Development',
      current: 76,
      required: 78,
      importance: 'Important',
      whyItMatters: 'REST APIs are the primary way backend services communicate with clients.',
    },
    {
      id: 'docker',
      name: 'Docker',
      category: 'Tools & Workflow',
      current: 62,
      required: 75,
      importance: 'Important',
      whyItMatters:
        'Docker packages backend applications consistently across development, testing, and deployment.',
    },
    {
      id: 'testing',
      name: 'Testing',
      category: 'Tools & Workflow',
      current: 58,
      required: 70,
      importance: 'Important',
      whyItMatters: 'Automated tests catch regressions before they reach production.',
    },
    {
      id: 'ci-cd',
      name: 'CI/CD',
      category: 'Tools & Workflow',
      current: null,
      required: 65,
      importance: 'Supporting',
      whyItMatters: 'CI/CD pipelines automate build, test, and deployment steps.',
    },
  ],
}

// Exercises the "no gaps" success state — every competency already
// meets or exceeds its target. Not wired up by default.
export const mockSkillGapDataAllOnTrack = {
  ...mockSkillGapData,
  competencies: mockSkillGapData.competencies
    .filter((c) => c.current != null)
    .map((c) => ({ ...c, current: Math.max(c.current, c.required) })),
}

// Exercises the "career goal not set" empty state. Not wired up by default.
export const mockSkillGapDataNoCareerGoal = {
  careerGoal: { isSet: false, role: null, level: null, timeline: null },
  competencyProfileReady: false,
  readiness: 0,
  competencies: [],
}

// Exercises the "competency profile not ready" empty state (goal is
// set, but no competency data exists yet). Not wired up by default.
export const mockSkillGapDataNoProfile = {
  careerGoal: mockSkillGapData.careerGoal,
  competencyProfileReady: false,
  readiness: 0,
  competencies: [],
}
