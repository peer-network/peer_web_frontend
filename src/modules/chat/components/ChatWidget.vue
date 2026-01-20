<script setup lang="ts">
/**
 * ChatWidget.vue
 * Chat interface component
 */
import { ref /*onMounted*/ } from 'vue'
import { useChatStore } from '../stores/chatStore'

const chatStore = useChatStore()
const message = ref('')

function sendMessage() {
  if (message.value.trim()) {
    chatStore.sendMessage(message.value)
    message.value = ''
  }
}
</script>

<template>
  <div class="vue-chat-widget">
    <div v-if="chatStore.isLoading">Loading chat...</div>
    <div v-else>
      <div class="messages">
        <div v-for="msg in chatStore.messages" :key="msg.id">
          {{ msg.content }}
        </div>
      </div>
      <div class="input-area">
        <input v-model="message" @keyup.enter="sendMessage" placeholder="Type a message..." />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Uses existing CSS */
</style>
