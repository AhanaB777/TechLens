// MOCK DATA — not backend data.
// Shaped like the future competencyApi.getProfile() response. Swapping
// this for a real fetch later is a one-line change in
// services/competencyApi.js, not a UI rewrite.
//
// Status values are treated as backend-owned classifications, not
// something the frontend derives — see utils/scoreUtils.js.

export const mockCompetencyProfile = {
  targetRole: 'Backend Developer',
  overallScore: 82,
  previousOverallScore: 76,
  readiness: 72,

  competencies: [
    {
      id: 'python',
      name: 'Python',
      category: 'Programming',
      score: 87,
      status: 'Verified',
      lastAssessed: '2026-08-10',
      evidence: { projects: 3, assessments: 2, certifications: 0 },
      trend: { available: true, history: [78, 82, 87] },
      strengths: ['Syntax & idioms', 'Data structures', 'Backend scripting'],
    },
    {
      id: 'problem-solving',
      name: 'Problem Solving',
      category: 'Professional Skills',
      score: 84,
      status: 'Verified',
      lastAssessed: '2026-07-28',
      evidence: { projects: 2, assessments: 3, certifications: 0 },
      trend: { available: false },
      strengths: ['Debugging approach', 'Breaking down ambiguous problems'],
    },
    {
      id: 'sql',
      name: 'SQL',
      category: 'Databases',
      score: 81,
      status: 'Verified',
      lastAssessed: '2026-08-05',
      evidence: { projects: 2, assessments: 1, certifications: 0 },
      trend: { available: true, history: [70, 74, 81] },
      strengths: ['Query design', 'Joins & aggregation'],
    },
    {
      id: 'django',
      name: 'Django',
      category: 'Backend Development',
      score: 79,
      status: 'Assessed',
      lastAssessed: '2026-07-15',
      evidence: { projects: 1, assessments: 1, certifications: 0 },
      trend: { available: false },
      strengths: ['Models & ORM', 'REST framework basics'],
    },
    {
      id: 'rest-apis',
      name: 'REST APIs',
      category: 'Backend Development',
      score: 76,
      status: 'Assessed',
      lastAssessed: '2026-06-30',
      evidence: { projects: 2, assessments: 0, certifications: 0 },
      trend: { available: false },
      strengths: [],
    },
    {
      id: 'docker',
      name: 'Docker',
      category: 'Tools & Workflow',
      score: 62,
      status: 'Developing',
      lastAssessed: '2026-05-20',
      evidence: { projects: 1, assessments: 0, certifications: 0 },
      trend: { available: true, history: [45, 53, 62] },
      strengths: [],
    },
    {
      id: 'testing',
      name: 'Testing',
      category: 'Tools & Workflow',
      score: 58,
      status: 'Developing',
      lastAssessed: '2026-04-02',
      evidence: { projects: 0, assessments: 1, certifications: 0 },
      trend: { available: false },
      strengths: [],
    },
    {
      id: 'ci-cd',
      name: 'CI/CD',
      category: 'Tools & Workflow',
      score: null,
      status: 'Needs Assessment',
      lastAssessed: null,
      evidence: { projects: 0, assessments: 0, certifications: 0 },
      trend: { available: false },
      strengths: [],
    },
  ],

  completeness: {
    score: 84,
    items: [
      { label: 'Career goal', done: true },
      { label: 'Resume', done: true },
      { label: 'Assessments', done: true },
      { label: 'Projects', done: true },
      { label: 'Certifications', done: false },
    ],
  },
}

// Exercises the empty-profile state — not wired up by default.
export const mockCompetencyProfileEmpty = {
  targetRole: 'Backend Developer',
  overallScore: null,
  previousOverallScore: null,
  readiness: 0,
  competencies: [],
  completeness: null,
}
