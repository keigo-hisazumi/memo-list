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
  const trashMemos = ref<Memo[]>([])
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

  const sortedTrashMemos = computed(() =>
    [...trashMemos.value].sort((a, b) => {
      const aTime = a.deletedAt?.getTime() ?? 0
      const bTime = b.deletedAt?.getTime() ?? 0
      return bTime - aTime
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
      const active: Memo[] = []
      const trash: Memo[] = []
      snapshot.docs.forEach(d => {
        const data = d.data()
        const memo: Memo = {
          id: d.id,
          title: data.title ?? '',
          content: data.content ?? '',
          category: data.category,
          isPinned: data.isPinned ?? false,
          createdAt: (data.createdAt as Timestamp).toDate(),
          updatedAt: (data.updatedAt as Timestamp).toDate(),
          deletedAt: data.deletedAt ? (data.deletedAt as Timestamp).toDate() : undefined
        }
        if (memo.deletedAt) {
          trash.push(memo)
        } else {
          active.push(memo)
        }
      })
      memos.value = active
      trashMemos.value = trash
    })
  }

  function unsubscribeFromMemos() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    memos.value = []
    trashMemos.value = []
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
    await updateDoc(ref, { deletedAt: Timestamp.now() })
    if (selectedMemoId.value === id) {
      selectedMemoId.value = null
    }
  }

  async function restoreMemo(userId: string, id: string): Promise<void> {
    const ref = doc(db, 'users', userId, 'memos', id)
    await updateDoc(ref, { deletedAt: deleteField() })
  }

  async function permanentlyDeleteMemo(userId: string, id: string): Promise<void> {
    const ref = doc(db, 'users', userId, 'memos', id)
    await deleteDoc(ref)
  }

  async function emptyTrash(userId: string): Promise<void> {
    const deletions = trashMemos.value.map(memo =>
      deleteDoc(doc(db, 'users', userId, 'memos', memo.id))
    )
    await Promise.all(deletions)
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
    trashMemos,
    selectedMemoId,
    selectedMemo,
    sortedMemos,
    sortedTrashMemos,
    categories,
    subscribeToMemos,
    unsubscribeFromMemos,
    createMemo,
    updateMemo,
    deleteMemo,
    restoreMemo,
    permanentlyDeleteMemo,
    emptyTrash,
    selectMemo,
    getMemoById,
    filterByCategory,
    searchMemos
  }
})
