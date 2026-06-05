<template>
  <div class="memo-editor-view">
    <div class="editor-nav">
      <button @click="handleBack" class="btn-back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        <span>すべてのノート</span>
      </button>

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

        <button class="nav-icon-btn nav-icon-compose" title="新規メモ" @click="handleNew">
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
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMemoStore } from '@/stores/memo'
import { useAuthStore } from '@/stores/auth'
import MemoEditor from '@/components/MemoEditor.vue'

const router = useRouter()
const route = useRoute()
const memoStore = useMemoStore()
const authStore = useAuthStore()

const showMenu = ref(false)
const showInfo = ref(false)

onMounted(() => {
  memoStore.selectMemo(route.params.id as string)
  document.addEventListener('click', closeAll)
})

onUnmounted(() => {
  document.removeEventListener('click', closeAll)
})

watch(() => route.params.id, (newId) => {
  if (newId) memoStore.selectMemo(newId as string)
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

function handleNew() {
  router.push({ name: 'memo-list' })
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
  if (confirm(`このメモを削除してもよろしいですか？`)) {
    await memoStore.deleteMemo(authStore.currentUser.uid, id)
    router.push({ name: 'memo-list' })
  }
}
</script>

<style scoped>
.memo-editor-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--app-bg);
  transition: background 0.3s;
  max-width: 600px;
  margin: 0 auto;
}

.editor-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--app-bg);
  border-bottom: 1px solid var(--app-border);
  transition: background 0.3s, border-color 0.3s;
  flex-shrink: 0;
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

/* info popup */
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

/* more menu */
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
</style>
