import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { MemoProvider, useMemo2 } from '@/contexts/MemoContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import LoginView from '@/views/LoginView'
import MemoView from '@/views/MemoView'
import TrashView from '@/views/TrashView'

const base = import.meta.env.BASE_URL

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthReady } = useAuth()
  if (!isAuthReady) return null
  if (!currentUser) return <Navigate to="/login" replace />
  return <>{children}</>
}

function RequireGuest({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthReady } = useAuth()
  if (!isAuthReady) return null
  if (currentUser) return <Navigate to="/" replace />
  return <>{children}</>
}

function MemoSubscriber({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth()
  const { subscribeToMemos, unsubscribeFromMemos } = useMemo2()

  useEffect(() => {
    if (currentUser) {
      subscribeToMemos(currentUser.uid)
    } else {
      unsubscribeFromMemos()
    }
  }, [currentUser?.uid])

  return <>{children}</>
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MemoProvider>
          <MemoSubscriber>
            <BrowserRouter basename={base}>
              <Routes>
                <Route path="/login" element={
                  <RequireGuest><LoginView /></RequireGuest>
                } />
                <Route path="/" element={
                  <RequireAuth><MemoView /></RequireAuth>
                } />
                <Route path="/memo/:id" element={
                  <RequireAuth><MemoView /></RequireAuth>
                } />
                <Route path="/trash" element={
                  <RequireAuth><TrashView /></RequireAuth>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </MemoSubscriber>
        </MemoProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
