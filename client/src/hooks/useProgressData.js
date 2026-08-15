import { useCallback, useEffect, useState } from 'react'
import { getProgress } from '../services/progressApi.js'
import { useCareerGoal } from '../context/CareerGoalContext.jsx'

export function useProgressData() {
  const { roleDefinition, careerGoal, revision } = useCareerGoal()
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')

  const load = useCallback(() => {
    setStatus('loading')
    getProgress(roleDefinition, careerGoal)
      .then((result) => {
        setData(result)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [roleDefinition, careerGoal])

  useEffect(() => {
    if (revision >= 0) load()
  }, [load, revision])

  return { data, status, reload: load }
}
