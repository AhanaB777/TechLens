import { careerRoles, getCareerRole } from '../data/careerRoles.js'

const STORAGE_KEY = 'techlens_career_goals'
const LEGACY_STORAGE_KEY = 'techlens_career_goal'
const SIMULATED_LATENCY_MS = 250

const DEFAULT_GOAL = {
  isSet: true,
  level: 'Entry Level',
  timeline: '6 months',
}

function normalizeGoal(goal, index = 0) {
  const role = getCareerRole(goal?.role)
  return {
    id: goal?.id ?? `goal-${index + 1}`,
    isSet: true,
    role: role.name,
    level: goal?.level || DEFAULT_GOAL.level,
    domain: role.domain,
    timeline: goal?.timeline || DEFAULT_GOAL.timeline,
  }
}

function readStoredGoals() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed?.goals)) {
        const goals = parsed.goals
          .filter((goal) => goal?.role)
          .slice(0, 2)
          .map((goal, index) => normalizeGoal(goal, index))
        if (goals.length) {
          const activeGoalId = goals.some((goal) => goal.id === parsed.activeGoalId)
            ? parsed.activeGoalId
            : goals[0].id
          return { goals, activeGoalId }
        }
      }
    }

    // Migrate the previous single-goal storage format automatically.
    const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw)
      if (legacy?.role) {
        const goal = normalizeGoal(legacy, 0)
        return { goals: [goal], activeGoalId: goal.id }
      }
    }
  } catch {
    // Fall through to the demo default below.
  }

  const goal = normalizeGoal({ role: 'Backend Developer' }, 0)
  return { goals: [goal], activeGoalId: goal.id }
}

function persistGoals(state) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function getCareerGoals() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(readStoredGoals()), SIMULATED_LATENCY_MS)
  })
}

export function updateCareerGoal(goal, goalId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const state = readStoredGoals()
        const id = goalId || state.activeGoalId
        const existingIndex = state.goals.findIndex((item) => item.id === id)
        if (existingIndex < 0) throw new Error('Career goal not found.')

        const duplicate = state.goals.some(
          (item, index) => index !== existingIndex && item.role === getCareerRole(goal.role).name,
        )
        if (duplicate) throw new Error('That career is already one of your goals.')

        const normalized = normalizeGoal({ ...goal, id }, existingIndex)
        const goals = state.goals.map((item) => (item.id === id ? normalized : item))
        persistGoals({ goals, activeGoalId: state.activeGoalId })
        resolve(normalized)
      } catch (error) {
        reject(error)
      }
    }, SIMULATED_LATENCY_MS)
  })
}

export function addCareerGoal(goal) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const state = readStoredGoals()
        if (state.goals.length >= 2) throw new Error('You can have up to two career goals.')

        const role = getCareerRole(goal.role)
        if (state.goals.some((item) => item.role === role.name)) {
          throw new Error('That career is already one of your goals.')
        }

        const normalized = normalizeGoal({ ...goal, id: `goal-${Date.now()}` }, state.goals.length)
        const goals = [...state.goals, normalized]
        persistGoals({ goals, activeGoalId: state.activeGoalId })
        resolve(normalized)
      } catch (error) {
        reject(error)
      }
    }, SIMULATED_LATENCY_MS)
  })
}

export function removeCareerGoal(goalId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const state = readStoredGoals()
        if (state.goals.length <= 1) throw new Error('At least one career goal must remain.')

        const goals = state.goals.filter((goal) => goal.id !== goalId)
        if (goals.length === state.goals.length) throw new Error('Career goal not found.')

        const activeGoalId = goals.some((goal) => goal.id === state.activeGoalId)
          ? state.activeGoalId
          : goals[0].id
        persistGoals({ goals, activeGoalId })
        resolve({ goals, activeGoalId })
      } catch (error) {
        reject(error)
      }
    }, SIMULATED_LATENCY_MS)
  })
}

export function setActiveCareerGoal(goalId) {
  const state = readStoredGoals()
  if (!state.goals.some((goal) => goal.id === goalId)) {
    throw new Error('Career goal not found.')
  }
  const nextState = { ...state, activeGoalId: goalId }
  persistGoals(nextState)
  return nextState
}

export function getCareerGoal() {
  return getCareerGoals().then(({ goals, activeGoalId }) => (
    goals.find((goal) => goal.id === activeGoalId) ?? goals[0] ?? null
  ))
}

export function clearCareerGoal() {
  window.localStorage.removeItem(STORAGE_KEY)
  window.localStorage.removeItem(LEGACY_STORAGE_KEY)
}

export function getCareerRoles() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(careerRoles), SIMULATED_LATENCY_MS)
  })
}
