import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useMemo2 } from '@/contexts/MemoContext'
import DrawerMenu from '@/shared/components/DrawerMenu'
import { DocumentIcon, TrashIcon } from '@/shared/components/Icons'

interface Props {
  onLogout: () => void
}

/** memo-list の画面構成に合わせた項目を渡すドロワーメニュー */
export default function AppDrawer({ onLogout }: Props) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { currentUser } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const trashCount = useMemo2().sortedTrashMemos.length
  const isTrash = pathname === '/trash'

  return (
    <DrawerMenu
      email={currentUser?.email ?? ''}
      isDark={isDark}
      onToggleTheme={toggleTheme}
      onLogout={onLogout}
      items={[
        {
          key: 'all',
          label: 'すべてのノート',
          icon: <DocumentIcon />,
          active: !isTrash,
          onSelect: () => navigate('/'),
        },
        {
          key: 'trash',
          label: 'ゴミ箱',
          icon: <TrashIcon />,
          active: isTrash,
          badge: trashCount,
          onSelect: () => navigate('/trash'),
        },
      ]}
    />
  )
}
