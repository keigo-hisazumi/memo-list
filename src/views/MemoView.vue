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
import { onMounted, onUnmounted } from 'vue'
import { useMemoStore } from '@/stores/memo'
import { useAuthStore } from '@/stores/auth'
import MemoList from '@/components/MemoList.vue'
import MemoEditor from '@/components/MemoEditor.vue'

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
