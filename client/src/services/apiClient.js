// client/src/services/apiClient.js
//
// Central fetch wrapper for the Django backend. Handles the session +
// CSRF cookie pattern the backend actually uses (SessionAuthentication,
// not a bearer token) - see FRONTEND_INTEGRATION_GUIDE.md for why.

const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000/api'

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  // CSRF header only needed for mutating requests
  if (method !== 'GET' && method !== 'HEAD') {
    const csrfToken = getCookie('csrftoken')
    if (csrfToken) headers['X-CSRFToken'] = csrfToken
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include', // sends the session cookie
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

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

  // some endpoints (e.g. 200 "nothing to assess") still return JSON with no real content
  if (response.status === 204) return null
  return response.json()
}

export const apiClient = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
}