/**
 * Wallet Module Entry Point
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import WalletWidget from './components/WalletWidget.vue'

const pinia = createPinia()

export function initWalletModule(): void {
    console.log('[Vue Wallet] Initializing...')

    const mount = document.getElementById('vue-wallet')
    if (mount) {
        const app = createApp(WalletWidget)
        app.use(pinia)
        app.mount(mount)
        console.log('[Vue Wallet] Mounted')
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWalletModule)
} else {
    initWalletModule()
}

; (window as any).VueWallet = { init: initWalletModule }
