import { trendDelta } from './scoreUtils.js'
import { withGapAnalysis, biggestGaps } from './skillGapUtils.js'
import { phaseProgress, milestoneStatus, overallProgress, milestoneCounts } from './roadmapUtils.js'

/** Point change from the very first recorded readiness score to the latest. */
export function readinessDeltaSinceStart(history) {
  return trendDelta(history.map((h) => h.score))
}

/** Point change since the second-most-recent readiness snapshot — "since last assessment". */
export function readinessDeltaSincePrevious(history) {
  if (history.length < 2) return null
  return history[history.length - 1].score - history[history.length - 2].score
}

/**
 * Competency growth list, sourced directly from the Competency Profile's
 * own trend data — never a separately maintained copy. Competencies
 * without trend history are excluded rather than given a fabricated
 * "previous" score.
 */
export function competencyGrowthList(competencies) {
  return competencies
    .filter((c) => c.trend?.available && c.trend.history?.length >= 2)
    .map((c) => ({
      id: c.id,
      name: c.name,
      previousScore: c.trend.history[0],
      currentScore: c.trend.history[c.trend.history.length - 1],
      delta: trendDelta(c.trend.history),
    }))
}

/** Average growth across competencies that have trend data. Null if none do. */
export function averageGrowth(growthList) {
  if (!growthList.length) return null
  const sum = growthList.reduce((acc, g) => acc + g.delta, 0)
  return Math.round(sum / growthList.length)
}

/** The single largest competency improvement, or null if no trend data exists. */
export function biggestImprovement(growthList) {
  if (!growthList.length) return null
  return growthList.slice().sort((a, b) => b.delta - a.delta)[0]
}

/** Per-phase completion percentages, for the compact roadmap summary. */
export function roadmapPhaseSummary(phases) {
  return phases.map((phase) => ({ id: phase.id, title: phase.title, progress: phaseProgress(phase) }))
}

/**
 * Completed milestones joined with their completion dates, most recent
 * first. `completions` is a small { milestoneId -> date } side-table —
 * milestone identity and status still come from the roadmap itself.
 */
export function recentMilestones(phases, completions, count = 3) {
  const completed = phases.flatMap((phase) =>
    phase.milestones
      .filter((m) => milestoneStatus(m) === 'Completed')
      .map((m) => ({ id: m.id, title: m.title, completedAt: completions[m.id] ?? null })),
  )
  return completed
    .filter((m) => m.completedAt)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, count)
}

/**
 * Recent competency assessments, sourced from the Competency Profile's
 * own lastAssessed dates — there's no separate "assessment" entity in
 * this data model, so this reads as "recent assessments" rather than
 * inventing named assessment records that don't exist elsewhere.
 */
export function recentAssessments(competencies, count = 5) {
  return competencies
    .filter((c) => c.lastAssessed && c.score != null)
    .slice()
    .sort((a, b) => new Date(b.lastAssessed) - new Date(a.lastAssessed))
    .slice(0, count)
    .map((c) => ({ name: c.name, score: c.score, date: c.lastAssessed }))
}

/**
 * The next couple of gaps to focus on after whatever the roadmap is
 * already actively addressing — derived from the same priority logic
 * Skill Gaps uses, not a separately guessed list.
 */
export function remainingPriorityAreas(skillGapCompetencies, currentFocusSkills = [], count = 2) {
  const analyzed = withGapAnalysis(skillGapCompetencies)
  return biggestGaps(analyzed, count + currentFocusSkills.length)
    .filter((c) => !currentFocusSkills.includes(c.name))
    .slice(0, count)
}

/** Full roadmap-derived summary block Progress needs, in one call. */
export function roadmapSummaryForProgress(roadmapData) {
  return {
    overall: overallProgress(roadmapData.phases),
    counts: milestoneCounts(roadmapData.phases),
    phases: roadmapPhaseSummary(roadmapData.phases),
  }
}
