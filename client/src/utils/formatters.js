/** Time-of-day greeting, e.g. "Good morning". */
export function timeOfDayGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 5) return 'Good night'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

/** Relative time from an ISO string, e.g. "2 hours ago". Coarse on purpose. */
export function relativeTime(isoString, now = new Date()) {
  const then = new Date(isoString)
  const diffMs = now - then
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diffMs < minute) return 'Just now'
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} min ago`
  if (diffMs < day) return `${Math.floor(diffMs / hour)} hour${Math.floor(diffMs / hour) === 1 ? '' : 's'} ago`
  const days = Math.floor(diffMs / day)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return then.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

/** Compact date label for charts/history lists, e.g. "Aug 10". */
export function shortDate(isoDateString) {
  return new Date(isoDateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
