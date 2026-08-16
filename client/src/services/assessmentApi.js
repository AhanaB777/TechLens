// client/src/services/assessmentApi.js
//
// Real implementation. The backend is now the single source of truth for
// assessment results - localStorage is no longer read as a fallback,
// since stale local data could silently override a real result.

import { apiClient } from './apiClient.js'

// Maps one backend AssessmentAttempt (from GET /assessments/attempts/mine/)
// into the {score, maxScore, completed, completedAt} shape ProfileHero.jsx
// already expects.
function mapAttempt(attempt) {
  if (!attempt || attempt.status !== 'completed') {
    return { completed: false }
  }
  return {
    score: Math.round(attempt.overall_score),
    maxScore: 100, // backend already normalizes overall_score to a 0-100 percentage
    completed: true,
    completedAt: attempt.completed_at ? attempt.completed_at.slice(0, 10) : null,
    // extra detail available if the UI wants a per-skill breakdown later
    skillResults: attempt.skill_results,
  }
}

export async function getAssessmentResult() {
  const attempts = await apiClient.get('/assessments/attempts/mine/')
  // attempts are ordered most-recent-first by the backend already
  const latestCompleted = attempts.find((a) => a.status === 'completed')
  return mapAttempt(latestCompleted)
}

// Real cooldown state, per skill - powers "retest available in N days" UI.
// This replaces the frontend's own client-side 10-day tracking; the
// backend is now the actual source of truth for the cooldown rule.
export async function getCooldowns() {
  return apiClient.get('/assessments/cooldowns/')
}

// Builds a new multi-skill test attempt via the engine. Returns the
// attempt with its questions, or a {detail: "..."} message if nothing
// currently needs testing (not an error - see FRONTEND_INTEGRATION_GUIDE.md).
export async function startAssessment({ numSkills = 3, questionsPerSkill = 5 } = {}) {
  return apiClient.post('/assessments/start/', {
    num_skills: numSkills,
    questions_per_skill: questionsPerSkill,
  })
}

// Submits answers for an in-progress attempt. `answers` is
// [{question_id, answer}, ...].
export async function submitAssessment(attemptId, answers) {
  return apiClient.post(`/assessments/attempts/${attemptId}/submit/`, { answers })
}