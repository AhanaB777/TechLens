import { mockCompetencyProfile } from '../data/mockCompetencyData.js'
import { buildCompetenciesForRole } from '../utils/careerDataUtils.js'

const SIMULATED_LATENCY_MS = 500

export function getProfile(roleDefinition) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!roleDefinition) {
        resolve(mockCompetencyProfile)
        return
      }

      const competencies = buildCompetenciesForRole(roleDefinition)
      const assessed = competencies.filter((c) => c.score != null)
      const overallScore = assessed.length
        ? Math.round(assessed.reduce((sum, c) => sum + c.score, 0) / assessed.length)
        : null

      resolve({
        ...mockCompetencyProfile,
        targetRole: roleDefinition.name,
        competencies,
        overallScore,
        readiness: mockCompetencyProfile.readiness,
        completeness: {
          ...mockCompetencyProfile.completeness,
          items: mockCompetencyProfile.completeness.items.map((item) =>
            item.label === 'Career goal' ? { ...item, done: true } : item,
          ),
        },
      })
    }, SIMULATED_LATENCY_MS)
  })
}
