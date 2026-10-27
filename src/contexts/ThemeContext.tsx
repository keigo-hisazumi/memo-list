import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { resolveInitialTheme, saveTheme, watchSystemTheme } from '@/shared/theme'

interface ThemeContextValue {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // テーマは描画前に main.tsx で適用済みのため、初期値は同じ解決ロジックから取得する。
  // これにより初期描画時のちらつき（FOUC）を防ぐ。
  const [isDark, setIsDark] = useState(resolveInitialTheme)

  useEffect(() => watchSystemTheme(setIsDark), [])

  function toggleTheme() {
    const next = !isDark
    setIsDark(next)
    saveTheme(next)
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
