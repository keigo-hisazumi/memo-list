import { useEffect, useRef, useState, type MutableRefObject, type PointerEvent } from 'react'
import type { Memo } from '@/types/memo'

interface Props {
  memos: Memo[]
  selectedId?: string | null
  onSelect: (id: string) => void
  onDelete?: (id: string) => void
}

const DELETE_WIDTH = 88
const OPEN_THRESHOLD = 40
const SWIPE_TRIGGER = 8

function getPreview(content: string, maxLength = 100): string {
  const stripped = content.replace(/\n/g, ' ').trim()
  if (stripped.length <= maxLength) return stripped
  return stripped.substring(0, maxLength) + '...'
}

interface ItemProps {
  memo: Memo
  active: boolean
  isOpen: boolean
  suppressClickRef: MutableRefObject<number>
  onSelect: (id: string) => void
  onDelete?: (id: string) => void
  onOpen: (id: string | null) => void
}

function MemoListItem({ memo, active, isOpen, suppressClickRef, onSelect, onDelete, onOpen }: ItemProps) {
  const [offset, setOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const startOffset = useRef(0)
  const dragging = useRef(false)
  const swiped = useRef(false)
  const decided = useRef(false)

  // Resting position is driven solely by isOpen; offset is only used mid-drag.
  const translate = isDragging ? -offset : (isOpen ? -DELETE_WIDTH : 0)

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'mouse') return
    startX.current = e.clientX
    startY.current = e.clientY
    startOffset.current = isOpen ? DELETE_WIDTH : 0
    dragging.current = true
    swiped.current = false
    decided.current = false
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return
    const dx = e.clientX - startX.current
    const dy = e.clientY - startY.current

    if (!decided.current) {
      if (Math.abs(dx) < SWIPE_TRIGGER && Math.abs(dy) < SWIPE_TRIGGER) return
      // Decide gesture direction: vertical scroll vs horizontal swipe
      if (Math.abs(dy) > Math.abs(dx)) {
        dragging.current = false
        return
      }
      decided.current = true
      swiped.current = true
      setIsDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    }

    let next = startOffset.current - dx
    if (next < 0) next = 0
    if (next > DELETE_WIDTH + 40) next = DELETE_WIDTH + 40
    setOffset(next)
  }

  function endDrag() {
    if (!dragging.current) return
    dragging.current = false
    setIsDragging(false)
    if (decided.current) {
      if (offset > OPEN_THRESHOLD) {
        onOpen(memo.id)
      } else if (isOpen) {
        onOpen(null)
      }
    }
    setOffset(0)
  }

  function handleClick() {
    if (swiped.current) {
      swiped.current = false
      return
    }
    // A tap that just dismissed an open delete button should not also navigate.
    if (Date.now() - suppressClickRef.current < 350) {
      suppressClickRef.current = 0
      return
    }
    if (isOpen) {
      onOpen(null)
      return
    }
    onSelect(memo.id)
  }

  return (
    <div className="memo-item-wrapper">
      <button
        type="button"
        className="memo-item-delete"
        style={{ width: DELETE_WIDTH }}
        onClick={e => { e.stopPropagation(); onDelete?.(memo.id) }}
        aria-label="削除"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        <span>削除</span>
      </button>
      <div
        className={`memo-item${active ? ' active' : ''}`}
        style={{
          transform: `translateX(${translate}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease'
        }}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="memo-item-inner">
          <span className="pin-icon" aria-label={memo.isPinned ? 'ピン留め' : undefined}>
            {memo.isPinned && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
              </svg>
            )}
          </span>
          <div className="memo-content">
            <h3 className="memo-title">{memo.title || '無題のメモ'}</h3>
            <p className="memo-preview">{getPreview(memo.content)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MemoList({ memos, selectedId, onSelect, onDelete }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const suppressClickRef = useRef(0)

  // Tapping anywhere outside the delete button retracts the revealed button.
  useEffect(() => {
    if (openId === null) return
    function handleDocPointerDown(e: globalThis.PointerEvent) {
      const target = e.target as HTMLElement | null
      if (target?.closest('.memo-item-delete')) return
      suppressClickRef.current = Date.now()
      setOpenId(null)
    }
    document.addEventListener('pointerdown', handleDocPointerDown)
    return () => document.removeEventListener('pointerdown', handleDocPointerDown)
  }, [openId])

  function handleDelete(id: string) {
    setOpenId(null)
    onDelete?.(id)
  }

  if (memos.length === 0) {
    return (
      <div className="memo-list">
        <div className="empty-state">
          <p>メモがありません</p>
          <p className="empty-hint">右上のボタンでメモを追加しましょう</p>
        </div>
        <style>{styles}</style>
      </div>
    )
  }

  return (
    <div className="memo-list">
      <div className="memo-items">
        {memos.map(memo => (
          <MemoListItem
            key={memo.id}
            memo={memo}
            active={selectedId === memo.id}
            isOpen={openId === memo.id}
            suppressClickRef={suppressClickRef}
            onSelect={onSelect}
            onDelete={handleDelete}
            onOpen={setOpenId}
          />
        ))}
      </div>
      <style>{styles}</style>
    </div>
  )
}

const styles = `
.memo-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--app-bg);
  transition: background 0.3s;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.empty-state {
  padding: 3rem 1.5rem;
  text-align: center;
  color: var(--app-text-muted);
  transition: color 0.3s;
}

.empty-state p {
  margin: 0.5rem 0;
}

.empty-hint {
  font-size: 0.9rem;
}

.memo-items {
  display: flex;
  flex-direction: column;
}

.memo-item-wrapper {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--app-border);
}

.memo-item-wrapper:last-child {
  border-bottom: none;
}

.memo-item-delete {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  border: none;
  background: #e5484d;
  color: #fff;
  font-size: 0.78rem;
  font-family: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.memo-item {
  position: relative;
  background: var(--app-bg);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: pan-y;
  will-change: transform;
}

.memo-item:active,
.memo-item.active {
  background: var(--app-active-bg);
}

.memo-item-inner {
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
  padding: 0.425rem 0.5rem;
}

.pin-icon {
  color: #667eea;
  flex-shrink: 0;
  width: 16px;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.memo-content {
  flex: 1;
  min-width: 0;
}

.memo-title {
  margin: 0 0 0.2rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--app-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s;
}

.memo-preview {
  margin: 0;
  font-size: 0.82rem;
  color: var(--app-text-secondary);
  line-height: 1.45;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s;
}
`
