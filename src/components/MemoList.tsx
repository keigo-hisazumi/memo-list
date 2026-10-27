import type { Memo } from '@/types/memo'
import { SwipeableList, SwipeableListItem } from '@/shared/components/SwipeableList'
import EmptyState from '@/shared/components/EmptyState'
import { formatDateTime, previewText } from '@/shared/lib/format'
import './MemoList.css'

interface Props {
  memos: Memo[]
  selectedId?: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  /** 検索中かどうか（空表示の文言を切り替える） */
  isSearching?: boolean
}

export default function MemoList({ memos, selectedId, onSelect, onDelete, isSearching }: Props) {
  if (memos.length === 0) {
    return (
      <div className="list-scroll">
        {isSearching
          ? <EmptyState message="一致するメモがありません" />
          : <EmptyState message="メモがありません" hint="右上のボタンでメモを追加しましょう" />}
      </div>
    )
  }

  return (
    <div className="list-scroll">
      <SwipeableList>
        {memos.map(memo => (
          <SwipeableListItem
            key={memo.id}
            id={memo.id}
            active={selectedId === memo.id}
            onSelect={onSelect}
            onAction={onDelete}
          >
            <div className="list-item-inner">
              <span className="pin-icon" aria-label={memo.isPinned ? 'ピン留め' : undefined}>
                {memo.isPinned && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                  </svg>
                )}
              </span>
              <div className="list-item-main">
                <div className="list-item-header">
                  <h3 className="list-item-title">{memo.title || '無題のメモ'}</h3>
                  {memo.category && <span className="memo-tag">{memo.category}</span>}
                </div>
                <p className="list-item-preview">{previewText(memo.content) || '内容なし'}</p>
                <time className="list-item-meta">{formatDateTime(memo.updatedAt)}</time>
              </div>
            </div>
          </SwipeableListItem>
        ))}
      </SwipeableList>
    </div>
  )
}
