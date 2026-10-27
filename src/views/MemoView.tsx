import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useMemo2 } from '@/contexts/MemoContext'
import MemoList from '@/components/MemoList'
import MemoEditor from '@/components/MemoEditor'
import AppDrawer from '@/components/AppDrawer'
import AppHeader from '@/shared/components/AppHeader'
import EditorNav from '@/shared/components/EditorNav'
import IconButton from '@/shared/components/IconButton'
import SaveStatus from '@/shared/components/SaveStatus'
import SearchBar from '@/shared/components/SearchBar'
import { MenuItem, Popover } from '@/shared/components/Popover'
import { ComposeIcon, InfoIcon, MoreIcon, TrashIcon } from '@/shared/components/Icons'
import { useDocumentClick } from '@/shared/hooks/useDocumentClick'
import { useIsMobile } from '@/shared/hooks/useIsMobile'
import { useVisualViewport } from '@/shared/hooks/useVisualViewport'
import { formatDateTime } from '@/shared/lib/format'

type OpenPopover = 'info' | 'menu' | null

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
    </svg>
  )
}

function UnpinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <line x1="2" y1="2" x2="22" y2="22"/>
      <path d="M9 4h6v1.5l-1 1.5M16 12V4h1V2H7"/>
      <path d="M8 12l-2 2v2h7.2M14 16v6"/>
    </svg>
  )
}

export default function MemoView() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const { currentUser, logout } = useAuth()
  const memoStore = useMemo2()
  const isMobile = useIsMobile()
  useVisualViewport()

  const [searchQuery, setSearchQuery] = useState('')
  const [openPopover, setOpenPopover] = useState<OpenPopover>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [createdMemoId, setCreatedMemoId] = useState<string | null>(null)

  const showEditor = !!id
  const selectedMemo = memoStore.selectedMemo

  useDocumentClick(() => setOpenPopover(null))

  const filteredMemos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return memoStore.sortedMemos
    return memoStore.sortedMemos.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.content.toLowerCase().includes(q) ||
      (m.category ?? '').toLowerCase().includes(q)
    )
  }, [searchQuery, memoStore.sortedMemos])

  useEffect(() => {
    memoStore.selectMemo(id ?? null)
  }, [id])

  async function handleCreateMemo() {
    if (!currentUser) return
    const newMemo = await memoStore.createMemo(currentUser.uid, { title: '', content: '' })
    setCreatedMemoId(newMemo.id)
    navigate(`/memo/${newMemo.id}`)
  }

  async function handleUpdateMemo(memoId: string, data: { title?: string; content?: string; category?: string }) {
    if (!currentUser) return
    await memoStore.updateMemo(currentUser.uid, memoId, data)
  }

  async function handleDeleteMemo(memoId: string) {
    if (!currentUser) return
    await memoStore.deleteMemo(currentUser.uid, memoId)
    if (id === memoId) navigate('/')
  }

  async function handleTogglePin() {
    setOpenPopover(null)
    if (!currentUser || !selectedMemo) return
    await memoStore.updateMemo(currentUser.uid, selectedMemo.id, {
      isPinned: !selectedMemo.isPinned
    })
  }

  function handleTrashFromMenu() {
    setOpenPopover(null)
    if (selectedMemo) handleDeleteMemo(selectedMemo.id)
  }

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="split-app">
      {/* サイドバー（メモ一覧） */}
      <div className={`split-sidebar${isMobile && showEditor ? ' mobile-hidden' : ''}`}>
        <AppHeader
          left={<AppDrawer onLogout={handleLogout} />}
          title="すべてのノート"
          right={
            <IconButton label="新規作成" onClick={handleCreateMemo}>
              <ComposeIcon />
            </IconButton>
          }
        />
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="メモまたはタグを検索" />
        <MemoList
          memos={filteredMemos}
          selectedId={memoStore.selectedMemoId}
          onSelect={memoId => navigate(`/memo/${memoId}`)}
          onDelete={handleDeleteMemo}
          isSearching={!!searchQuery.trim()}
        />
      </div>

      {/* メインエリア（エディタ） */}
      <div className={`split-main${isMobile && !showEditor ? ' mobile-hidden' : ''}`}>
        <EditorNav showBack={isMobile} backLabel="すべてのノート" onBack={() => navigate('/')}>
          {selectedMemo && (
            <>
              <SaveStatus isDirty={isDirty} />
              <Popover
                label="情報"
                icon={<InfoIcon />}
                menu={false}
                open={openPopover === 'info'}
                onOpenChange={open => setOpenPopover(open ? 'info' : null)}
              >
                <p className="info-label">更新日時</p>
                <p className="info-value">{formatDateTime(selectedMemo.updatedAt)}</p>
                <p className="info-label">作成日時</p>
                <p className="info-value">{formatDateTime(selectedMemo.createdAt)}</p>
              </Popover>
              <Popover
                label="その他"
                icon={<MoreIcon />}
                open={openPopover === 'menu'}
                onOpenChange={open => setOpenPopover(open ? 'menu' : null)}
              >
                <MenuItem
                  icon={selectedMemo.isPinned ? <UnpinIcon /> : <PinIcon />}
                  onClick={handleTogglePin}
                >
                  {selectedMemo.isPinned ? 'ピン留めを解除' : 'ピン留め'}
                </MenuItem>
                <MenuItem icon={<TrashIcon size={16} />} onClick={handleTrashFromMenu} danger>
                  ゴミ箱に移動
                </MenuItem>
              </Popover>
            </>
          )}
          <IconButton label="新規作成" onClick={handleCreateMemo}>
            <ComposeIcon />
          </IconButton>
        </EditorNav>

        <MemoEditor
          memo={selectedMemo}
          onUpdate={handleUpdateMemo}
          onDirtyChange={setIsDirty}
          autoFocusMemoId={createdMemoId}
        />
      </div>
    </div>
  )
}
