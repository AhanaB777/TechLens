import { useCallback, useEffect, useState } from 'react'
import { getProfile } from '../services/competencyApi.js'
import { useCareerGoal } from '../context/CareerGoalContext.jsx'

export function useCompetencyProfile() {
  const { roleDefinition, revision } = useCareerGoal()
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')

  const load = useCallback(() => {
    setStatus('loading')
    getProfile(roleDefinition)
      .then((result) => {
        setData(result)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [roleDefinition])

  useEffect(() => {
    if (revision >= 0) load()
  }, [load, revision])

  return { data, status, reload: load }
}
