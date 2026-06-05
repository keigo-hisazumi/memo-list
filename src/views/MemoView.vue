<template>
  <div class="memo-app">
    <!-- サイドバー（リスト） -->
    <div class="memo-sidebar" :class="{ 'mobile-hidden': isMobile && showEditor }">
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
        :selected-id="memoStore.selectedMemoId"
        @select="handleSelectMemo"
      />
    </div>

    <!-- メインエリア（エディター） -->
    <div class="memo-main" :class="{ 'mobile-hidden': isMobile && !showEditor }">
      <div class="editor-nav">
        <button v-if="isMobile" @click="handleBack" class="btn-back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          <span>すべてのノート</span>
        </button>
        <div v-else class="nav-spacer"></div>

        <div class="nav-actions">
          <div class="nav-icon-wrap">
            <button class="nav-icon-btn" title="情報" @click.stop="toggleInfo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="8" stroke-width="3" stroke-linecap="round"/>
                <line x1="12" y1="12" x2="12" y2="16"/>
              </svg>
            </button>
            <div v-if="showInfo && memoStore.selectedMemo" class="info-popup">
              <p class="info-label">更新日時</p>
              <p class="info-value">{{ formatDate(memoStore.selectedMemo.updatedAt) }}</p>
              <p class="info-label info-label-mt">作成日時</p>
              <p class="info-value">{{ formatDate(memoStore.selectedMemo.createdAt) }}</p>
            </div>
          </div>

          <div class="nav-icon-wrap">
            <button class="nav-icon-btn" title="その他" @click.stop="toggleMenu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="7.5" cy="12" r="1.1" fill="currentColor" stroke="none"/>
                <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/>
                <circle cx="16.5" cy="12" r="1.1" fill="currentColor" stroke="none"/>
              </svg>
            </button>
            <div v-if="showMenu" class="action-menu" @click.stop>
              <button class="action-menu-item action-menu-delete" @click="handleDeleteFromMenu">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                削除
              </button>
            </div>
          </div>

          <button class="nav-icon-btn" title="新規メモ" @click="handleCreateMemo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>
      </div>

      <MemoEditor
        :memo="memoStore.selectedMemo"
        @update="handleUpdateMemo"
        @delete="handleDeleteMemo"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMemoStore } from '@/stores/memo'
import { useAuthStore } from '@/stores/auth'
import MemoList from '@/components/MemoList.vue'
import MemoEditor from '@/components/MemoEditor.vue'
import HamburgerMenu from '@/components/HamburgerMenu.vue'

const router = useRouter()
const route = useRoute()
const memoStore = useMemoStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const showMenu = ref(false)
const showInfo = ref(false)
const windowWidth = ref(window.innerWidth)

const isMobile = computed(() => windowWidth.value < 768)
const showEditor = computed(() => !!route.params.id)

const filteredMemos = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return memoStore.sortedMemos
  return memoStore.sortedMemos.filter(m =>
    m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q)
  )
})

function onResize() {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  document.addEventListener('click', closeAll)
  if (route.params.id) {
    memoStore.selectMemo(route.params.id as string)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  document.removeEventListener('click', closeAll)
})

watch(() => route.params.id, (newId) => {
  memoStore.selectMemo(newId ? (newId as string) : null)
})

function closeAll() {
  showMenu.value = false
  showInfo.value = false
}

function toggleMenu() {
  showMenu.value = !showMenu.value
  showInfo.value = false
}

function toggleInfo() {
  showInfo.value = !showInfo.value
  showMenu.value = false
}

function handleBack() {
  router.push({ name: 'memo-list' })
}

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

function handleDeleteFromMenu() {
  showMenu.value = false
  if (memoStore.selectedMemo) {
    handleDeleteMemo(memoStore.selectedMemo.id)
  }
}

function formatDate(date: Date): string {
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function handleUpdateMemo(id: string, data: { title?: string; content?: string; category?: string }) {
  if (!authStore.currentUser) return
  await memoStore.updateMemo(authStore.currentUser.uid, id, data)
}

async function handleDeleteMemo(id: string) {
  if (!authStore.currentUser) return
  if (confirm('このメモを削除してもよろしいですか？')) {
    await memoStore.deleteMemo(authStore.currentUser.uid, id)
    router.push({ name: 'memo-list' })
  }
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
  background: var(--app-bg);
}

/* サイドバー */
.memo-sidebar {
  width: 320px;
  flex-shrink: 0;
  border-right: 1px solid var(--app-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: border-color 0.3s;
}

.list-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--app-header-bg);
  border-bottom: 1px solid var(--app-header-border);
  flex-shrink: 0;
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
  flex-shrink: 0;
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

/* メインエリア */
.memo-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.editor-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.75rem;
  background: var(--app-bg);
  border-bottom: 1px solid var(--app-border);
  transition: background 0.3s, border-color 0.3s;
  flex-shrink: 0;
}

.nav-spacer {
  flex: 1;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  padding: 0.4rem 0.5rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  color: var(--app-accent);
  transition: opacity 0.15s;
}

.btn-back:hover {
  opacity: 0.7;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.1rem;
}

.nav-icon-wrap {
  position: relative;
}

.nav-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--app-accent);
  transition: opacity 0.15s;
}

.nav-icon-btn:hover {
  opacity: 0.7;
}

.info-popup {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--app-menu-bg);
  border: 1px solid var(--app-border);
  border-radius: 10px;
  box-shadow: 0 4px 16px var(--app-shadow);
  z-index: 100;
  min-width: 200px;
  padding: 0.75rem 1rem;
}

.info-label {
  font-size: 0.7rem;
  color: var(--app-text-muted);
  margin-bottom: 0.15rem;
}

.info-label-mt {
  margin-top: 0.6rem;
}

.info-value {
  font-size: 0.875rem;
  color: var(--app-text);
}

.action-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--app-menu-bg);
  border: 1px solid var(--app-border);
  border-radius: 10px;
  box-shadow: 0 4px 16px var(--app-shadow);
  z-index: 100;
  min-width: 140px;
  overflow: hidden;
}

.action-menu-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  font-size: 0.95rem;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background 0.15s;
}

.action-menu-item:hover {
  background: var(--app-menu-hover);
}

.action-menu-delete {
  color: var(--app-delete-hover-text);
}

/* モバイル対応 */
@media (max-width: 767px) {
  .memo-sidebar,
  .memo-main {
    position: absolute;
    inset: 0;
    width: 100%;
  }

  .mobile-hidden {
    display: none;
  }

  .list-header-bar {
    position: relative;
  }

  .app-title {
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
