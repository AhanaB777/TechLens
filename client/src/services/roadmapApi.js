import { mockRoadmapData } from '../data/mockRoadmapData.js'
import { getCareerRole } from '../data/careerRoles.js'
import { mockSkillGapData } from '../data/mockSkillGapData.js'
import { withGapAnalysis, priorityForSkills } from '../utils/skillGapUtils.js'
import { buildSkillGapCompetencies } from '../utils/careerDataUtils.js'

const SIMULATED_LATENCY_MS = 500

function withDerivedPriority(data, skillGaps) {
  const analyzed = withGapAnalysis(skillGaps)
  return {
    ...data,
    phases: data.phases.map((phase) => ({
      ...phase,
      milestones: phase.milestones.map((m) => ({
        ...m,
        priority: priorityForSkills(analyzed, m.skills ?? []),
      })),
    })),
  }
}

export function getRoadmap(roleDefinition, careerGoal) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!roleDefinition || !careerGoal?.isSet) {
        resolve({
          targetRole: null,
          targetLevel: null,
          careerGoalSet: false,
          hasIdentifiedGaps: false,
          roadmapGenerated: false,
          phases: [],
        })
        return
      }

      const isBackendDemo = roleDefinition.name === 'Backend Developer'
      const skillGaps = isBackendDemo ? mockSkillGapData.competencies : buildSkillGapCompetencies(roleDefinition)

      if (!isBackendDemo) {
        resolve({
          targetRole: roleDefinition.name,
          targetLevel: careerGoal.level,
          careerGoalSet: true,
          hasIdentifiedGaps: skillGaps.some((item) => item.current == null || item.current < item.required),
          roadmapGenerated: false,
          phases: [],
        })
        return
      }

      resolve(
        withDerivedPriority(
          {
            ...mockRoadmapData,
            targetRole: roleDefinition.name,
            targetLevel: careerGoal.level,
            careerGoalSet: true,
            hasIdentifiedGaps: true,
          },
          skillGaps,
        ),
      )
    }, SIMULATED_LATENCY_MS)
  })
}
