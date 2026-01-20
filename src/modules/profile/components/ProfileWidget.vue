<script setup lang="ts">
/**
 * ProfileWidget.vue
 * User profile display and edit
 */
import { ref } from 'vue'
import { useProfileStore } from '../stores/profileStore'

const profileStore = useProfileStore()
</script>

<template>
  <div class="vue-profile-widget">
    <div v-if="profileStore.isLoading">Loading profile...</div>
    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
/* Uses existing CSS */
</style>
