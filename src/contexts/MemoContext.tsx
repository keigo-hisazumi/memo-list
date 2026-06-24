import {
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
  useCallback,
  type ReactNode
} from 'react'
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

interface MemoContextValue {
  memos: Memo[]
  trashMemos: Memo[]
  selectedMemoId: string | null
  selectedMemo: Memo | null
  sortedMemos: Memo[]
  sortedTrashMemos: Memo[]
  categories: string[]
  subscribeToMemos: (userId: string) => void
  unsubscribeFromMemos: () => void
  createMemo: (userId: string, input: CreateMemoInput) => Promise<Memo>
  updateMemo: (userId: string, id: string, input: UpdateMemoInput) => Promise<void>
  deleteMemo: (userId: string, id: string) => Promise<void>
  restoreMemo: (userId: string, id: string) => Promise<void>
  permanentlyDeleteMemo: (userId: string, id: string) => Promise<void>
  emptyTrash: (userId: string) => Promise<void>
  selectMemo: (id: string | null) => void
  getMemoById: (id: string) => Memo | undefined
  filterByCategory: (category: string) => Memo[]
  searchMemos: (query: string) => Memo[]
}

const MemoContext = createContext<MemoContextValue | null>(null)

export function MemoProvider({ children }: { children: ReactNode }) {
  const [memos, setMemos] = useState<Memo[]>([])
  const [trashMemos, setTrashMemos] = useState<Memo[]>([])
  const [selectedMemoId, setSelectedMemoId] = useState<string | null>(null)
  const unsubscribeRef = useRef<Unsubscribe | null>(null)

  const selectedMemo = useMemo(
    () => memos.find(m => m.id === selectedMemoId) ?? null,
    [memos, selectedMemoId]
  )

  const sortedMemos = useMemo(
    () => [...memos].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return b.updatedAt.getTime() - a.updatedAt.getTime()
    }),
    [memos]
  )

  const sortedTrashMemos = useMemo(
    () => [...trashMemos].sort((a, b) => {
      const aTime = a.deletedAt?.getTime() ?? 0
      const bTime = b.deletedAt?.getTime() ?? 0
      return bTime - aTime
    }),
    [trashMemos]
  )

  const categories = useMemo(() => {
    const set = new Set<string>()
    memos.forEach(m => { if (m.category) set.add(m.category) })
    return Array.from(set).sort()
  }, [memos])

  function memosRef(userId: string) {
    return collection(db, 'users', userId, 'memos')
  }

  const subscribeToMemos = useCallback((userId: string) => {
    if (unsubscribeRef.current) unsubscribeRef.current()
    const q = query(memosRef(userId), orderBy('updatedAt', 'desc'))
    unsubscribeRef.current = onSnapshot(q, (snapshot) => {
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
      setMemos(active)
      setTrashMemos(trash)
    })
  }, [])

  const unsubscribeFromMemos = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }
    setMemos([])
    setTrashMemos([])
    setSelectedMemoId(null)
  }, [])

  async function createMemo(userId: string, input: CreateMemoInput): Promise<Memo> {
    const now = Timestamp.now()
    const docRef = await addDoc(memosRef(userId), {
      title: input.title,
      content: input.content,
      category: input.category ?? null,
      createdAt: now,
      updatedAt: now
    })
    return {
      id: docRef.id,
      title: input.title,
      content: input.content,
      category: input.category,
      isPinned: false,
      createdAt: now.toDate(),
      updatedAt: now.toDate()
    }
  }

  async function updateMemo(userId: string, id: string, input: UpdateMemoInput): Promise<void> {
    const ref = doc(db, 'users', userId, 'memos', id)
    const data: Record<string, unknown> = {}
    if (input.title !== undefined) data.title = input.title
    if (input.content !== undefined) data.content = input.content
    if ('category' in input) {
      data.category = input.category !== undefined ? input.category : deleteField()
    }
    if (input.isPinned !== undefined) data.isPinned = input.isPinned
    // ピン留めの切り替えだけでは更新日時を変えない（内容変更時のみ更新）
    if (input.title !== undefined || input.content !== undefined || 'category' in input) {
      data.updatedAt = Timestamp.now()
    }
    await updateDoc(ref, data)
  }

  async function deleteMemo(userId: string, id: string): Promise<void> {
    const ref = doc(db, 'users', userId, 'memos', id)
    await updateDoc(ref, { deletedAt: Timestamp.now() })
    setSelectedMemoId(prev => prev === id ? null : prev)
  }

  async function restoreMemo(userId: string, id: string): Promise<void> {
    const ref = doc(db, 'users', userId, 'memos', id)
    await updateDoc(ref, { deletedAt: deleteField() })
  }

  async function permanentlyDeleteMemo(userId: string, id: string): Promise<void> {
    await deleteDoc(doc(db, 'users', userId, 'memos', id))
  }

  async function emptyTrash(userId: string): Promise<void> {
    await Promise.all(
      trashMemos.map(memo => deleteDoc(doc(db, 'users', userId, 'memos', memo.id)))
    )
  }

  function selectMemo(id: string | null) {
    setSelectedMemoId(id)
  }

  function getMemoById(id: string): Memo | undefined {
    return memos.find(m => m.id === id)
  }

  function filterByCategory(category: string): Memo[] {
    return memos.filter(m => m.category === category)
  }

  function searchMemos(q: string): Memo[] {
    const lower = q.toLowerCase()
    return memos.filter(m =>
      m.title.toLowerCase().includes(lower) ||
      m.content.toLowerCase().includes(lower)
    )
  }

  return (
    <MemoContext.Provider value={{
      memos, trashMemos, selectedMemoId, selectedMemo,
      sortedMemos, sortedTrashMemos, categories,
      subscribeToMemos, unsubscribeFromMemos,
      createMemo, updateMemo, deleteMemo, restoreMemo,
      permanentlyDeleteMemo, emptyTrash, selectMemo,
      getMemoById, filterByCategory, searchMemos
    }}>
      {children}
    </MemoContext.Provider>
  )
}

export function useMemo2() {
  const ctx = useContext(MemoContext)
  if (!ctx) throw new Error('useMemo2 must be used within MemoProvider')
  return ctx
}
