/**
 * Auth API
 * Login, register, logout, forgot password
 */
import { graphqlRequest, setCookie, getCookie, deleteCookie } from './client'

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} - { status, accessToken, refreshToken }
 */
export async function login(email, password) {
  const query = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        status
        ResponseCode
        accessToken
        refreshToken
      }
    }
  `
  
  const data = await graphqlRequest(query, { email, password }, false)
  
  if (data.login.status === 'success') {
    setCookie('authToken', data.login.accessToken)
    setCookie('refreshToken', data.login.refreshToken)
  }
  
  return data.login
}

/**
 * Verify referral code before registration
 * @param {string} referralString
 * @returns {Promise<object>}
 */
export async function verifyReferralCode(referralString) {
  const query = `
    mutation VerifyReferralString($referralString: String!) {
      verifyReferralString(referralString: $referralString) {
        ResponseCode
        status
        affectedRows {
          uid
          username
          slug
          img
        }
      }
    }
  `
  
  const data = await graphqlRequest(query, { referralString }, false)
  return data.verifyReferralString
}

/**
 * Register new user
 * @param {object} userData - { email, username, password, referralCode }
 * @returns {Promise<object>}
 */
export async function register(userData) {
  const { email, username, password, referralCode } = userData
  
  const query = `
    mutation Register($input: RegistrationInput!) {
      register(input: $input) {
        status
        ResponseCode
        userid
      }
    }
  `
  
  const variables = {
    input: {
      email,
      password,
      username,
      pkey: null,
      referralUuid: referralCode,
    }
  }
  
  const data = await graphqlRequest(query, variables, false)
  return data.register
}

/**
 * Request password reset code
 * @param {string} email
 * @returns {Promise<object>}
 */
export async function requestPasswordReset(email) {
  const query = `
    mutation RequestPasswordReset($email: String!) {
      requestPasswordReset(email: $email) {
        status
        ResponseCode
      }
    }
  `
  
  const data = await graphqlRequest(query, { email }, false)
  return data.requestPasswordReset
}

/**
 * Verify reset token/code
 * @param {string} token
 * @returns {Promise<object>}
 */
export async function verifyResetToken(token) {
  const query = `
    mutation ResetPasswordTokenVerify($token: String!) {
      resetPasswordTokenVerify(token: $token) {
        status
        ResponseCode
      }
    }
  `
  
  const data = await graphqlRequest(query, { token }, false)
  return data.resetPasswordTokenVerify
}

/**
 * Reset password with token and new password
 * @param {string} token
 * @param {string} password
 * @returns {Promise<object>}
 */
export async function resetPassword(token, password) {
  const query = `
    mutation ResetPassword($token: String!, $password: String!) {
      resetPassword(token: $token, password: $password) {
        status
        ResponseCode
      }
    }
  `
  
  const data = await graphqlRequest(query, { token, password }, false)
  return data.resetPassword
}

/**
 * Refresh access token
 * @returns {Promise<string|null>} - New access token or null
 */
export async function refreshToken() {
  const currentRefreshToken = getCookie('refreshToken')
  if (!currentRefreshToken) return null
  
  const query = `
    mutation RefreshToken($refreshToken: String!) {
      refreshToken(refreshToken: $refreshToken) {
        status
        ResponseCode
        accessToken
        refreshToken
      }
    }
  `
  
  try {
    const data = await graphqlRequest(query, { refreshToken: currentRefreshToken }, false)
    
    if (data.refreshToken.status === 'success') {
      setCookie('authToken', data.refreshToken.accessToken)
      setCookie('refreshToken', data.refreshToken.refreshToken)
      return data.refreshToken.accessToken
    }
  } catch (error) {
    console.error('Token refresh failed:', error)
  }
  
  return null
}


export function logout() {
  deleteCookie('authToken')
  deleteCookie('refreshToken')
  deleteCookie('rememberMe')
  deleteCookie('userEmail')
  deleteCookie('userPassword')
}

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export function isLoggedIn() {
  return !!getCookie('authToken')
}