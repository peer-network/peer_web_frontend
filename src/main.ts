/**
 * Main Entry Point for Vue.js
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'

window.VueApps = window.VueApps || {}

export const pinia = createPinia()

export function mountVueComponent(component: any, elementId: string, appName: string): void {
    const element = document.getElementById(elementId)
    if (!element) {
        console.warn(`[Vue] Mount point #${elementId} not found`)
        return
    }

    const app = createApp(component)
    app.use(pinia)
    app.mount(element)
    window.VueApps[appName] = app
    console.log(`[Vue] Mounted ${appName} to #${elementId}`)
}

console.log('[Vue] Main entry point loaded')
