<template>
  <div class="memo-app">
    <div class="memo-sidebar">
      <div class="sidebar-header">
        <span class="app-title">メモ帳</span>
        <HamburgerMenu @logout="handleLogout" />
      </div>
      <MemoList
        :memos="memoStore.sortedMemos"
        :selected-id="memoStore.selectedMemoId"
        @select="handleSelectMemo"
        @create="handleCreateMemo"
      />
    </div>
    <div class="memo-main">
      <MemoEditor
        :memo="memoStore.selectedMemo"
        @update="handleUpdateMemo"
        @delete="handleDeleteMemo"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMemoStore } from '@/stores/memo'
import { useAuthStore } from '@/stores/auth'
import MemoList from '@/components/MemoList.vue'
import MemoEditor from '@/components/MemoEditor.vue'
import HamburgerMenu from '@/components/HamburgerMenu.vue'

const router = useRouter()
const memoStore = useMemoStore()
const authStore = useAuthStore()

onMounted(() => {
  if (authStore.currentUser) {
    memoStore.subscribeToMemos(authStore.currentUser.uid)
  }
})

onUnmounted(() => {
  memoStore.unsubscribeFromMemos()
})

function handleSelectMemo(id: string) {
  memoStore.selectMemo(id)
}

async function handleCreateMemo() {
  if (!authStore.currentUser) return
  const newMemo = await memoStore.createMemo(authStore.currentUser.uid, {
    title: '',
    content: ''
  })
  memoStore.selectMemo(newMemo.id)
}

async function handleUpdateMemo(id: string, data: { title?: string; content?: string; category?: string }) {
  if (!authStore.currentUser) return
  await memoStore.updateMemo(authStore.currentUser.uid, id, data)
}

async function handleDeleteMemo(id: string) {
  if (!authStore.currentUser) return
  await memoStore.deleteMemo(authStore.currentUser.uid, id)
}

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.memo-app {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.memo-sidebar {
  width: 350px;
  border-right: 1px solid var(--app-border);
  display: flex;
  flex-direction: column;
  transition: border-color 0.3s;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem 0.5rem 1.5rem;
  background: var(--app-header-bg);
  border-bottom: 1px solid var(--app-header-border);
  transition: background 0.3s, border-color 0.3s;
  flex-shrink: 0;
}

.app-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--app-accent);
  letter-spacing: 0.02em;
}

.memo-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media (max-width: 768px) {
  .memo-app {
    flex-direction: column;
  }

  .memo-sidebar {
    width: 100%;
    height: 50vh;
    border-right: none;
    border-bottom: 1px solid var(--app-border);
  }

  .memo-main {
    height: 50vh;
  }
}
</style>
