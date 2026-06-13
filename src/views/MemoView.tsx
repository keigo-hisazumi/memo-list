import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useMemo2 } from '@/contexts/MemoContext'
import MemoList from '@/components/MemoList'
import MemoEditor from '@/components/MemoEditor'
import HamburgerMenu from '@/components/HamburgerMenu'

function formatDate(date: Date): string {
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function MemoView() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const { currentUser, logout } = useAuth()
  const memoStore = useMemo2()

  const [searchQuery, setSearchQuery] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const isMobile = windowWidth < 768
  const showEditor = !!id

  const filteredMemos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return memoStore.sortedMemos
    return memoStore.sortedMemos.filter(m =>
      m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q)
    )
  }, [searchQuery, memoStore.sortedMemos])

  useEffect(() => {
    function onResize() { setWindowWidth(window.innerWidth) }
    function closeAll() { setShowMenu(false); setShowInfo(false) }
    window.addEventListener('resize', onResize)
    document.addEventListener('click', closeAll)
    return () => {
      window.removeEventListener('resize', onResize)
      document.removeEventListener('click', closeAll)
    }
  }, [])

  useEffect(() => {
    memoStore.selectMemo(id ?? null)
  }, [id])

  async function handleCreateMemo() {
    if (!currentUser) return
    const newMemo = await memoStore.createMemo(currentUser.uid, { title: '', content: '' })
    navigate(`/memo/${newMemo.id}`)
  }

  function handleSelectMemo(memoId: string) {
    navigate(`/memo/${memoId}`)
  }

  async function handleDeleteFromList(memoId: string) {
    if (!currentUser) return
    await memoStore.deleteMemo(currentUser.uid, memoId)
    if (id === memoId) navigate('/')
  }

  async function handleUpdateMemo(memoId: string, data: { title?: string; content?: string; category?: string }) {
    if (!currentUser) return
    await memoStore.updateMemo(currentUser.uid, memoId, data)
  }

  async function handleDeleteMemo(memoId: string) {
    if (!currentUser) return
    await memoStore.deleteMemo(currentUser.uid, memoId)
    navigate('/')
  }

  function handleDeleteFromMenu() {
    setShowMenu(false)
    if (memoStore.selectedMemo) {
      handleDeleteMemo(memoStore.selectedMemo.id)
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="memo-app">
      {/* サイドバー */}
      <div className={`memo-sidebar${isMobile && showEditor ? ' mobile-hidden' : ''}`}>
        <div className="list-header-bar">
          <HamburgerMenu onLogout={handleLogout} />
          <span className="app-title">すべてのノート</span>
          <button className="nav-icon-btn" onClick={handleCreateMemo} aria-label="新規作成">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>

        <div className="search-bar-wrap">
          <div className="search-bar">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              type="search"
              className="search-input"
              placeholder="メモまたはタグを検索"
            />
          </div>
        </div>

        <MemoList
          memos={filteredMemos}
          selectedId={memoStore.selectedMemoId}
          onSelect={handleSelectMemo}
          onDelete={handleDeleteFromList}
        />
      </div>

      {/* メインエリア */}
      <div className={`memo-main${isMobile && !showEditor ? ' mobile-hidden' : ''}`}>
        <div className="editor-nav">
          {isMobile ? (
            <button onClick={() => navigate('/')} className="btn-back">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              <span>すべてのノート</span>
            </button>
          ) : (
            <div className="nav-spacer"></div>
          )}

          <div className="nav-actions">
            <div className="nav-icon-wrap">
              <button
                className="nav-icon-btn"
                title="情報"
                onClick={e => { e.stopPropagation(); setShowInfo(v => !v); setShowMenu(false) }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="8" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="12" y1="12" x2="12" y2="16"/>
                </svg>
              </button>
              {showInfo && memoStore.selectedMemo && (
                <div className="info-popup">
                  <p className="info-label">更新日時</p>
                  <p className="info-value">{formatDate(memoStore.selectedMemo.updatedAt)}</p>
                  <p className="info-label info-label-mt">作成日時</p>
                  <p className="info-value">{formatDate(memoStore.selectedMemo.createdAt)}</p>
                </div>
              )}
            </div>

            <div className="nav-icon-wrap">
              <button
                className="nav-icon-btn"
                title="その他"
                onClick={e => { e.stopPropagation(); setShowMenu(v => !v); setShowInfo(false) }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="7.5" cy="12" r="1.1" fill="currentColor" stroke="none"/>
                  <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/>
                  <circle cx="16.5" cy="12" r="1.1" fill="currentColor" stroke="none"/>
                </svg>
              </button>
              {showMenu && (
                <div className="action-menu" onClick={e => e.stopPropagation()}>
                  <button className="action-menu-item action-menu-delete" onClick={handleDeleteFromMenu}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    ゴミ箱に移動
                  </button>
                </div>
              )}
            </div>

            <button className="nav-icon-btn" title="新規メモ" onClick={handleCreateMemo}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>
        </div>

        <MemoEditor
          memo={memoStore.selectedMemo}
          onUpdate={handleUpdateMemo}
        />
      </div>

      <style>{styles}</style>
    </div>
  )
}

const styles = `
.memo-app {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--app-bg);
}

.memo-sidebar {
  width: 320px;
  flex-shrink: 0;
  border-right: 1px solid var(--app-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: border-color 0.3s;
}

.list-header-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--app-header-bg);
  border-bottom: 1px solid var(--app-header-border);
  flex-shrink: 0;
  transition: background 0.3s, border-color 0.3s;
  box-shadow: 0 1px 4px var(--app-shadow);
}

.app-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--app-text);
  letter-spacing: 0.01em;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.search-bar-wrap {
  padding: 0.6rem 0.75rem;
  background: var(--app-bg);
  border-bottom: 1px solid var(--app-border);
  flex-shrink: 0;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--app-bg-soft);
  border-radius: 10px;
  padding: 0.45rem 0.75rem;
}

.search-icon {
  color: var(--app-text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  color: var(--app-text);
  outline: none;
  font-family: inherit;
}

.search-input::placeholder {
  color: var(--app-text-muted);
}

.search-input::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

.memo-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.editor-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--app-header-bg);
  border-bottom: 1px solid var(--app-header-border);
  transition: background 0.3s, border-color 0.3s;
  flex-shrink: 0;
  box-shadow: 0 1px 4px var(--app-shadow);
}

.nav-spacer {
  flex: 1;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  padding: 0.4rem 0.5rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  color: var(--app-accent);
  transition: opacity 0.15s;
}

.btn-back:hover {
  opacity: 0.7;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.1rem;
}

.nav-icon-wrap {
  position: relative;
}

.nav-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--app-accent);
  transition: opacity 0.15s;
}

.nav-icon-btn:hover {
  opacity: 0.7;
}

.info-popup {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--app-menu-bg);
  border: 1px solid var(--app-border);
  border-radius: 10px;
  box-shadow: 0 4px 16px var(--app-shadow);
  z-index: 100;
  min-width: 200px;
  padding: 0.75rem 1rem;
}

.info-label {
  font-size: 0.7rem;
  color: var(--app-text-muted);
  margin-bottom: 0.15rem;
}

.info-label-mt {
  margin-top: 0.6rem;
}

.info-value {
  font-size: 0.875rem;
  color: var(--app-text);
}

.action-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--app-menu-bg);
  border: 1px solid var(--app-border);
  border-radius: 10px;
  box-shadow: 0 4px 16px var(--app-shadow);
  z-index: 100;
  min-width: 160px;
  white-space: nowrap;
  overflow: hidden;
}

.action-menu-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  font-size: 0.95rem;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background 0.15s;
}

.action-menu-item:hover {
  background: var(--app-menu-hover);
}

.action-menu-delete {
  color: var(--app-delete-hover-text);
}

@media (max-width: 767px) {
  .memo-sidebar,
  .memo-main {
    position: absolute;
    inset: 0;
    width: 100%;
  }

  .memo-sidebar {
    border-right: none;
  }

  .mobile-hidden {
    display: none;
  }

  .list-header-bar {
    position: relative;
  }

  .app-title {
    left: 50%;
    transform: translateX(-50%);
  }
}
`
