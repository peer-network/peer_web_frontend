/**
 * Auth Module Entry Point
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/authStore'
import LoginForm from './components/LoginForm.vue'

const pinia = createPinia()

export function initAuthModule(): void {
    console.log('[Vue Auth] Initializing...')

    // Mount LoginForm if element exists
    const loginMount = document.getElementById('vue-login-form')
    if (loginMount) {
        const app = createApp(LoginForm)
        app.use(pinia)
        app.mount(loginMount)
        console.log('[Vue Auth] LoginForm mounted')
    }

    // Initialize auth state from cookies
    const authStore = useAuthStore(pinia)
    authStore.initializeFromCookies()
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthModule)
} else {
    initAuthModule()
}

// Expose for manual init
; (window as any).VueAuth = { init: initAuthModule }
