import { mockSkillGapData } from '../data/mockSkillGapData.js'
import { buildSkillGapCompetencies } from '../utils/careerDataUtils.js'

const SIMULATED_LATENCY_MS = 500

export function getSkillGaps(roleDefinition, careerGoal) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!roleDefinition || !careerGoal?.isSet) {
        resolve({
          ...mockSkillGapData,
          careerGoal: { isSet: false, role: null, level: null, timeline: null },
          competencyProfileReady: false,
          readiness: 0,
          competencies: [],
        })
        return
      }

      resolve({
        ...mockSkillGapData,
        careerGoal,
        competencies: buildSkillGapCompetencies(roleDefinition),
      })
    }, SIMULATED_LATENCY_MS)
  })
}
