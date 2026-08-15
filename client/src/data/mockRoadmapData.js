// MOCK DATA — not backend data.
// Shaped like the future roadmapApi.getRoadmap() response.
//
// Deliberately absent: milestone.status, phase.status, and any overall
// "progress" number. Those are always derived from task.completed in
// utils/roadmapUtils.js, so a milestone can never show "68%" while its
// task list says 3/5 — there's exactly one source of truth. If a
// backend roadmap engine exists later and already returns authoritative
// status/progress, the derivation calls in the page are what get
// bypassed, not the components that render them.
//
// priority and estimatedEffort ARE stored directly — they're backend
// judgment calls (importance, sizing), not something the frontend can
// derive from task data.
//
// EXCEPTION: milestone.priority is intentionally NOT set here anymore.
// It's derived in roadmapApi.js from the same Skill Gap computation
// Skill Gaps itself uses (utils/skillGapUtils.priorityForSkills), so a
// milestone's priority badge can never disagree with what Skill Gaps
// says about the same skill — see Part 7 data-consistency notes in the
// README for the "Docker: High here, Medium there" bug this replaced.

export const mockRoadmapData = {
  targetRole: 'Backend Developer',
  targetLevel: 'Entry Level',
  careerGoalSet: true,
  hasIdentifiedGaps: true,
  roadmapGenerated: true,

  phases: [
    {
      id: 'foundations',
      title: 'Foundations',
      description: 'Build the core technical foundation your target role depends on.',
      milestones: [
        {
          id: 'python-fundamentals',
          title: 'Python Fundamentals',
          skills: ['Python'],
          tasks: [
            { id: 'py-1', title: 'Review core syntax and data structures', completed: true },
            { id: 'py-2', title: 'Complete a scripting practice project', completed: true },
            { id: 'py-3', title: 'Pass the Python competency assessment', completed: true },
          ],
        },
        {
          id: 'sql-fundamentals',
          title: 'SQL & Databases',
          skills: ['SQL'],
          tasks: [
            { id: 'sql-1', title: 'Practice queries, joins, and aggregation', completed: true },
            { id: 'sql-2', title: 'Design a small relational schema', completed: true },
          ],
        },
      ],
    },

    {
      id: 'backend-development',
      title: 'Backend Development',
      description: 'Turn language fundamentals into production-shaped backend work.',
      milestones: [
        {
          id: 'rest-apis',
          title: 'REST API Design',
          skills: ['REST APIs', 'Django'],
          tasks: [
            { id: 'api-1', title: 'Build a CRUD API with Django REST Framework', completed: true },
            { id: 'api-2', title: 'Add authentication to an existing API', completed: true },
          ],
        },
        {
          id: 'docker-containerization',
          title: 'Docker & Containerization',
          skills: ['Docker', 'REST APIs'],
          estimatedEffort: '~4–6 hours',
          gapPoints: 13,
          whyOnRoadmap:
            'Docker is currently 13 points below the target level and is one of your highest-priority gaps for Backend Developer.',
          tasks: [
            { id: 'docker-1', title: 'Understand images and containers', completed: true },
            { id: 'docker-2', title: 'Create a Dockerfile for an existing API', completed: true },
            { id: 'docker-3', title: 'Containerize the application', completed: false },
            { id: 'docker-4', title: 'Configure environment variables', completed: false },
            { id: 'docker-5', title: 'Run the app locally with Docker Compose', completed: false },
          ],
        },
        {
          id: 'testing-quality',
          title: 'Testing & Quality',
          skills: ['Testing'],
          estimatedEffort: '~4–6 hours',
          gapPoints: 12,
          whyOnRoadmap:
            'Testing is currently 12 points below the target level for Backend Developer.',
          tasks: [
            { id: 'test-1', title: 'Write unit tests for an existing API', completed: true },
            { id: 'test-2', title: 'Add integration tests for a database layer', completed: false },
            { id: 'test-3', title: 'Reach meaningful coverage on a real project', completed: false },
          ],
        },
      ],
    },

    {
      id: 'production-readiness',
      title: 'Production Readiness',
      description: 'Prepare backend work to run reliably outside your local machine.',
      milestones: [
        {
          id: 'ci-cd',
          title: 'CI/CD Pipelines',
          skills: ['CI/CD'],
          estimatedEffort: '~1 week',
          gapPoints: 20,
          whyOnRoadmap:
            'CI/CD is currently 20 points below the target level for Backend Developer.',
          tasks: [
            { id: 'cicd-1', title: 'Set up automated tests on every push', completed: false },
            { id: 'cicd-2', title: 'Configure an automated deployment pipeline', completed: false },
          ],
        },
        {
          id: 'deployment',
          title: 'Deployment & Monitoring',
          skills: ['Deployment'],
          estimatedEffort: '~3–5 hours',
          tasks: [
            { id: 'deploy-1', title: 'Deploy a backend service to a cloud provider', completed: false },
            { id: 'deploy-2', title: 'Set up basic uptime monitoring', completed: false },
          ],
        },
      ],
    },
  ],
}

// Variants for exercising the page's other states — not wired up by
// default. See hooks/useRoadmapData.js for the loading/error/data
// lifecycle these plug into.

export const mockRoadmapDataNoCareerGoal = {
  targetRole: null,
  targetLevel: null,
  careerGoalSet: false,
  hasIdentifiedGaps: false,
  roadmapGenerated: false,
  phases: [],
}

export const mockRoadmapDataNoGaps = {
  targetRole: 'Backend Developer',
  targetLevel: 'Entry Level',
  careerGoalSet: true,
  hasIdentifiedGaps: false,
  roadmapGenerated: false,
  phases: [],
}

export const mockRoadmapDataNotGenerated = {
  targetRole: 'Backend Developer',
  targetLevel: 'Entry Level',
  careerGoalSet: true,
  hasIdentifiedGaps: true,
  roadmapGenerated: false,
  phases: [],
}

// Every task complete — exercises the "roadmap complete" state.
export const mockRoadmapDataComplete = {
  ...mockRoadmapData,
  phases: mockRoadmapData.phases.map((phase) => ({
    ...phase,
    milestones: phase.milestones.map((m) => ({
      ...m,
      tasks: m.tasks.map((t) => ({ ...t, completed: true })),
    })),
  })),
}
