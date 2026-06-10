import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth } from '@/firebase'

interface AuthContextValue {
  currentUser: User | null
  isAuthReady: boolean
  register: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    unsubscribeRef.current = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setIsAuthReady(true)
    })
    return () => unsubscribeRef.current?.()
  }, [])

  async function register(email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    setCurrentUser(credential.user)
  }

  async function login(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    setCurrentUser(credential.user)
  }

  async function logout() {
    await signOut(auth)
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, isAuthReady, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
