/**
 * Chat Store (Pinia)
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ChatMessage {
    id: string
    content: string
    senderId: string
    timestamp: Date
}

export const useChatStore = defineStore('chat', () => {
    const messages = ref<ChatMessage[]>([])
    const conversations = ref<any[]>([])
    const activeConversation = ref<string | null>(null)
    const isLoading = ref(false)

    async function loadConversations() {
        isLoading.value = true
        // Will integrate with existing chat/*.js logic
        isLoading.value = false
    }

    async function loadMessages(conversationId: string) {
        activeConversation.value = conversationId
        // Load messages for conversation
    }

    async function sendMessage(content: string) {
        // Placeholder for send functionality
    }

    return {
        messages, conversations, activeConversation, isLoading,
        loadConversations, loadMessages, sendMessage
    }
})
