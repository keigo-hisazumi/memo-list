import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { resolveInitialTheme, applyThemeWithTransition } from '@/theme'

interface ThemeContextValue {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // テーマは描画前に main.tsx で適用済みのため、初期値は同じ解決ロジックから取得する。
  // これにより初期描画時のちらつき（FOUC）を防ぐ。
  const [isDark, setIsDark] = useState(resolveInitialTheme)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    function onSystemChange(e: MediaQueryListEvent) {
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches)
        applyThemeWithTransition(e.matches)
      }
    }
    mq.addEventListener('change', onSystemChange)
    return () => mq.removeEventListener('change', onSystemChange)
  }, [])

  function toggleTheme() {
    setIsDark(prev => {
      const next = !prev
      localStorage.setItem('theme', next ? 'dark' : 'light')
      applyThemeWithTransition(next)
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
