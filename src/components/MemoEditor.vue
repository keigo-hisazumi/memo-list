<template>
  <div class="memo-editor">
    <div v-if="!memo" class="no-selection">
      <div class="no-selection-content">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
        <p>メモを選択してください</p>
      </div>
    </div>

    <template v-else>
      <div class="editor-scroll">
        <input
          ref="titleRef"
          v-model="localTitle"
          type="text"
          class="title-input"
          placeholder="タイトル"
          autocomplete="off"
          @keydown.enter.prevent="focusContent"
          @input="handleTitleUpdate"
        />
        <textarea
          ref="contentRef"
          v-model="localContent"
          class="content-textarea"
          placeholder="メモを入力..."
          autocomplete="off"
          @input="handleContentUpdate"
          @keydown="handleContentKeydown"
        />
      </div>

      <div class="bottom-bar">
        <div class="tags-area">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tag-icon">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
          <input
            v-model="localCategory"
            type="text"
            class="category-input"
            placeholder="タグを追加..."
            @input="handleCategoryUpdate"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
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

const titleRef = ref<HTMLInputElement | null>(null)
const contentRef = ref<HTMLTextAreaElement | null>(null)

watch(() => props.memo?.id, () => {
  const memo = props.memo
  if (memo) {
    localTitle.value = memo.title
    localContent.value = memo.content
    localCategory.value = memo.category || ''
  } else {
    localTitle.value = ''
    localContent.value = ''
    localCategory.value = ''
  }
}, { immediate: true })

function focusContent() {
  setTimeout(() => contentRef.value?.focus(), 0)
}

function handleContentKeydown(e: KeyboardEvent) {
  if (e.key === 'Backspace') {
    const textarea = e.target as HTMLTextAreaElement
    if (textarea.selectionStart === 0 && textarea.selectionEnd === 0) {
      e.preventDefault()
      const end = localTitle.value.length
      titleRef.value?.focus()
      nextTick(() => titleRef.value?.setSelectionRange(end, end))
    }
  }
}

function handleTitleUpdate() {
  if (!props.memo) return
  emit('update', props.memo.id, { title: localTitle.value })
}

function handleContentUpdate() {
  if (!props.memo) return
  emit('update', props.memo.id, { content: localContent.value })
}

function handleCategoryUpdate() {
  if (!props.memo) return
  emit('update', props.memo.id, { category: localCategory.value || undefined })
}
</script>

<style scoped>
.memo-editor {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: var(--app-bg);
  transition: background 0.3s;
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: var(--app-text-muted);
  transition: color 0.3s;
}

.no-selection-content {
  text-align: center;
}

.no-selection-content svg {
  margin-bottom: 1rem;
  opacity: 0.4;
}

.no-selection-content p {
  margin: 0;
  font-size: 1rem;
}

.editor-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem 1.25rem 0.5rem;
  display: flex;
  flex-direction: column;
}

.title-input {
  width: 100%;
  font-size: 1.6rem;
  font-weight: 700;
  border: none;
  outline: none;
  padding: 0;
  margin-bottom: 0.5rem;
  color: var(--app-text);
  background: transparent;
  line-height: 1.3;
  font-family: inherit;
  transition: color 0.3s;
}

.title-input::placeholder {
  color: var(--app-text-placeholder);
}

.content-textarea {
  flex: 1;
  min-height: 300px;
  width: 100%;
  border: none;
  outline: none;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.7;
  resize: none;
  color: var(--app-text);
  background: transparent;
  transition: color 0.3s;
  padding: 0;
}

.content-textarea::placeholder {
  color: var(--app-text-placeholder);
}

.bottom-bar {
  flex-shrink: 0;
  border-top: 1px solid var(--app-border);
  padding: 0.6rem 1.25rem;
  background: var(--app-bg);
  transition: background 0.3s, border-color 0.3s;
}

.tags-area {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.tag-icon {
  color: var(--app-text-muted);
  flex-shrink: 0;
}

.category-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.9rem;
  color: var(--app-text-secondary);
  background: transparent;
  font-family: inherit;
  transition: color 0.3s;
}

.category-input::placeholder {
  color: var(--app-text-muted);
}
</style>
