// client/src/services/apiClient.js
//
// Central fetch wrapper for the Django backend. Uses JWT bearer token auth
// (rest_framework_simplejwt), matching how Login.jsx stores tokens in
// localStorage under 'access' / 'refresh'. No more session cookies or CSRF -
// that was the old pattern before the backend switched to JWT-only auth.

const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000/api'

async function request(path, { method = 'GET', body, _retried = false } = {}) {
  const accessToken = localStorage.getItem('access')

  const headers = { 'Content-Type': 'application/json' }
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  // Access token expired - try refreshing once, then retry the original request.
  if (response.status === 401 && !_retried) {
    const refreshed = await tryRefreshToken()
    if (refreshed) {
      return request(path, { method, body, _retried: true })
    }
    // refresh failed too - force back to login
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    window.location.href = '/login'
    throw new Error('Session expired. Please log in again.')
  }

  if (!response.ok) {
    let detail
    try {
      const errorBody = await response.json()
      detail = errorBody.detail || JSON.stringify(errorBody)
    } catch {
      detail = response.statusText
    }
    const error = new Error(detail)
    error.status = response.status
    throw error
  }

  if (response.status === 204) return null
  return response.json()
}

async function tryRefreshToken() {
  const refreshToken = localStorage.getItem('refresh')
  if (!refreshToken) return false

  try {
    const response = await fetch(`${API_BASE}/accounts/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    })
    if (!response.ok) return false
    const data = await response.json()
    localStorage.setItem('access', data.access)
    return true
  } catch {
    return false
  }
}

export const apiClient = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
}