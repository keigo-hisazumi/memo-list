<template>
  <div class="memo-list">
    <div class="memo-list-header">
      <h2>メモ一覧</h2>
      <button @click="$emit('create')" class="btn-create">
        <span>+</span> 新規作成
      </button>
    </div>

    <div v-if="memos.length === 0" class="empty-state">
      <p>メモがありません</p>
      <p class="empty-hint">「新規作成」ボタンでメモを追加しましょう</p>
    </div>

    <div v-else class="memo-items">
      <div
        v-for="memo in memos"
        :key="memo.id"
        :class="['memo-item', { active: selectedId === memo.id }]"
        @click="$emit('select', memo.id)"
      >
        <div class="memo-item-header">
          <h3 class="memo-title">{{ memo.title || '無題のメモ' }}</h3>
          <span v-if="memo.category" class="memo-category">{{ memo.category }}</span>
        </div>
        <p class="memo-preview">{{ getPreview(memo.content) }}</p>
        <div class="memo-meta">
          <span class="memo-date">{{ formatDate(memo.updatedAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Memo } from '@/types/memo'

interface Props {
  memos: Memo[]
  selectedId?: string | null
}

defineProps<Props>()

defineEmits<{
  select: [id: string]
  create: []
}>()

function getPreview(content: string, maxLength = 60): string {
  const stripped = content.replace(/\n/g, ' ').trim()
  if (stripped.length <= maxLength) return stripped
  return stripped.substring(0, maxLength) + '...'
}

function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'たった今'
  if (minutes < 60) return `${minutes}分前`
  if (hours < 24) return `${hours}時間前`
  if (days < 7) return `${days}日前`
  
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style scoped>
.memo-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f5f5;
}

.memo-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.memo-list-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-create:hover {
  background: #359268;
}

.btn-create span {
  font-size: 1.2rem;
  font-weight: bold;
}

.empty-state {
  padding: 3rem 1.5rem;
  text-align: center;
  color: #999;
}

.empty-state p {
  margin: 0.5rem 0;
}

.empty-hint {
  font-size: 0.9rem;
}

.memo-items {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.memo-item {
  background: white;
  padding: 1rem 1.5rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.memo-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.memo-item.active {
  border-color: #42b883;
  background: #f0fdf7;
}

.memo-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.memo-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.memo-category {
  padding: 0.25rem 0.75rem;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.memo-preview {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.memo-meta {
  display: flex;
  justify-content: flex-end;
}

.memo-date {
  font-size: 0.75rem;
  color: #999;
}
</style>
