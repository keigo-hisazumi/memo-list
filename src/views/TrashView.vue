<template>
  <div class="trash-app">
    <div class="trash-sidebar">
      <div class="list-header-bar">
        <HamburgerMenu @logout="handleLogout" />
        <span class="app-title">ゴミ箱</span>
        <div style="width: 36px;"></div>
      </div>

      <div class="trash-actions-bar">
        <span class="trash-count">{{ memoStore.sortedTrashMemos.length }} 件</span>
        <button
          v-if="memoStore.sortedTrashMemos.length > 0"
          class="btn-empty-trash"
          @click="handleEmptyTrash"
        >
          ゴミ箱を空にする
        </button>
      </div>

      <div class="trash-list">
        <div v-if="memoStore.sortedTrashMemos.length === 0" class="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" class="empty-icon">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          <p>ゴミ箱は空です</p>
        </div>

        <div
          v-for="memo in memoStore.sortedTrashMemos"
          :key="memo.id"
          class="trash-item"
        >
          <div class="trash-item-body">
            <p class="trash-item-title">{{ memo.title || '無題のメモ' }}</p>
            <p class="trash-item-preview">{{ memo.content.slice(0, 80) || '内容なし' }}</p>
            <p class="trash-item-date">削除日時: {{ formatDate(memo.deletedAt!) }}</p>
          </div>
          <div class="trash-item-actions">
            <button class="btn-restore" @click="handleRestore(memo.id)" title="復元">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 4v6h6"/>
                <path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
              </svg>
              復元
            </button>
            <button class="btn-delete-permanent" @click="handlePermanentDelete(memo.id)" title="完全削除">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMemoStore } from '@/stores/memo'
import { useAuthStore } from '@/stores/auth'
import HamburgerMenu from '@/components/HamburgerMenu.vue'

const router = useRouter()
const memoStore = useMemoStore()
const authStore = useAuthStore()

function formatDate(date: Date): string {
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function handleRestore(id: string) {
  if (!authStore.currentUser) return
  await memoStore.restoreMemo(authStore.currentUser.uid, id)
}

async function handlePermanentDelete(id: string) {
  if (!authStore.currentUser) return
  if (confirm('このメモを完全に削除しますか？この操作は元に戻せません。')) {
    await memoStore.permanentlyDeleteMemo(authStore.currentUser.uid, id)
  }
}

async function handleEmptyTrash() {
  if (!authStore.currentUser) return
  if (confirm('ゴミ箱を空にしますか？すべてのメモが完全に削除されます。')) {
    await memoStore.emptyTrash(authStore.currentUser.uid)
  }
}

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.trash-app {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--app-bg);
}

.trash-sidebar {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.list-header-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--app-header-bg);
  border-bottom: 1px solid var(--app-header-border);
  flex-shrink: 0;
  box-shadow: 0 1px 4px var(--app-shadow);
}

.app-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--app-text);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.trash-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.75rem;
  background: var(--app-bg);
  border-bottom: 1px solid var(--app-border);
  flex-shrink: 0;
}

.trash-count {
  font-size: 0.85rem;
  color: var(--app-text-muted);
}

.btn-empty-trash {
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--app-delete-hover-text);
  border-radius: 6px;
  background: transparent;
  color: var(--app-delete-hover-text);
  font-size: 0.85rem;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;
}

.btn-empty-trash:hover {
  background: var(--app-delete-hover-bg);
}

.trash-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  color: var(--app-text-muted);
  font-size: 0.9rem;
}

.empty-icon {
  color: var(--app-text-muted);
  opacity: 0.5;
}

.trash-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--app-border);
  transition: background 0.15s;
}

.trash-item:hover {
  background: var(--app-bg-soft);
}

.trash-item-body {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.trash-item-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--app-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.2rem;
}

.trash-item-preview {
  font-size: 0.8rem;
  color: var(--app-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.2rem;
}

.trash-item-date {
  font-size: 0.75rem;
  color: var(--app-text-muted);
}

.trash-item-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.btn-restore,
.btn-delete-permanent {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.btn-restore {
  border: 1px solid var(--app-accent);
  background: transparent;
  color: var(--app-accent);
}

.btn-restore:hover {
  background: var(--app-active-bg);
}

.btn-delete-permanent {
  border: 1px solid var(--app-delete-hover-text);
  background: transparent;
  color: var(--app-delete-hover-text);
}

.btn-delete-permanent:hover {
  background: var(--app-delete-hover-bg);
}

@media (max-width: 480px) {
  .trash-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .trash-item-actions {
    align-self: flex-end;
  }
}
</style>
