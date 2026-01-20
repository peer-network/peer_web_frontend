/**
 * Posts Module Entry Point
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PostsWidget from './components/PostsWidget.vue'

const pinia = createPinia()

export function initPostsModule(): void {
    console.log('[Vue Posts] Initializing...')

    const mount = document.getElementById('vue-posts')
    if (mount) {
        const app = createApp(PostsWidget)
        app.use(pinia)
        app.mount(mount)
        console.log('[Vue Posts] Mounted')
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPostsModule)
} else {
    initPostsModule()
}

; (window as any).VuePosts = { init: initPostsModule }
