/**
 * Auth Store
 * Manages authentication state
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '@api/auth.api'
import { setCookie } from '@api/client'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isLoggedIn = computed(() => authApi.isLoggedIn())
  const currentUser = computed(() => user.value)

  async function loginUser(email, password, rememberMe = false) {
    loading.value = true
    error.value = null
    
    try {
      const result = await authApi.login(email, password)
      
      if (result.status === 'success') {
        if (rememberMe) {
          setCookie('rememberMe', 'true', 3650)
          setCookie('userEmail', email, 3650)
        }
        return { success: true }
      } else {
        error.value = result.ResponseCode
        return { success: false, code: result.ResponseCode }
      }
    } catch (err) {
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  async function registerUser(userData) {
    loading.value = true
    error.value = null
    
    try {
      const result = await authApi.register(userData)
      
      if (result.status === 'success') {
        return { success: true, userid: result.userid }
      } else {
        error.value = result.ResponseCode
        return { success: false, code: result.ResponseCode }
      }
    } catch (err) {
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  async function verifyReferral(referralString) {
    loading.value = true
    error.value = null
    
    try {
      const result = await authApi.verifyReferralCode(referralString)
      
      if (result.status === 'success') {
        return { success: true, referrer: result.affectedRows }
      } else {
        error.value = result.ResponseCode
        return { success: false, code: result.ResponseCode }
      }
    } catch (err) {
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  function logoutUser() {
    authApi.logout()
    user.value = null
  }

  return {
    // State
    user,
    loading,
    error,
    // Getters
    isLoggedIn,
    currentUser,

    loginUser,
    registerUser,
    verifyReferral,
    logoutUser,
  }
})