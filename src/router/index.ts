import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import MemoView from '../views/MemoView.vue'
import LoginView from '../views/LoginView.vue'
import TrashView from '../views/TrashView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'memo-list',
      component: MemoView,
      meta: { requiresAuth: true }
    },
    {
      path: '/memo/:id',
      name: 'memo-edit',
      component: MemoView,
      meta: { requiresAuth: true }
    },
    {
      path: '/trash',
      name: 'trash',
      component: TrashView,
      meta: { requiresAuth: true }
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.currentUser) {
    return { name: 'login' }
  }
  if (to.meta.requiresGuest && authStore.currentUser) {
    return { name: 'memo-list' }
  }
})

export default router
