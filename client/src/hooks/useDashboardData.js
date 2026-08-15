import { useCallback, useEffect, useState } from 'react'
import { getDashboard } from '../services/dashboardApi.js'
import { useCareerGoal } from '../context/CareerGoalContext.jsx'

export function useDashboardData() {
  const { careerGoal, revision } = useCareerGoal()
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')

  const load = useCallback(() => {
    setStatus('loading')
    getDashboard(careerGoal)
      .then((result) => {
        setData(result)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [careerGoal])

  useEffect(() => {
    if (revision >= 0) load()
  }, [load, revision])

  return { data, status, reload: load }
}
