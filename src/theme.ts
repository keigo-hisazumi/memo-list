/**
 * テーマ（ライト/ダーク）の解決と適用を担うユーティリティ。
 *
 * React の描画前に同期的にテーマを適用できるよう、ThemeContext から
 * ロジックを切り出している。これにより初期描画時のちらつき（FOUC）を防ぐ。
 */

/** localStorage と OS 設定から初期テーマ（ダークかどうか）を解決する */
export function resolveInitialTheme(): boolean {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') {
    return saved === 'dark'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** html 要素に light/dark クラスを適用する */
export function applyTheme(isDark: boolean): void {
  if (isDark) {
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
  } else {
    document.documentElement.classList.add('light')
    document.documentElement.classList.remove('dark')
  }
}

/** トランジション付きでテーマを適用する（ユーザー操作時に使用） */
export function applyThemeWithTransition(isDark: boolean): void {
  document.documentElement.classList.add('theme-transitioning')
  applyTheme(isDark)
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning')
  }, 400)
}
