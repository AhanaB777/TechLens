import { mockCompetencyProfile } from '../data/mockCompetencyData.js'

const currentById = new Map(mockCompetencyProfile.competencies.map((item) => [item.id, item]))

export function buildCompetenciesForRole(roleDefinition) {
  if (!roleDefinition) return []

  return roleDefinition.competencies.map((required) => {
    const current = currentById.get(required.id)

    if (!current) {
      return {
        id: required.id,
        name: required.name,
        category: required.category,
        score: null,
        status: 'Needs Assessment',
        lastAssessed: null,
        evidence: { projects: 0, assessments: 0, certifications: 0 },
        trend: { available: false },
        strengths: [],
      }
    }

    return {
      ...current,
      category: required.category,
    }
  })
}

export function buildSkillGapCompetencies(roleDefinition) {
  if (!roleDefinition) return []

  const current = new Map(mockCompetencyProfile.competencies.map((item) => [item.id, item.score]))

  return roleDefinition.competencies.map((required) => ({
    id: required.id,
    name: required.name,
    category: required.category,
    current: current.get(required.id) ?? null,
    required: required.required,
    importance: required.importance,
  }))
}
