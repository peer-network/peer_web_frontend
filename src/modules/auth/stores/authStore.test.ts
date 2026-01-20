/**
 * Auth Store Tests
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../stores/authStore'

describe('Auth Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        // Clear cookies
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    })

    it('should initialize with null tokens', () => {
        const store = useAuthStore()
        expect(store.accessToken).toBeNull()
        expect(store.refreshToken).toBeNull()
        expect(store.isAuthenticated).toBe(false)
    })

    it('should set isLoading during login', async () => {
        const store = useAuthStore()

        // Mock fetch
        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    data: { login: { status: 'failed', ResponseCode: '30801' } }
                })
            })
        ) as any

        const loginPromise = store.login('test@example.com', 'password', false)
        expect(store.isLoading).toBe(true)

        await loginPromise
        expect(store.isLoading).toBe(false)
    })

    it('should handle login failure', async () => {
        const store = useAuthStore()

        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    data: { login: { status: 'failed', ResponseCode: '30801' } }
                })
            })
        ) as any

        const result = await store.login('test@example.com', 'wrong', false)

        expect(result).toBe(false)
        expect(store.error).toBe('30801')
        expect(store.isAuthenticated).toBe(false)
    })

    it('should clear tokens on logout', () => {
        const store = useAuthStore()
        store.accessToken = 'test-token'
        store.refreshToken = 'test-refresh'

        store.logout()

        expect(store.accessToken).toBeNull()
        expect(store.refreshToken).toBeNull()
        expect(store.isAuthenticated).toBe(false)
    })
})
