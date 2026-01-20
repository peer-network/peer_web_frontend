/**
 * Chat Module Entry Point
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ChatWidget from './components/ChatWidget.vue'

const pinia = createPinia()

export function initChatModule(): void {
    console.log('[Vue Chat] Initializing...')

    const mount = document.getElementById('vue-chat')
    if (mount) {
        const app = createApp(ChatWidget)
        app.use(pinia)
        app.mount(mount)
        console.log('[Vue Chat] Mounted')
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatModule)
} else {
    initChatModule()
}

; (window as any).VueChat = { init: initChatModule }
