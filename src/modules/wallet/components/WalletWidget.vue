<script setup lang="ts">
/**
 * WalletWidget.vue
 * Wallet balance, transactions, token display
 */
import { ref, onMounted } from 'vue'
import { useWalletStore } from '../stores/walletStore'

const walletStore = useWalletStore()

onMounted(() => {
  walletStore.initializeFromPage()
})
</script>

<template>
  <div class="vue-wallet-widget">
    <div v-if="walletStore.isLoading">Loading wallet...</div>
    <div v-else>
      <div class="balance">
        {{ walletStore.balance }} Tokens
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
/* Uses existing CSS */
</style>
