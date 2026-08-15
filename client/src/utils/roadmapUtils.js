// Every status and progress number on the Roadmap page is derived from
// task.completed here — never stored, never hand-maintained separately.
// This is what keeps "3/5 tasks complete" and "milestone: 60%" from
// ever being able to drift out of sync with each other.

/** 0-100 completion for a task list. Empty list reads as 0, not NaN. */
export function taskProgress(tasks) {
  if (!tasks?.length) return 0
  const completed = tasks.filter((t) => t.completed).length
  return Math.round((completed / tasks.length) * 100)
}

/** Derived milestone status from its tasks alone. */
export function milestoneStatus(milestone) {
  const pct = taskProgress(milestone.tasks)
  if (!milestone.tasks?.length) return 'Upcoming'
  if (pct === 100) return 'Completed'
  if (pct > 0) return 'In Progress'
  return 'Upcoming'
}

/** Total/completed task counts across every milestone in a phase. */
export function phaseTaskCounts(phase) {
  return phase.milestones.reduce(
    (acc, m) => ({
      total: acc.total + (m.tasks?.length ?? 0),
      completed: acc.completed + (m.tasks?.filter((t) => t.completed).length ?? 0),
    }),
    { total: 0, completed: 0 },
  )
}

/** 0-100 completion for a phase, derived from all of its milestones' tasks. */
export function phaseProgress(phase) {
  const { total, completed } = phaseTaskCounts(phase)
  if (!total) return 0
  return Math.round((completed / total) * 100)
}

/** Derived phase status, same completed/in-progress/upcoming model as milestones. */
export function phaseStatus(phase) {
  const pct = phaseProgress(phase)
  const { total } = phaseTaskCounts(phase)
  if (!total) return 'Upcoming'
  if (pct === 100) return 'Completed'
  if (pct > 0) return 'In Progress'
  return 'Upcoming'
}

/** 0-100 completion across the entire roadmap. */
export function overallProgress(phases) {
  const totals = phases.reduce(
    (acc, phase) => {
      const { total, completed } = phaseTaskCounts(phase)
      return { total: acc.total + total, completed: acc.completed + completed }
    },
    { total: 0, completed: 0 },
  )
  if (!totals.total) return 0
  return Math.round((totals.completed / totals.total) * 100)
}

/** Flat list of every milestone with its derived status attached. */
export function flattenMilestones(phases) {
  return phases.flatMap((phase) =>
    phase.milestones.map((m) => ({ ...m, phaseId: phase.id, phaseTitle: phase.title, status: milestoneStatus(m) })),
  )
}

/** Counts of milestones by derived status, for the overview summary. */
export function milestoneCounts(phases) {
  const flat = flattenMilestones(phases)
  return {
    completed: flat.filter((m) => m.status === 'Completed').length,
    inProgress: flat.filter((m) => m.status === 'In Progress').length,
    upcoming: flat.filter((m) => m.status === 'Upcoming').length,
    total: flat.length,
  }
}

/**
 * The milestone the user should be working on right now: the first
 * "In Progress" milestone, or if none is in progress, the next
 * "Upcoming" one. Returns null when every milestone is complete.
 */
export function findCurrentMilestone(phases) {
  const flat = flattenMilestones(phases)
  return flat.find((m) => m.status === 'In Progress') ?? flat.find((m) => m.status === 'Upcoming') ?? null
}

/** First incomplete task in a milestone, or null if none remain. */
export function nextIncompleteTask(milestone) {
  return milestone.tasks?.find((t) => !t.completed) ?? null
}
