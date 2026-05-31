import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  type Unsubscribe
} from 'firebase/firestore'
import { db } from '@/firebase'
import type { Memo, CreateMemoInput, UpdateMemoInput } from '@/types/memo'

export const useMemoStore = defineStore('memo', () => {
  const memos = ref<Memo[]>([])
  const selectedMemoId = ref<string | null>(null)
  let unsubscribe: Unsubscribe | null = null

  const selectedMemo = computed(() =>
    memos.value.find(memo => memo.id === selectedMemoId.value) || null
  )

  const sortedMemos = computed(() =>
    [...memos.value].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return b.updatedAt.getTime() - a.updatedAt.getTime()
    })
  )

  const categories = computed(() => {
    const categorySet = new Set<string>()
    memos.value.forEach(memo => {
      if (memo.category) categorySet.add(memo.category)
    })
    return Array.from(categorySet).sort()
  })

  function memosRef(userId: string) {
    return collection(db, 'users', userId, 'memos')
  }

  function subscribeToMemos(userId: string) {
    if (unsubscribe) unsubscribe()

    const q = query(memosRef(userId), orderBy('updatedAt', 'desc'))
    unsubscribe = onSnapshot(q, (snapshot) => {
      memos.value = snapshot.docs.map(d => {
        const data = d.data()
        return {
          id: d.id,
          title: data.title ?? '',
          content: data.content ?? '',
          category: data.category,
          isPinned: data.isPinned ?? false,
          createdAt: (data.createdAt as Timestamp).toDate(),
          updatedAt: (data.updatedAt as Timestamp).toDate()
        }
      })
    })
  }

  function unsubscribeFromMemos() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    memos.value = []
    selectedMemoId.value = null
  }

  async function createMemo(userId: string, input: CreateMemoInput): Promise<Memo> {
    const now = Timestamp.now()
    const docRef = await addDoc(memosRef(userId), {
      title: input.title,
      content: input.content,
      category: input.category ?? null,
      createdAt: now,
      updatedAt: now
    })
    const memo: Memo = {
      id: docRef.id,
      title: input.title,
      content: input.content,
      category: input.category,
      createdAt: now.toDate(),
      updatedAt: now.toDate()
    }
    return memo
  }

  async function updateMemo(userId: string, id: string, input: UpdateMemoInput): Promise<void> {
    const ref = doc(db, 'users', userId, 'memos', id)
    const data: Record<string, unknown> = { updatedAt: Timestamp.now() }
    if (input.title !== undefined) data.title = input.title
    if (input.content !== undefined) data.content = input.content
    if ('category' in input) {
      data.category = input.category !== undefined ? input.category : deleteField()
    }
    await updateDoc(ref, data)
  }

  async function deleteMemo(userId: string, id: string): Promise<void> {
    const ref = doc(db, 'users', userId, 'memos', id)
    await deleteDoc(ref)
    if (selectedMemoId.value === id) {
      selectedMemoId.value = null
    }
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

  return {
    memos,
    selectedMemoId,
    selectedMemo,
    sortedMemos,
    categories,
    subscribeToMemos,
    unsubscribeFromMemos,
    createMemo,
    updateMemo,
    deleteMemo,
    selectMemo,
    getMemoById,
    filterByCategory,
    searchMemos
  }
})
