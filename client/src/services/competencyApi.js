// client/src/services/competencyApi.js
//
// Real implementation, replacing the mock. Shape matches
// mockCompetencyProfile as closely as the backend currently supports -
// see inline notes for fields that are approximated or not yet available.

import { apiClient } from './apiClient.js'

// Maps backend CompetencyScore.confidence + evidence into the frontend's
// status labels. This mapping is a frontend/product decision, not a fixed
// backend contract - adjust the thresholds here if design wants different
// behavior, without needing a backend change.
function deriveStatus(score) {
  const hasAnyEvidence = score.score > 0 || score.confidence > 0
  if (!hasAnyEvidence) return 'Needs Assessment'
  if (score.confidence >= 0.5) return 'Verified'
  if (score.assessment_component > 0) return 'Assessed'
  return 'Developing'
}

async function fetchTrend(skillId) {
  try {
    const history = await apiClient.get(`/competencies/scores/${skillId}/history/`)
    if (!history || history.length < 2) return { available: false }
    return { available: true, history: history.map((h) => h.score) }
  } catch {
    return { available: false }
  }
}

export async function getProfile(roleDefinition) {
  const [dashboard, scores] = await Promise.all([
    apiClient.get('/competencies/dashboard/'),
    apiClient.get('/competencies/scores/'),
  ])

  const competencies = await Promise.all(
    scores.map(async (score) => {
      const hasAnyEvidence = Object.values(score.evidence_counts).some((count) => count > 0)
      return {
        id: score.skill.slug,
        name: score.skill.name,
        category: score.skill.category || 'General',
        // A real 0% (student was tested and scored 0) is different from
        // "never assessed" - only show null when there's truly no evidence,
        // not just because the resulting score happens to be low/zero.
        score: hasAnyEvidence ? Math.round(score.score) : null,
        status: deriveStatus(score),
        lastAssessed: score.updated_at ? score.updated_at.split('T')[0] : null,
        evidence: {
          projects: score.evidence_counts.projects,
          assessments: score.evidence_counts.assessments,
          certifications: 0, // NOT YET SUPPORTED: no certifications evidence source exists in the backend model
        },
        trend: await fetchTrend(score.skill.id),
        // NOT YET SUPPORTED: backend doesn't currently return per-skill
        // strength descriptions, only the score itself.
        strengths: [],
      }
    }),
  )

  return {
    // NOT YET SUPPORTED: no per-user selected career name available until
    // the `careers` + `profiles.career_goal` integration is live.
    targetRole: roleDefinition?.name ?? null,

    overallScore: scores.length > 0 ? Math.round(dashboard.competency_score) : null,

    // NOT YET SUPPORTED: no historical "previous overall score" is stored
    // anywhere yet (only per-skill history exists). Leaving null rather
    // than guessing - check how the component handles a null value here.
    previousOverallScore: null,

    // null means "not measured yet" (no career goal wired up) - NOT the same
    // as 0% readiness. Pass null through so the UI can show a distinct
    // "not available" state rather than a misleading zero.
    readiness: dashboard.career_readiness != null ? Math.round(dashboard.career_readiness) : null,

    competencies,

    // Deliberately NOT populated: profile completeness is owned by
    // profiles/resumes, not competencies - matches the mock's
    // `mockCompetencyProfileEmpty.completeness: null` fallback case.
    completeness: null,
  }
}