import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { registerSW } from 'virtual:pwa-register'
import { resolveInitialTheme, applyTheme } from './theme'

// React の描画前にテーマを適用し、初期描画時のちらつき（FOUC）を防ぐ
applyTheme(resolveInitialTheme())

registerSW({ immediate: true })

const container = document.getElementById('app')!
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
)
