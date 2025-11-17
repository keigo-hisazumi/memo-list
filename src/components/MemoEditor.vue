<template>
  <div class="memo-editor">
    <div v-if="!memo" class="no-selection">
      <div class="no-selection-content">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
        <p>メモを選択してください</p>
      </div>
    </div>

    <div v-else class="editor-container">
      <div class="editor-header">
        <input
          v-model="localTitle"
          type="text"
          class="title-input"
          placeholder="タイトルを入力..."
          @input="handleUpdate"
        />
        <div class="editor-actions">
          <button @click="handleDelete" class="btn-delete" title="削除">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="editor-meta">
        <input
          v-model="localCategory"
          type="text"
          class="category-input"
          placeholder="カテゴリ (任意)"
          @input="handleUpdate"
        />
        <span class="meta-date">
          作成: {{ formatDate(memo.createdAt) }} / 
          更新: {{ formatDate(memo.updatedAt) }}
        </span>
      </div>

      <div class="editor-content">
        <textarea
          v-model="localContent"
          class="content-textarea"
          placeholder="メモの内容を入力..."
          @input="handleUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Memo } from '@/types/memo'

interface Props {
  memo: Memo | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [id: string, data: { title?: string; content?: string; category?: string }]
  delete: [id: string]
}>()

const localTitle = ref('')
const localContent = ref('')
const localCategory = ref('')

// メモが変更されたらローカルの値を更新
watch(() => props.memo, (newMemo) => {
  if (newMemo) {
    localTitle.value = newMemo.title
    localContent.value = newMemo.content
    localCategory.value = newMemo.category || ''
  } else {
    localTitle.value = ''
    localContent.value = ''
    localCategory.value = ''
  }
}, { immediate: true })

function handleUpdate() {
  if (!props.memo) return
  
  emit('update', props.memo.id, {
    title: localTitle.value,
    content: localContent.value,
    category: localCategory.value || undefined
  })
}

function handleDelete() {
  if (!props.memo) return
  
  if (confirm(`「${props.memo.title || '無題のメモ'}」を削除してもよろしいですか？`)) {
    emit('delete', props.memo.id)
  }
}

function formatDate(date: Date): string {
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.memo-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.no-selection-content {
  text-align: center;
}

.no-selection-content svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-selection-content p {
  margin: 0;
  font-size: 1.1rem;
}

.editor-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.editor-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 1.5rem 0.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.title-input {
  flex: 1;
  font-size: 1.5rem;
  font-weight: 600;
  border: none;
  outline: none;
  padding: 0.5rem;
  color: #333;
}

.title-input::placeholder {
  color: #ccc;
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-delete {
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.btn-delete:hover {
  background: #fee;
  color: #d32f2f;
}

.editor-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.category-input {
  padding: 0.25rem 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 0.875rem;
  outline: none;
  max-width: 200px;
}

.category-input:focus {
  border-color: #42b883;
}

.meta-date {
  font-size: 0.75rem;
  color: #999;
}

.editor-content {
  flex: 1;
  padding: 1.5rem;
  overflow: hidden;
}

.content-textarea {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.6;
  resize: none;
  color: #333;
}

.content-textarea::placeholder {
  color: #ccc;
}
</style>
