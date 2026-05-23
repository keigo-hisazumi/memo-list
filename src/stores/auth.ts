import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth } from '@/firebase'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const isAuthReady = ref(false)

  function initAuth(): Promise<void> {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        currentUser.value = user
        if (!isAuthReady.value) {
          isAuthReady.value = true
          resolve()
        }
      })
    })
  }

  async function register(email: string, password: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    currentUser.value = credential.user
  }

  async function login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    currentUser.value = credential.user
  }

  async function logout(): Promise<void> {
    await signOut(auth)
    currentUser.value = null
  }

  return {
    currentUser,
    isAuthReady,
    initAuth,
    register,
    login,
    logout
  }
})
