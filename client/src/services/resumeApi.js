import { apiClient } from './apiClient.js'

/** Upload a resume file. The backend analyzes it synchronously and returns
 *  the full record including extraction results. */
export function uploadResume(file) {
  const formData = new FormData()
  formData.append('resume', file)
  return apiClient.postForm('/resumes/', formData)
}

export function getResumes() {
  return apiClient.get('/resumes/')
}

export function getPrimaryResume() {
  return apiClient.get('/resumes/primary/')
}

export function setResumePrimary(id) {
  return apiClient.post(`/resumes/${id}/set_primary/`, {})
}