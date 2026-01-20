/**
 * Profile Module Entry Point
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ProfileWidget from './components/ProfileWidget.vue'

const pinia = createPinia()

export function initProfileModule(): void {
    console.log('[Vue Profile] Initializing...')

    const mount = document.getElementById('vue-profile')
    if (mount) {
        const app = createApp(ProfileWidget)
        app.use(pinia)
        app.mount(mount)
        console.log('[Vue Profile] Mounted')
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileModule)
} else {
    initProfileModule()
}

; (window as any).VueProfile = { init: initProfileModule }
