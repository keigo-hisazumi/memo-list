<template>
  <div class="memo-app">
    <div class="memo-sidebar">
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
import { onMounted } from 'vue'
import { useMemoStore } from '@/stores/memo'
import MemoList from '@/components/MemoList.vue'
import MemoEditor from '@/components/MemoEditor.vue'

const memoStore = useMemoStore()

onMounted(() => {
  // モックデータの初期化
  memoStore.initializeMockData()
})

function handleSelectMemo(id: string) {
  memoStore.selectMemo(id)
}

function handleCreateMemo() {
  const newMemo = memoStore.createMemo({
    title: '',
    content: ''
  })
  memoStore.selectMemo(newMemo.id)
}

function handleUpdateMemo(id: string, data: { title?: string; content?: string; category?: string }) {
  memoStore.updateMemo(id, data)
}

function handleDeleteMemo(id: string) {
  memoStore.deleteMemo(id)
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
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.memo-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* モバイル対応 */
@media (max-width: 768px) {
  .memo-app {
    flex-direction: column;
  }
  
  .memo-sidebar {
    width: 100%;
    height: 50vh;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .memo-main {
    height: 50vh;
  }
}
</style>
