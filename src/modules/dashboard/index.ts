/**
 * Dashboard Module Entry Point
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import DashboardWidget from './components/DashboardWidget.vue'

const pinia = createPinia()

export function initDashboardModule(): void {
    console.log('[Vue Dashboard] Initializing...')

    const mount = document.getElementById('vue-dashboard')
    if (mount) {
        const app = createApp(DashboardWidget)
        app.use(pinia)
        app.mount(mount)
        console.log('[Vue Dashboard] Mounted')
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboardModule)
} else {
    initDashboardModule()
}

; (window as any).VueDashboard = { init: initDashboardModule }
