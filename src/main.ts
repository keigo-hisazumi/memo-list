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
app.use(router)

const authStore = useAuthStore()
authStore.initAuth().then(() => {
  app.mount('#app')
})
