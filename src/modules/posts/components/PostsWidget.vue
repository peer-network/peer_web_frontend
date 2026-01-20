<script setup lang="ts">
/**
 * PostsWidget.vue
 * Posts listing and creation
 */
import { ref } from 'vue'
import { usePostsStore } from '../stores/postsStore'

const postsStore = usePostsStore()
</script>

<template>
  <div class="vue-posts-widget">
    <div v-if="postsStore.isLoading">Loading posts...</div>
    <div v-else>
      <div v-for="post in postsStore.posts" :key="post.id" class="post-item">
        {{ post.description }}
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
/* Uses existing CSS */
</style>
