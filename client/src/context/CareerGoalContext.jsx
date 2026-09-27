import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  getCareerGoals,
  updateCareerGoal,
  addCareerGoal,
  removeCareerGoal,
  setActiveCareerGoal as persistActiveCareerGoal,
} from '../services/careerApi.js'
import { getCareerRole } from '../data/careerRoles.js'

const CareerGoalContext = createContext(null)

export function CareerGoalProvider({ children }) {
  const [careerGoals, setCareerGoals] = useState([])
  const [activeGoalId, setActiveGoalId] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [revision, setRevision] = useState(0)

  const loadCareerGoals = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const result = await getCareerGoals()
      setCareerGoals(result.goals)
      setActiveGoalId(result.activeGoalId)
      setStatus('success')
    } catch {
      setError('We could not load your career goals.')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    loadCareerGoals()
  }, [loadCareerGoals])

  const careerGoal = useMemo(
    () => careerGoals.find((goal) => goal.id === activeGoalId) ?? careerGoals[0] ?? null,
    [careerGoals, activeGoalId],
  )

  const roleDefinition = useMemo(
    () => (careerGoal?.role ? getCareerRole(careerGoal.role) : null),
    [careerGoal],
  )

  const saveCareerGoal = useCallback(async (nextGoal, goalId = activeGoalId) => {
    setError(null)
    const saved = await updateCareerGoal(nextGoal, goalId)
    setCareerGoals((current) => current.map((goal) => (goal.id === saved.id ? saved : goal)))
    setRevision((value) => value + 1)
    return saved
  }, [activeGoalId])

  const createCareerGoal = useCallback(async (nextGoal) => {
    setError(null)
    const created = await addCareerGoal(nextGoal)
    setCareerGoals((current) => [...current, created])
    setRevision((value) => value + 1)
    return created
  }, [])

  const deleteCareerGoal = useCallback(async (goalId) => {
    setError(null)
    const result = await removeCareerGoal(goalId)
    setCareerGoals(result.goals)
    setActiveGoalId(result.activeGoalId)
    setRevision((value) => value + 1)
  }, [])

  const selectCareerGoal = useCallback(async (goalId) => {
    const result = await persistActiveCareerGoal(goalId)
    setCareerGoals(result.goals)
    setActiveGoalId(result.activeGoalId)
    setRevision((value) => value + 1)
  }, [])

  const value = useMemo(
    () => ({
      careerGoal,
      careerGoals,
      activeGoalId,
      roleDefinition,
      status,
      error,
      revision,
      reloadCareerGoal: loadCareerGoals,
      reloadCareerGoals: loadCareerGoals,
      saveCareerGoal,
      addCareerGoal: createCareerGoal,
      removeCareerGoal: deleteCareerGoal,
      setActiveCareerGoal: selectCareerGoal,
    }),
    [careerGoal, careerGoals, activeGoalId, roleDefinition, status, error, revision, loadCareerGoals, saveCareerGoal, createCareerGoal, deleteCareerGoal, selectCareerGoal],
  )

  return <CareerGoalContext.Provider value={value}>{children}</CareerGoalContext.Provider>
}

export function useCareerGoal() {
  const context = useContext(CareerGoalContext)
  if (!context) throw new Error('useCareerGoal must be used inside CareerGoalProvider')
  return context
}
