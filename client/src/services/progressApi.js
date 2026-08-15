import { mockProgressData } from '../data/mockProgressData.js'
import { mockCompetencyProfile } from '../data/mockCompetencyData.js'
import { mockSkillGapData } from '../data/mockSkillGapData.js'
import { mockRoadmapData } from '../data/mockRoadmapData.js'
import { buildSkillGapCompetencies } from '../utils/careerDataUtils.js'
import {
  readinessDeltaSinceStart,
  readinessDeltaSincePrevious,
  competencyGrowthList,
  averageGrowth,
  biggestImprovement,
  recentMilestones,
  recentAssessments,
  remainingPriorityAreas,
  roadmapSummaryForProgress,
} from '../utils/progressUtils.js'
import { findCurrentMilestone } from '../utils/roadmapUtils.js'

const SIMULATED_LATENCY_MS = 500

function buildProgressPayload(roleDefinition, careerGoal) {
  const { readinessHistory, milestoneCompletions } = mockProgressData
  const allowedIds = roleDefinition ? new Set(roleDefinition.competencies.map((item) => item.id)) : null
  const competencies = allowedIds
    ? mockCompetencyProfile.competencies.filter((item) => allowedIds.has(item.id))
    : mockCompetencyProfile.competencies
  const growth = competencyGrowthList(competencies)
  const skillGaps = roleDefinition ? buildSkillGapCompetencies(roleDefinition) : mockSkillGapData.competencies

  const isBackendDemo = roleDefinition?.name === 'Backend Developer'
  const currentMilestone = isBackendDemo ? findCurrentMilestone(mockRoadmapData.phases) : null
  const roadmap = isBackendDemo
    ? { ...roadmapSummaryForProgress(mockRoadmapData), targetRole: careerGoal?.role ?? null }
    : { overall: 0, counts: { completed: 0, inProgress: 0, upcoming: 0, total: 0 }, phases: [] }

  return {
    targetRole: careerGoal?.role ?? null,
    readinessHistory,
    readinessNow: readinessHistory.at(-1)?.score ?? null,
    readinessDeltaSinceStart: readinessDeltaSinceStart(readinessHistory),
    readinessDeltaSincePrevious: readinessDeltaSincePrevious(readinessHistory),
    competencyGrowth: growth,
    averageGrowth: averageGrowth(growth),
    biggestImprovement: biggestImprovement(growth),
    roadmap,
    recentMilestones: isBackendDemo ? recentMilestones(mockRoadmapData.phases, milestoneCompletions) : [],
    recentAssessments: recentAssessments(competencies),
    remainingPriorityAreas: remainingPriorityAreas(skillGaps, currentMilestone?.skills ?? []),
    currentFocusTitle: currentMilestone?.title ?? null,
  }
}

export function getProgress(roleDefinition, careerGoal) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(buildProgressPayload(roleDefinition, careerGoal)), SIMULATED_LATENCY_MS)
  })
}
