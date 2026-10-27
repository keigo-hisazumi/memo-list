import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useMemo2 } from '@/contexts/MemoContext'
import AppDrawer from '@/components/AppDrawer'
import AppHeader from '@/shared/components/AppHeader'
import EmptyState from '@/shared/components/EmptyState'
import { TrashIcon } from '@/shared/components/Icons'
import { TrashListItem, TrashToolbar } from '@/shared/components/Trash'
import { confirmEmptyTrash, confirmPermanentDelete } from '@/shared/lib/confirm'

export default function TrashView() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const memoStore = useMemo2()
  const trashMemos = memoStore.sortedTrashMemos

  async function handleRestore(id: string) {
    if (!currentUser) return
    await memoStore.restoreMemo(currentUser.uid, id)
  }

  async function handlePermanentDelete(id: string) {
    if (!currentUser) return
    if (confirmPermanentDelete('メモ')) {
      await memoStore.permanentlyDeleteMemo(currentUser.uid, id)
    }
  }

  async function handleEmptyTrash() {
    if (!currentUser || trashMemos.length === 0) return
    if (confirmEmptyTrash('メモ', trashMemos.length)) {
      await memoStore.emptyTrash(currentUser.uid)
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="split-app">
      <div className="split-sidebar split-sidebar--full">
        <AppHeader left={<AppDrawer onLogout={handleLogout} />} title="ゴミ箱" />
        <TrashToolbar count={trashMemos.length} onEmpty={handleEmptyTrash} />
        <div className="list-scroll">
          {trashMemos.length === 0 ? (
            <EmptyState message="ゴミ箱は空です" icon={<TrashIcon size={40} />} />
          ) : (
            trashMemos.map(memo => (
              <TrashListItem
                key={memo.id}
                title={memo.title}
                content={memo.content}
                deletedAt={memo.deletedAt!}
                untitledLabel="無題のメモ"
                onRestore={() => handleRestore(memo.id)}
                onDelete={() => handlePermanentDelete(memo.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
