/**
 * Posts Store (Pinia)
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Post {
    id: string
    description: string
    type: 'image' | 'video' | 'audio' | 'text'
    media: string[]
    createdAt: Date
    userId: string
}

export const usePostsStore = defineStore('posts', () => {
    const posts = ref<Post[]>([])
    const currentPost = ref<Post | null>(null)
    const isLoading = ref(false)
    const isCreating = ref(false)

    async function loadPosts(filters?: any) {
        isLoading.value = true
        // Will integrate with existing load_posts.js logic
        isLoading.value = false
    }

    async function createPost(data: Partial<Post>) {
        isCreating.value = true
        // Will integrate with existing add_post.js logic
        isCreating.value = false
    }

    async function likePost(postId: string) {
        // Placeholder
    }

    async function commentOnPost(postId: string, comment: string) {
        // Placeholder
    }

    return {
        posts, currentPost, isLoading, isCreating,
        loadPosts, createPost, likePost, commentOnPost
    }
})
