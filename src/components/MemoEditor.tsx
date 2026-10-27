import { useState, useEffect, useRef } from 'react'
import type { Memo } from '@/types/memo'
import NoSelection from '@/shared/components/NoSelection'
import { useAutoResize } from '@/shared/hooks/useAutoResize'
import { useDebouncedTask } from '@/shared/hooks/useDebouncedTask'
import { useTitleBodyKeys } from '@/shared/hooks/useTitleBodyKeys'
import './MemoEditor.css'

type MemoUpdate = { title?: string; content?: string; category?: string }

interface Props {
  memo: Memo | null
  onUpdate: (id: string, data: MemoUpdate) => void
  /** 保存待ち（編集中）かどうかが変化したときに呼ばれる */
  onDirtyChange?: (dirty: boolean) => void
  /** 新規作成直後など、表示したらすぐタイトルを入力できるようにするかどうか */
  autoFocusMemoId?: string | null
}

// 入力が落ち着いてから Firestore へ書き込むまでの待機時間（ミリ秒）
const SAVE_DEBOUNCE_MS = 600

export default function MemoEditor({ memo, onUpdate, onDirtyChange, autoFocusMemoId }: Props) {
  const [localTitle, setLocalTitle] = useState('')
  const [localContent, setLocalContent] = useState('')
  const [localCategory, setLocalCategory] = useState('')
  const titleRef = useRef<HTMLTextAreaElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { onTitleKeyDown, onBodyKeyDown } = useTitleBodyKeys(titleRef, contentRef)

  // 最新の onUpdate / onDirtyChange を参照しつつ、保存待ちの編集内容を
  // デバウンスして書き込む。キーストロークごとの Firestore 書き込みを
  // 抑えつつ自動保存の体験を保つ。
  const onUpdateRef = useRef(onUpdate)
  const onDirtyChangeRef = useRef(onDirtyChange)
  const pendingRef = useRef<{ id: string; data: MemoUpdate } | null>(null)
  const saveTask = useDebouncedTask(SAVE_DEBOUNCE_MS)

  useEffect(() => {
    onUpdateRef.current = onUpdate
    onDirtyChangeRef.current = onDirtyChange
  })

  function commit() {
    const pending = pendingRef.current
    if (!pending) return
    pendingRef.current = null
    onUpdateRef.current(pending.id, pending.data)
    onDirtyChangeRef.current?.(false)
  }

  function scheduleUpdate(id: string, data: MemoUpdate) {
    const prev = pendingRef.current?.id === id ? pendingRef.current.data : {}
    pendingRef.current = { id, data: { ...prev, ...data } }
    onDirtyChangeRef.current?.(true)
    saveTask.schedule(commit)
  }

  useEffect(() => {
    // メモ切り替え前に、保存待ちの編集内容を確定させる
    saveTask.flush()
    onDirtyChangeRef.current?.(false)
    setLocalTitle(memo?.title ?? '')
    setLocalContent(memo?.content ?? '')
    setLocalCategory(memo?.category ?? '')
    if (memo && memo.id === autoFocusMemoId) {
      setTimeout(() => titleRef.current?.focus(), 0)
    }
  }, [memo?.id])

  // 別デバイスでの更新をリアルタイムに反映する。ただし保存待ちの
  // ローカル編集（pendingRef）がある間はユーザーの入力を上書きしない。
  useEffect(() => {
    if (!memo) return
    if (pendingRef.current?.id === memo.id) return
    setLocalTitle(memo.title)
    setLocalContent(memo.content)
    setLocalCategory(memo.category ?? '')
  }, [memo?.id, memo?.title, memo?.content, memo?.category])

  // タイトル・本文を内容に合わせて伸縮させ、同一スクロール領域で動くようにする
  useAutoResize(titleRef, scrollRef, [localTitle, memo?.id])
  useAutoResize(contentRef, scrollRef, [localContent, memo?.id])

  if (!memo) {
    return <NoSelection message="メモを選択してください" />
  }

  return (
    <div className="memo-editor">
      <div className="editor-scroll" ref={scrollRef}>
        <textarea
          ref={titleRef}
          value={localTitle}
          rows={1}
          className="editor-title"
          placeholder="タイトル"
          autoComplete="off"
          onKeyDown={onTitleKeyDown}
          onChange={e => {
            // タイトルは 1 行として扱う（貼り付けた改行は空白にする）
            const value = e.target.value.replace(/\r?\n/g, ' ')
            setLocalTitle(value)
            scheduleUpdate(memo.id, { title: value })
          }}
        />
        <textarea
          ref={contentRef}
          value={localContent}
          className="editor-body"
          placeholder="メモを入力..."
          autoComplete="off"
          onChange={e => {
            setLocalContent(e.target.value)
            scheduleUpdate(memo.id, { content: e.target.value })
          }}
          onKeyDown={onBodyKeyDown}
        />
      </div>

      <div className="bottom-bar">
        <label className="tags-area">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tag-icon" aria-hidden="true">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
          <input
            value={localCategory}
            type="text"
            className="category-input"
            placeholder="タグを追加..."
            aria-label="タグ"
            onChange={e => {
              setLocalCategory(e.target.value)
              scheduleUpdate(memo.id, { category: e.target.value || undefined })
            }}
          />
        </label>
      </div>
    </div>
  )
}
