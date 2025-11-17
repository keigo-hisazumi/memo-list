import { createRouter, createWebHistory } from 'vue-router'
import MemoListView from '../views/MemoListView.vue'
import MemoEditorView from '../views/MemoEditorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'memo-list',
      component: MemoListView,
    },
    {
      path: '/memo/:id',
      name: 'memo-edit',
      component: MemoEditorView,
    },
  ],
})

export default router
