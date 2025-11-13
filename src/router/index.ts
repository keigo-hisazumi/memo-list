import { createRouter, createWebHistory } from 'vue-router'
import MemoView from '../views/MemoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'memo',
      component: MemoView,
    },
  ],
})

export default router
