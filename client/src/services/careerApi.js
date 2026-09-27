// client/src/services/careerApi.js
//
// Real implementation, replacing the localStorage-only mock. Talks to
// apps.career via /api/career/. Keeps the same exported function names
// and shapes CareerGoalContext.jsx already expects, so the context itself
// doesn't need changes.

import { apiClient } from './apiClient.js'

function mapGoal(goal) {
  return {
    id: goal.id,
    isSet: true,
    role: goal.role,
    level: goal.level,
    domain: goal.domain,
    timeline: goal.timeline,
    isPrimary: goal.is_primary,
  }
}

export async function getCareerGoals() {
  const goals = await apiClient.get('/career/goals/')
  const mapped = goals.map(mapGoal)
  const activeGoal = mapped.find((g) => g.isPrimary) ?? mapped[0] ?? null
  return { goals: mapped, activeGoalId: activeGoal?.id ?? null }
}

export async function updateCareerGoal(goal, goalId) {
  const payload = {}
  if (goal.role) payload.role = goal.role
  if (goal.level) payload.level = goal.level
  if (goal.timeline) payload.timeline = goal.timeline
  // The write serializer only returns {role, level, timeline} - missing id,
  // is_primary, domain, etc. Re-fetch the full (read-serializer) list
  // afterward rather than trusting that partial response.
  await apiClient.patch(`/career/goals/${goalId}/`, payload)
  const { goals } = await getCareerGoals()
  return goals.find((g) => g.id === goalId) ?? null
}

export async function addCareerGoal(goal) {
  const payload = { role: goal.role }
  if (goal.level) payload.level = goal.level
  if (goal.timeline) payload.timeline = goal.timeline
  // Same issue as updateCareerGoal - the create response is missing id,
  // so match the newly-created goal by role name after refetching.
  await apiClient.post('/career/goals/', payload)
  const { goals } = await getCareerGoals()
  const match = goals.find((g) => g.role.toLowerCase() === goal.role.toLowerCase())
  return match ?? goals[goals.length - 1] ?? null
}

export async function removeCareerGoal(goalId) {
  await apiClient.delete(`/career/goals/${goalId}/`)
  return getCareerGoals()
}

export async function setActiveCareerGoal(goalId) {
  await apiClient.post(`/career/goals/${goalId}/activate/`, {})
  return getCareerGoals()
}

export async function getCareerGoal() {
  const { goals, activeGoalId } = await getCareerGoals()
  return goals.find((g) => g.id === activeGoalId) ?? goals[0] ?? null
}

export function clearCareerGoal() {
  // No-op now that goals are backend-persisted, not localStorage-based.
  // Kept as a no-op (rather than removed) in case something still calls it.
}

export async function getCareerRoles() {
  const roles = await apiClient.get('/career/roles/')
  return roles.map((r) => ({
    name: r.name,
    slug: r.slug,
    domain: r.domain,
    description: r.description,
    // real per-skill requirements: [{skill_id, skill, category, importance, target_level, is_required}]
    competencies: r.competencies,
  }))
}