<template>
  <div class="memo-editor-view">
    <div class="editor-header-nav">
      <button @click="handleBack" class="btn-back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        <span>戻る</span>
      </button>
    </div>
    <MemoEditor
      :memo="memoStore.selectedMemo"
      @update="handleUpdateMemo"
      @delete="handleDeleteMemo"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMemoStore } from '@/stores/memo'
import { useAuthStore } from '@/stores/auth'
import MemoEditor from '@/components/MemoEditor.vue'

const router = useRouter()
const route = useRoute()
const memoStore = useMemoStore()
const authStore = useAuthStore()

onMounted(() => {
  memoStore.selectMemo(route.params.id as string)
})

watch(() => route.params.id, (newId) => {
  if (newId) memoStore.selectMemo(newId as string)
})

function handleBack() {
  router.push({ name: 'memo-list' })
}

async function handleUpdateMemo(id: string, data: { title?: string; content?: string; category?: string }) {
  if (!authStore.currentUser) return
  await memoStore.updateMemo(authStore.currentUser.uid, id, data)
}

async function handleDeleteMemo(id: string) {
  if (!authStore.currentUser) return
  await memoStore.deleteMemo(authStore.currentUser.uid, id)
  router.push({ name: 'memo-list' })
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

.editor-header-nav {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--app-border);
  background: var(--app-bg);
  transition: background 0.3s, border-color 0.3s;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--app-border);
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--app-text-secondary);
}

.btn-back:hover {
  background: var(--app-bg-soft);
  border-color: var(--app-accent);
  color: var(--app-accent);
}

.btn-back svg {
  transition: transform 0.2s;
}

.btn-back:hover svg {
  transform: translateX(-2px);
}
</style>
