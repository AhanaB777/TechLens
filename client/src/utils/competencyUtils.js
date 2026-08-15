/** Groups competencies by category, preserving first-seen category order. */
export function groupByCategory(competencies) {
  const order = []
  const groups = {}
  for (const c of competencies) {
    if (!groups[c.category]) {
      groups[c.category] = []
      order.push(c.category)
    }
    groups[c.category].push(c)
  }
  return order.map((category) => ({ category, items: groups[category] }))
}

/** Top N scored competencies, highest first. Skips competencies with no score yet. */
export function topStrengths(competencies, count = 3) {
  return competencies
    .filter((c) => c.score != null)
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
}

/** Lowest N scored competencies that already have a score (excludes "not yet assessed"). */
export function topImprovementAreas(competencies, count = 3) {
  return competencies
    .filter((c) => c.score != null)
    .slice()
    .sort((a, b) => a.score - b.score)
    .slice(0, count)
}
