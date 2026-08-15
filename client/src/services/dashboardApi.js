import { mockDashboardData } from '../data/mockDashboardData.js'
import { mockRoadmapData } from '../data/mockRoadmapData.js'
import { getCareerRole } from '../data/careerRoles.js'
import { overallProgress, findCurrentMilestone, flattenMilestones } from '../utils/roadmapUtils.js'
import { buildSkillGapCompetencies } from '../utils/careerDataUtils.js'
import { withGapAnalysis, biggestGaps } from '../utils/skillGapUtils.js'

const SIMULATED_LATENCY_MS = 500
const STATUS_TO_STEP_STATE = { Completed: 'done', 'In Progress': 'current', Upcoming: 'upcoming' }

function deriveRoadmapSummary() {
  const current = findCurrentMilestone(mockRoadmapData.phases)
  return {
    targetRole: mockRoadmapData.targetRole,
    progress: overallProgress(mockRoadmapData.phases),
    currentFocus: current?.title ?? null,
    steps: flattenMilestones(mockRoadmapData.phases).map((m) => ({
      name: m.title,
      status: STATUS_TO_STEP_STATE[m.status],
    })),
  }
}

export function getDashboard(careerGoal) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!careerGoal?.isSet) {
        resolve({
          ...mockDashboardData,
          user: { ...mockDashboardData.user, targetRole: null, experienceLevel: null },
          careerGoal: { isSet: false, role: null, level: null, timeline: null },
          readiness: { score: 0, previousScore: null },
          competencies: [],
          skillGaps: [],
          roadmap: { targetRole: null, progress: 0, currentFocus: null, steps: [] },
          nextAction: null,
          recentActivity: [],
        })
        return
      }

      const role = getCareerRole(careerGoal.role)
      const gaps = withGapAnalysis(buildSkillGapCompetencies(role))
      const topGaps = biggestGaps(gaps, 3)

      const isBackendDemo = role.name === 'Backend Developer'
      const roadmap = isBackendDemo
        ? { ...deriveRoadmapSummary(), targetRole: role.name }
        : { targetRole: role.name, progress: 0, currentFocus: null, steps: [] }

      resolve({
        ...mockDashboardData,
        user: {
          ...mockDashboardData.user,
          targetRole: role.name,
          experienceLevel: careerGoal.level,
        },
        careerGoal,
        competencies: gaps.filter((item) => item.current != null).map((item) => ({ name: item.name, score: item.current })).slice(0, 5),
        skillGaps: topGaps.map((item) => ({
          name: item.name,
          current: item.current,
          target: item.required,
          gap: item.gap,
        })),
        nextAction: topGaps[0]
          ? {
              title: `Strengthen ${topGaps[0].name}`,
              description: `${topGaps[0].name} is currently ${topGaps[0].gap} points below your ${role.name} target.`,
              actionLabel: 'Continue learning',
            }
          : null,
        roadmap,
      })
    }, SIMULATED_LATENCY_MS)
  })
}
