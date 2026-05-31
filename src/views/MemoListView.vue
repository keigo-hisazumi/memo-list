<template>
  <div class="memo-list-view">
    <div class="list-header-bar">
      <HamburgerMenu @logout="handleLogout" />
      <span class="app-title">すべてのノート</span>
      <button class="compose-btn" @click="handleCreateMemo" aria-label="新規作成">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      </button>
    </div>

    <div class="search-bar-wrap">
      <div class="search-bar">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="searchQuery"
          type="search"
          class="search-input"
          placeholder="メモまたはタグを検索"
        />
      </div>
    </div>

    <MemoList
      :memos="filteredMemos"
      :selected-id="null"
      @select="handleSelectMemo"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMemoStore } from '@/stores/memo'
import { useAuthStore } from '@/stores/auth'
import MemoList from '@/components/MemoList.vue'
import HamburgerMenu from '@/components/HamburgerMenu.vue'

const router = useRouter()
const memoStore = useMemoStore()
const authStore = useAuthStore()

const searchQuery = ref('')

const filteredMemos = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return memoStore.sortedMemos
  return memoStore.sortedMemos.filter(m =>
    m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q)
  )
})

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
  min-height: 100vh;
  max-width: 600px;
  margin: 0 auto;
  background: var(--app-bg);
  transition: background 0.3s;
}

.list-header-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--app-header-bg);
  border-bottom: 1px solid var(--app-header-border);
  transition: background 0.3s, border-color 0.3s;
  box-shadow: 0 1px 4px var(--app-shadow);
}

.app-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--app-text);
  letter-spacing: 0.01em;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.compose-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--app-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  padding: 0;
  transition: background 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.compose-btn:hover {
  background: var(--app-menu-hover);
}

.search-bar-wrap {
  padding: 0.6rem 0.75rem;
  background: var(--app-bg);
  border-bottom: 1px solid var(--app-border);
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--app-bg-soft);
  border-radius: 10px;
  padding: 0.45rem 0.75rem;
}

.search-icon {
  color: var(--app-text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  color: var(--app-text);
  outline: none;
  font-family: inherit;
}

.search-input::placeholder {
  color: var(--app-text-muted);
}

.search-input::-webkit-search-cancel-button {
  -webkit-appearance: none;
}
</style>
