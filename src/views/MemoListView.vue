<template>
  <div class="memo-list-view">
    <div class="list-header-bar">
      <span class="user-email">{{ authStore.currentUser?.email }}</span>
      <button @click="handleLogout" class="btn-logout">ログアウト</button>
    </div>
    <MemoList
      :memos="memoStore.sortedMemos"
      :selected-id="null"
      @select="handleSelectMemo"
      @create="handleCreateMemo"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMemoStore } from '@/stores/memo'
import { useAuthStore } from '@/stores/auth'
import MemoList from '@/components/MemoList.vue'

const router = useRouter()
const memoStore = useMemoStore()
const authStore = useAuthStore()

function handleSelectMemo(id: string) {
  router.push({ name: 'memo-edit', params: { id } })
}

async function handleCreateMemo() {
  if (!authStore.currentUser) return
  const newMemo = await memoStore.createMemo(authStore.currentUser.uid, {
    title: '',
    content: ''
  })
  router.push({ name: 'memo-edit', params: { id: newMemo.id } })
}

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.memo-list-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.list-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1.5rem;
  background: #f0fdf7;
  border-bottom: 1px solid #d1fae5;
}

.user-email {
  font-size: 0.8rem;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-logout {
  padding: 0.35rem 0.85rem;
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-logout:hover {
  border-color: #e53935;
  color: #e53935;
}
</style>
