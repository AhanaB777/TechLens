import { mockAssessmentResult } from '../data/mockAssessmentData.js'

const SIMULATED_LATENCY_MS = 300
const STORAGE_KEY = 'techlens_assessment_result'

function readStoredResult() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed.score !== 'number' || typeof parsed.maxScore !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

export function getAssessmentResult() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(readStoredResult() ?? { ...mockAssessmentResult }), SIMULATED_LATENCY_MS)
  })
}

/**
 * Frontend persistence hook for the future real assessment flow.
 * Call this only after an assessment has actually been completed.
 * The completion date is intentionally stored so the 10-day retake rule
 * can be enforced consistently by the UI until a backend is connected.
 */
export function saveAssessmentResult({ score, maxScore = 100, completedAt = new Date().toISOString().slice(0, 10) }) {
  const result = {
    score,
    maxScore,
    completed: true,
    completedAt: String(completedAt).slice(0, 10),
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result))
  } catch {
    // Keep the service API usable if browser storage is unavailable.
  }

  return result
}
