<template>
  <div class="memo-list-view">
    <div class="list-header-bar">
      <span class="app-title">メモ帳</span>
      <HamburgerMenu @logout="handleLogout" />
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
import HamburgerMenu from '@/components/HamburgerMenu.vue'

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
  max-width: 600px;
  margin: 0 auto;
}

.list-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem 0.5rem 1.5rem;
  background: var(--app-header-bg);
  border-bottom: 1px solid var(--app-header-border);
  transition: background 0.3s, border-color 0.3s;
}

.app-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--app-accent);
  letter-spacing: 0.02em;
}
</style>
