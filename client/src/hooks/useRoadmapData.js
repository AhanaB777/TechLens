import { useCallback, useEffect, useState } from 'react'
import { getRoadmap } from '../services/roadmapApi.js'
import { useCareerGoal } from '../context/CareerGoalContext.jsx'

export function useRoadmapData() {
  const { roleDefinition, careerGoal, revision } = useCareerGoal()
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')

  const load = useCallback(() => {
    setStatus('loading')
    getRoadmap(roleDefinition, careerGoal)
      .then((result) => {
        setData(result)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [roleDefinition, careerGoal])

  useEffect(() => {
    if (revision >= 0) load()
  }, [load, revision])

  const toggleTask = useCallback((milestoneId, taskId) => {
    setData((current) => {
      if (!current) return current
      return {
        ...current,
        phases: current.phases.map((phase) => ({
          ...phase,
          milestones: phase.milestones.map((m) =>
            m.id !== milestoneId
              ? m
              : {
                  ...m,
                  tasks: m.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
                },
          ),
        })),
      }
    })
  }, [])

  return { data, status, reload: load, toggleTask }
}
