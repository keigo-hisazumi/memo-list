<template>
  <div class="memo-list-view">
    <MemoList
      :memos="memoStore.sortedMemos"
      :selected-id="null"
      @select="handleSelectMemo"
      @create="handleCreateMemo"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMemoStore } from '@/stores/memo'
import MemoList from '@/components/MemoList.vue'

const router = useRouter()
const memoStore = useMemoStore()

onMounted(() => {
  // モックデータの初期化
  memoStore.initializeMockData()
})

function handleSelectMemo(id: string) {
  router.push({ name: 'memo-edit', params: { id } })
}

function handleCreateMemo() {
  const newMemo = memoStore.createMemo({
    title: '',
    content: ''
  })
  router.push({ name: 'memo-edit', params: { id: newMemo.id } })
}
</script>

<style scoped>
.memo-list-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
</style>
