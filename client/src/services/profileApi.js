import { apiClient } from './apiClient.js'

export function getMyProfile() {
  return apiClient.get('/profiles/me/')
}

export function updateMyProfile(patch) {
  return apiClient.patch('/profiles/me/', patch)
}