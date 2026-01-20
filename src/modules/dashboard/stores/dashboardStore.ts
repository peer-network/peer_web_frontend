/**
 * Dashboard Store (Pinia)
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {
    const posts = ref<any[]>([])
    const isLoading = ref(false)
    const filters = ref({
        title: '',
        user: '',
        tag: '',
    })

    async function loadPosts() {
        isLoading.value = true
        // Will integrate with existing load_posts.js logic
        isLoading.value = false
    }

    function setFilter(key: string, value: string) {
        filters.value[key as keyof typeof filters.value] = value
    }

    return { posts, isLoading, filters, loadPosts, setFilter }
})
