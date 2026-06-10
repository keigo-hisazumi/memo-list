import type { Memo } from '@/types/memo'

interface Props {
  memos: Memo[]
  selectedId?: string | null
  onSelect: (id: string) => void
}

function getPreview(content: string, maxLength = 100): string {
  const stripped = content.replace(/\n/g, ' ').trim()
  if (stripped.length <= maxLength) return stripped
  return stripped.substring(0, maxLength) + '...'
}

export default function MemoList({ memos, selectedId, onSelect }: Props) {
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
          <div
            key={memo.id}
            className={`memo-item${selectedId === memo.id ? ' active' : ''}`}
            onClick={() => onSelect(memo.id)}
          >
            <div className="memo-item-inner">
              {memo.isPinned && (
                <span className="pin-icon" aria-label="ピン留め">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                  </svg>
                </span>
              )}
              <div className="memo-content">
                <h3 className="memo-title">{memo.title || '無題のメモ'}</h3>
                <p className="memo-preview">{getPreview(memo.content)}</p>
              </div>
            </div>
          </div>
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

.memo-item {
  background: var(--app-bg);
  cursor: pointer;
  border-bottom: 1px solid var(--app-border);
  transition: background 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.memo-item:last-child {
  border-bottom: none;
}

.memo-item:active,
.memo-item.active {
  background: var(--app-active-bg);
}

.memo-item-inner {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
}

.pin-icon {
  color: #667eea;
  flex-shrink: 0;
  margin-top: 2px;
  display: flex;
  align-items: center;
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s;
}
`
