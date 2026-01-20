/**
 * Profile Store (Pinia)
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserProfile {
    id: string
    username: string
    email: string
    avatar: string
    visibilityStatus: string
}

export const useProfileStore = defineStore('profile', () => {
    const profile = ref<UserProfile | null>(null)
    const isLoading = ref(false)
    const isEditing = ref(false)

    async function loadProfile(userId?: string) {
        isLoading.value = true
        // Will integrate with existing profile.js logic
        isLoading.value = false
    }

    async function updateProfile(data: Partial<UserProfile>) {
        // Placeholder for update functionality
    }

    return { profile, isLoading, isEditing, loadProfile, updateProfile }
})
