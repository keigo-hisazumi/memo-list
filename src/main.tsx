import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

const container = document.getElementById('app')!
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
)
