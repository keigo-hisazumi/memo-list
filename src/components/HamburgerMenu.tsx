import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'

interface Props {
  onLogout: () => void
}

export default function HamburgerMenu({ onLogout }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  function closeMenu() { setIsOpen(false) }

  function handleAllNotes() {
    closeMenu()
    navigate('/')
  }

  function handleTrash() {
    closeMenu()
    navigate('/trash')
  }

  function handleLogout() {
    closeMenu()
    onLogout()
  }

  return (
    <div className="hamburger-menu">
      <button
        className={`hamburger-btn${isOpen ? ' open' : ''}`}
        onClick={() => setIsOpen(o => !o)}
        aria-label="メニューを開く"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {isOpen && (
        <div className="menu-overlay" onClick={closeMenu} />
      )}

      <div className={`menu-drawer${isOpen ? ' menu-drawer-open' : ''}`} role="dialog" aria-modal="true">
        <div className="menu-account">
          <div className="account-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <span className="account-name">{currentUser?.email}</span>
        </div>

        <div className="menu-divider"></div>

        <button className="menu-item" onClick={handleAllNotes}>
          <span className="menu-item-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </span>
          <span>すべてのノート</span>
        </button>

        <div className="menu-divider"></div>

        <button className="menu-item" onClick={handleTrash}>
          <span className="menu-item-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </span>
          <span>ゴミ箱</span>
        </button>

        <div className="menu-spacer"></div>

        <div className="menu-divider"></div>

        <button className="menu-item" onClick={toggleTheme}>
          <span className="menu-item-icon">
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
          </span>
          <span>{isDark ? 'ダークモード' : 'ライトモード'}</span>
        </button>

        <div className="menu-divider"></div>

        <button className="menu-item logout-item" onClick={handleLogout}>
          <span className="menu-item-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          <span>ログアウト</span>
        </button>
      </div>

      <style>{styles}</style>
    </div>
  )
}

const styles = `
.hamburger-menu {
  position: relative;
  z-index: 100;
}

.hamburger-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  padding: 6px;
  transition: background 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.hamburger-btn:hover {
  background: var(--app-menu-hover);
}

.bar {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--app-accent);
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.25s ease;
  transform-origin: center;
}

.hamburger-btn.open .bar:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger-btn.open .bar:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger-btn.open .bar:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.menu-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  max-width: 80vw;
  background: var(--app-menu-bg);
  border-right: 1px solid var(--app-border);
  box-shadow: 4px 0 20px var(--app-menu-shadow);
  z-index: 300;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-bottom: env(safe-area-inset-bottom);
  transform: translateX(-100%);
  transition: transform 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.menu-drawer-open {
  transform: translateX(0);
}

.menu-account {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.25rem;
  cursor: default;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.account-name {
  font-size: 0.85rem;
  color: var(--app-text);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
}

.account-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--app-accent);
  border: 1px solid var(--app-accent);
  border-radius: 50%;
  color: #ffffff;
  flex-shrink: 0;
}

.menu-spacer {
  flex: 1;
}

.menu-divider {
  height: 1px;
  background: var(--app-border);
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.9rem 1.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--app-text-secondary);
  text-align: left;
  transition: background 0.15s, color 0.15s;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
}

.menu-item:hover {
  background: var(--app-menu-hover);
  color: var(--app-text);
}

.menu-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  flex-shrink: 0;
  color: var(--app-text-muted);
  transition: color 0.15s;
}

.menu-item:hover .menu-item-icon {
  color: var(--app-text-secondary);
}

.logout-item:hover {
  color: var(--app-logout-hover-text);
}

.logout-item:hover .menu-item-icon {
  color: var(--app-logout-hover-text);
}
`
