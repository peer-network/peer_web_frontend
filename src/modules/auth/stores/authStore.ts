/**
 * Auth Store (Pinia)
 * Handles login, logout, token management
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    // State
    const accessToken = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Getters
    const isAuthenticated = computed(() => !!accessToken.value)

    // Initialize from cookies
    function initializeFromCookies(): void {
        accessToken.value = getCookie('authToken')
        refreshToken.value = getCookie('refreshToken')
    }

    // Login
    async function login(email: string, password: string, rememberMe = false): Promise<boolean> {
        isLoading.value = true
        error.value = null

        try {
            const endpoint = getGraphQLEndpoint()
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
            mutation Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                status
                ResponseCode
                accessToken
                refreshToken
              }
            }
          `,
                    variables: { email, password },
                }),
            })

            const result = await response.json()

            if (result.data?.login?.status === 'success' && result.data.login.ResponseCode === '10801') {
                accessToken.value = result.data.login.accessToken
                refreshToken.value = result.data.login.refreshToken

                const days = rememberMe ? 7 : 0
                setCookie('authToken', result.data.login.accessToken, days)
                setCookie('refreshToken', result.data.login.refreshToken, rememberMe ? 3650 : 0)
                setCookie('userEmail', email, rememberMe ? 3650 : 0)

                if (rememberMe) {
                    setCookie('rememberMe', 'true', 3650)
                    localStorage.setItem('rememberMe', 'true')
                }

                return true
            } else {
                error.value = result.data?.login?.ResponseCode || 'Login failed'
                return false
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Network error'
            return false
        } finally {
            isLoading.value = false
        }
    }

    // Logout
    function logout(): void {
        accessToken.value = null
        refreshToken.value = null
        eraseCookie('authToken')
        eraseCookie('refreshToken')
        eraseCookie('rememberMe')
        localStorage.removeItem('rememberMe')
    }

    return {
        accessToken, refreshToken, isLoading, error,
        isAuthenticated,
        initializeFromCookies, login, logout,
    }
})

// Cookie utilities
function getGraphQLEndpoint(): string {
    const configEl = document.getElementById('config')
    const host = configEl?.dataset.host || window.location.origin
    return `${host}/graphql`
}

function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name: string, value: string, days?: number): void {
    let cookie = `${name}=${encodeURIComponent(value)}; path=/; Secure; SameSite=Strict`
    if (days) cookie += `; Max-Age=${days * 86400}`
    document.cookie = cookie
}

function eraseCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}
