import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { registerSW } from 'virtual:pwa-register'

// Service Worker を自動更新モードで登録
registerSW({ immediate: true })

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Firebase の認証状態が確定してからルーターをマウントすることで、
// ページリロード時に onAuthStateChanged が完了する前にルートガードが
// 走って currentUser が null と判定されるレースコンディションを防ぐ
const authStore = useAuthStore()
authStore.initAuth().then(() => {
  app.use(router)
  app.mount('#app')
})
