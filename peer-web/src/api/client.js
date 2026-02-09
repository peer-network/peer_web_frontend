/**
 * GraphQL Client
 * Handles all API communication with the backend
 */

// Get API URL from environment or fallback
const API_URL = import.meta.env.VITE_API_URL || '/graphql'

/**
 * Get auth token from cookies
 */
function getAuthToken() {
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'authToken') {
      return value
    }
  }
  return null
}

/**
 * Execute a GraphQL query/mutation
 * @param {string} query
 * @param {object} variables
 * @param {boolean} requiresAuth
 * @returns {Promise<object>}
 */
export async function graphqlRequest(query, variables = {}, requiresAuth = true) {
  const headers = {
    'Content-Type': 'application/json',
  }

  if (requiresAuth) {
    const token = getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  })

  const result = await response.json()

  if (result.errors) {
    throw new Error(result.errors[0].message)
  }

  return result.data
}

/**
 * Cookie helpers
 */
export function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/`
}

export function getCookie(name) {
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=')
    if (cookieName === name) {
      return cookieValue
    }
  }
  return null
}

export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
}