import { calculateGap, isOnTrack, getGapPriority } from './scoreUtils.js'

/** Enriches each competency with its derived gap and priority, once. */
export function withGapAnalysis(competencies) {
  return competencies.map((c) => {
    const notAssessed = c.current == null
    const gap = notAssessed ? null : calculateGap(c.current, c.required)
    const onTrack = !notAssessed && isOnTrack(c.current, c.required)
    return {
      ...c,
      gap,
      onTrack,
      notAssessed,
      priority: notAssessed
        ? { label: 'Not assessed', tone: 'neutral' }
        : getGapPriority(gap, c.importance),
    }
  })
}

/** Summary counts for the overview section. */
export function summarizeGaps(analyzed) {
  return {
    evaluated: analyzed.length,
    onTrack: analyzed.filter((c) => c.onTrack).length,
    needsImprovement: analyzed.filter((c) => !c.onTrack && !c.notAssessed).length,
    notAssessed: analyzed.filter((c) => c.notAssessed).length,
    highPriority: analyzed.filter((c) => c.priority.label === 'High priority').length,
  }
}

/** Competencies already meeting or exceeding their target, best-aligned first. */
export function strongestAlignment(analyzed, count = 3) {
  return analyzed
    .filter((c) => c.onTrack)
    .slice()
    .sort((a, b) => b.current - b.required - (a.current - a.required))
    .slice(0, count)
}

/** Competencies with the largest, highest-priority gaps, worst first. */
export function biggestGaps(analyzed, count = 3) {
  const order = { 'High priority': 0, 'Medium priority': 1, 'Low priority': 2 }
  return analyzed
    .filter((c) => !c.onTrack && !c.notAssessed)
    .slice()
    .sort((a, b) => {
      const byPriority = (order[a.priority.label] ?? 3) - (order[b.priority.label] ?? 3)
      return byPriority !== 0 ? byPriority : b.gap - a.gap
    })
    .slice(0, count)
}

/** The single most important thing to work on next, or null if nothing needs it. */
export function getNextFocus(analyzed) {
  const [top] = biggestGaps(analyzed, 1)
  return top ?? null
}

/**
 * Best (most urgent) skill-gap priority among a set of skill names, or
 * null if none of them have a currently-measured gap. Used to derive a
 * Roadmap milestone's priority from Skill Gaps' own computation instead
 * of a second, separately authored priority guess for the same skill.
 */
export function priorityForSkills(analyzed, skillNames) {
  const order = { 'High priority': 0, 'Medium priority': 1, 'Low priority': 2 }
  const matches = analyzed.filter((c) => skillNames.includes(c.name) && !c.onTrack && !c.notAssessed)
  if (!matches.length) return null
  return matches.slice().sort((a, b) => (order[a.priority.label] ?? 3) - (order[b.priority.label] ?? 3))[0]
    .priority
}
