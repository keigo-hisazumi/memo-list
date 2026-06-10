import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface ThemeContextValue {
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    let dark: boolean
    if (saved === 'dark' || saved === 'light') {
      dark = saved === 'dark'
    } else {
      dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    setIsDark(dark)
    applyTheme(dark)

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

  function applyTheme(dark: boolean) {
    if (dark) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }

  function applyThemeWithTransition(dark: boolean) {
    document.documentElement.classList.add('theme-transitioning')
    applyTheme(dark)
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
    }, 400)
  }

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
