import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@pages/auth/LoginPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router