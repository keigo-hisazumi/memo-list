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
import MemoEditor from '@/components/MemoEditor.vue'

const router = useRouter()
const route = useRoute()
const memoStore = useMemoStore()

onMounted(() => {
  // モックデータの初期化
  memoStore.initializeMockData()
  
  // URLパラメータからメモIDを取得して選択
  const memoId = route.params.id as string
  if (memoId) {
    memoStore.selectMemo(memoId)
    
    // メモが存在しない場合は一覧に戻る
    if (!memoStore.selectedMemo) {
      router.push({ name: 'memo-list' })
    }
  }
})

// ルートパラメータが変更されたときにメモを選択し直す
watch(() => route.params.id, (newId) => {
  if (newId) {
    memoStore.selectMemo(newId as string)
    
    // メモが存在しない場合は一覧に戻る
    if (!memoStore.selectedMemo) {
      router.push({ name: 'memo-list' })
    }
  }
})

function handleBack() {
  router.push({ name: 'memo-list' })
}

function handleUpdateMemo(id: string, data: { title?: string; content?: string; category?: string }) {
  memoStore.updateMemo(id, data)
}

function handleDeleteMemo(id: string) {
  memoStore.deleteMemo(id)
  router.push({ name: 'memo-list' })
}
</script>

<style scoped>
.memo-editor-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: white;
}

.editor-header-nav {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  background: white;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
}

.btn-back:hover {
  background: #f5f5f5;
  border-color: #42b883;
  color: #42b883;
}

.btn-back svg {
  transition: transform 0.2s;
}

.btn-back:hover svg {
  transform: translateX(-2px);
}
</style>
