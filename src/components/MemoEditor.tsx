import { useState, useEffect, useRef } from 'react'
import type { Memo } from '@/types/memo'

interface Props {
  memo: Memo | null
  onUpdate: (id: string, data: { title?: string; content?: string; category?: string }) => void
}

export default function MemoEditor({ memo, onUpdate }: Props) {
  const [localTitle, setLocalTitle] = useState('')
  const [localContent, setLocalContent] = useState('')
  const [localCategory, setLocalCategory] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (memo) {
      setLocalTitle(memo.title)
      setLocalContent(memo.content)
      setLocalCategory(memo.category || '')
    } else {
      setLocalTitle('')
      setLocalContent('')
      setLocalCategory('')
    }
  }, [memo?.id])

  function focusContent() {
    setTimeout(() => contentRef.current?.focus(), 0)
  }

  function handleContentKeydown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Backspace') {
      const textarea = e.currentTarget
      if (textarea.selectionStart === 0 && textarea.selectionEnd === 0) {
        e.preventDefault()
        const end = localTitle.length
        titleRef.current?.focus()
        setTimeout(() => titleRef.current?.setSelectionRange(end, end), 0)
      }
    }
  }

  if (!memo) {
    return (
      <div className="memo-editor">
        <div className="no-selection">
          <div className="no-selection-content">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            <p>メモを選択してください</p>
          </div>
        </div>
        <style>{styles}</style>
      </div>
    )
  }

  return (
    <div className="memo-editor">
      <div className="editor-scroll">
        <input
          ref={titleRef}
          value={localTitle}
          type="text"
          className="title-input"
          placeholder="タイトル"
          autoComplete="off"
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); focusContent() } }}
          onChange={e => {
            setLocalTitle(e.target.value)
            onUpdate(memo.id, { title: e.target.value })
          }}
        />
        <textarea
          ref={contentRef}
          value={localContent}
          className="content-textarea"
          placeholder="メモを入力..."
          autoComplete="off"
          onChange={e => {
            setLocalContent(e.target.value)
            onUpdate(memo.id, { content: e.target.value })
          }}
          onKeyDown={handleContentKeydown}
        />
      </div>

      <div className="bottom-bar">
        <div className="tags-area">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tag-icon">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
          <input
            value={localCategory}
            type="text"
            className="category-input"
            placeholder="タグを追加..."
            onChange={e => {
              setLocalCategory(e.target.value)
              onUpdate(memo.id, { category: e.target.value || undefined })
            }}
          />
        </div>
      </div>
      <style>{styles}</style>
    </div>
  )
}

const styles = `
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
`
