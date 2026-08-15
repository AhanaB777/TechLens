import { useCallback, useEffect, useState } from 'react'
import { getAssessmentResult } from '../services/assessmentApi.js'

export function useAssessmentResult() {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')

  const load = useCallback(() => {
    setStatus('loading')
    getAssessmentResult()
      .then((result) => {
        setData(result)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { data, status, reload: load }
}
