<script setup lang="ts">
/**
 * DashboardWidget.vue
 * Main dashboard component - will show posts, filters, etc.
 */
import { ref, onMounted } from 'vue'

const isLoading = ref(true)
const postsCount = ref(0)

onMounted(() => {
  // Placeholder - will integrate with existing dashboard.js logic
  isLoading.value = false
})
</script>

<template>
  <div class="vue-dashboard-widget">
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <!-- Dashboard content will go here -->
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
/* Uses existing CSS from the page */
</style>
