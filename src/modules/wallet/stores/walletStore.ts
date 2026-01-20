/**
 * Wallet Store (Pinia)
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWalletStore = defineStore('wallet', () => {
    const balance = ref<number>(0)
    const transactions = ref<any[]>([])
    const isLoading = ref(false)

    const formattedBalance = computed(() => balance.value.toFixed(2))

    function initializeFromPage() {
        // Read balance from existing global variable if available
        const globalBalance = (window as any).balance
        if (globalBalance !== undefined) {
            balance.value = globalBalance
        }
    }

    async function loadTransactions() {
        isLoading.value = true
        // Will integrate with existing wallet.js logic
        isLoading.value = false
    }

    async function sendTokens(to: string, amount: number) {
        // Placeholder for send functionality
    }

    return {
        balance, transactions, isLoading, formattedBalance,
        initializeFromPage, loadTransactions, sendTokens
    }
})
