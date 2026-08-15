const COOLDOWN_DAYS = 10

function parseDateOnly(value) {
  if (!value) return null
  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function startOfDay(value = new Date()) {
  const date = value instanceof Date ? new Date(value) : new Date(value)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function getAssessmentAvailability(result, now = new Date()) {
  if (!result?.completed || !result.completedAt) {
    return {
      canTake: true,
      daysRemaining: 0,
      nextAvailableDate: null,
    }
  }

  const completedDate = parseDateOnly(result.completedAt)
  if (!completedDate) {
    return {
      canTake: true,
      daysRemaining: 0,
      nextAvailableDate: null,
    }
  }

  const nextAvailableDate = new Date(completedDate)
  nextAvailableDate.setDate(nextAvailableDate.getDate() + COOLDOWN_DAYS)

  const today = startOfDay(now)
  const nextDay = startOfDay(nextAvailableDate)
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  const daysRemaining = Math.max(0, Math.ceil((nextDay - today) / millisecondsPerDay))

  return {
    canTake: today >= nextDay,
    daysRemaining,
    nextAvailableDate: nextDay,
  }
}

export function formatAssessmentDate(date) {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export { COOLDOWN_DAYS }
