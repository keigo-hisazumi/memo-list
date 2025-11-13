import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Memo, CreateMemoInput, UpdateMemoInput } from '@/types/memo'

/**
 * メモストア
 * メモの CRUD 操作を管理
 */
export const useMemoStore = defineStore('memo', () => {
  // State
  const memos = ref<Memo[]>([])
  const selectedMemoId = ref<string | null>(null)

  // Getters
  const selectedMemo = computed(() => 
    memos.value.find(memo => memo.id === selectedMemoId.value) || null
  )

  const sortedMemos = computed(() => 
    [...memos.value].sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    )
  )

  const categories = computed(() => {
    const categorySet = new Set<string>()
    memos.value.forEach(memo => {
      if (memo.category) {
        categorySet.add(memo.category)
      }
    })
    return Array.from(categorySet).sort()
  })

  // Actions
  function generateId(): string {
    return `memo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  function createMemo(input: CreateMemoInput): Memo {
    const now = new Date()
    const newMemo: Memo = {
      id: generateId(),
      title: input.title,
      content: input.content,
      category: input.category,
      createdAt: now,
      updatedAt: now
    }
    memos.value.push(newMemo)
    return newMemo
  }

  function updateMemo(id: string, input: UpdateMemoInput): boolean {
    const index = memos.value.findIndex(memo => memo.id === id)
    if (index === -1) return false

    const currentMemo = memos.value[index]!
    memos.value[index] = {
      id: currentMemo.id,
      title: input.title !== undefined ? input.title : currentMemo.title,
      content: input.content !== undefined ? input.content : currentMemo.content,
      category: input.category !== undefined ? input.category : currentMemo.category,
      createdAt: currentMemo.createdAt,
      updatedAt: new Date()
    }
    return true
  }

  function deleteMemo(id: string): boolean {
    const index = memos.value.findIndex(memo => memo.id === id)
    if (index === -1) return false

    memos.value.splice(index, 1)
    if (selectedMemoId.value === id) {
      selectedMemoId.value = null
    }
    return true
  }

  function selectMemo(id: string | null) {
    selectedMemoId.value = id
  }

  function getMemoById(id: string): Memo | undefined {
    return memos.value.find(memo => memo.id === id)
  }

  function filterByCategory(category: string): Memo[] {
    return memos.value.filter(memo => memo.category === category)
  }

  function searchMemos(query: string): Memo[] {
    const lowerQuery = query.toLowerCase()
    return memos.value.filter(memo => 
      memo.title.toLowerCase().includes(lowerQuery) ||
      memo.content.toLowerCase().includes(lowerQuery)
    )
  }

  // モックデータの初期化
  function initializeMockData() {
    const mockMemos: CreateMemoInput[] = [
      {
        title: '買い物リスト',
        content: '- 牛乳\n- 卵\n- パン\n- りんご',
        category: '日常'
      },
      {
        title: 'プロジェクトのアイデア',
        content: 'Vue.js + TypeScriptでメモアプリを作成する。\nCapacitorでクロスプラットフォーム対応。',
        category: '仕事'
      },
      {
        title: '読書メモ',
        content: '「Clean Code」の第3章まで読了。\n関数は小さく保つことが重要。',
        category: '学習'
      },
      {
        title: '旅行の計画',
        content: '週末：京都\n- 清水寺\n- 金閣寺\n- 伏見稲荷大社',
        category: '趣味'
      },
      {
        title: 'ミーティングメモ',
        content: '2024-11-13 プロジェクトキックオフ\n- スケジュール確認\n- タスク割り当て\n- 次回: 11/20',
        category: '仕事'
      }
    ]

    // 既存のメモがある場合は初期化しない
    if (memos.value.length === 0) {
      mockMemos.forEach(memo => createMemo(memo))
    }
  }

  return {
    // State
    memos,
    selectedMemoId,
    // Getters
    selectedMemo,
    sortedMemos,
    categories,
    // Actions
    createMemo,
    updateMemo,
    deleteMemo,
    selectMemo,
    getMemoById,
    filterByCategory,
    searchMemos,
    initializeMockData
  }
})
