import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDG4hV0RHn5iWlV0O76blcNLJwFF-mR0eQ",
  authDomain: "memo-list-5469f.firebaseapp.com",
  projectId: "memo-list-5469f",
  storageBucket: "memo-list-5469f.firebasestorage.app",
  messagingSenderId: "1013435294868",
  appId: "1:1013435294868:web:50864bfaea1cae719b8081"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
