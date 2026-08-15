/** Maps a 0-100 competency score to a semantic tone for bars/badges. */
export function scoreToTone(score) {
  if (score >= 75) return 'success'
  if (score >= 50) return 'warning'
  return 'critical'
}

/** Maps a skill-gap size to a priority label + tone (text, never color-only). */
export function gapToPriority(gap) {
  if (gap >= 18) return { label: 'High priority', tone: 'critical' }
  if (gap >= 10) return { label: 'Medium priority', tone: 'warning' }
  return { label: 'Low priority', tone: 'success' }
}

/** Human-readable readiness status from a score, used under the dial. */
export function readinessStatus(score) {
  if (score >= 80) return 'Ready for your target role'
  if (score >= 60) return 'On track for your target role'
  if (score >= 35) return 'Building toward your target role'
  return 'Just getting started'
}

// UI-only score classification band. Explicitly NOT a competency
// standard — if the product later defines an official scoring model,
// swap this function's body, not its call sites.
const SCORE_LABELS = [
  { min: 90, label: 'Advanced' },
  { min: 75, label: 'Strong' },
  { min: 60, label: 'Capable' },
  { min: 40, label: 'Developing' },
  { min: 0, label: 'Beginning' },
]

/** UI-only label for a 0-100 score, e.g. 87 -> "Strong". Null-safe. */
export function getScoreLabel(score) {
  if (score == null) return null
  return SCORE_LABELS.find((band) => score >= band.min)?.label ?? null
}

// Backend-owned competency status -> badge tone. The frontend displays
// this classification, it does not calculate or invent it.
const STATUS_TONE = {
  Verified: 'success',
  Assessed: 'primary',
  Developing: 'warning',
  'Needs Assessment': 'neutral',
  'Not Yet Demonstrated': 'neutral',
}

/** Badge tone for a competency status string coming from the data model. */
export function statusToTone(status) {
  return STATUS_TONE[status] ?? 'neutral'
}

/** Whether current competency already meets or exceeds the required level. */
export function isOnTrack(current, required) {
  if (current == null || required == null) return false
  return current >= required
}

// Combines gap size with the competency's importance to the target role.
// Deliberately simple (one step up/down, capped) rather than a scoring
// model — the brief is explicit that the frontend shouldn't invent a
// sophisticated weighting algorithm. If a backend gap-priority engine
// exists later, this function is what gets replaced/bypassed, not the
// call sites that use it.
const IMPORTANCE_SHIFT = { Essential: 1, Important: 0, Supporting: -1 }
const PRIORITY_LEVELS = [
  { label: 'Low priority', tone: 'success' },
  { label: 'Medium priority', tone: 'warning' },
  { label: 'High priority', tone: 'critical' },
]

/** Priority for a gap, combining its size with the skill's importance. */
export function getGapPriority(gap, importance = 'Important') {
  if (gap <= 0) return { label: 'On track', tone: 'success' }
  const baseLevel = gap >= 18 ? 2 : gap >= 10 ? 1 : 0
  const shift = IMPORTANCE_SHIFT[importance] ?? 0
  const level = Math.max(0, Math.min(2, baseLevel + shift))
  return PRIORITY_LEVELS[level]
}

/** Positive point difference toward a target, or null if no target. */
export function calculateGap(current, target) {
  if (current == null || target == null) return null
  return Math.max(0, target - current)
}

/** Net point change across a score history array, or null if not enough data. */
export function trendDelta(history) {
  if (!history || history.length < 2) return null
  return history[history.length - 1] - history[0]
}

/** Relative recency label for a competency's last-assessed date. Null-safe. */
export function recencyLabel(isoDateString, now = new Date()) {
  if (!isoDateString) return 'Not yet assessed'
  const then = new Date(isoDateString)
  const days = Math.floor((now - then) / (1000 * 60 * 60 * 24))
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  if (days < 60) return '1 month ago'
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return then.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
}
