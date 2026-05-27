import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  function initTheme() {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') {
      isDark.value = saved === 'dark'
    } else {
      // システムの設定に従う
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()

    // システムテーマ変更を監視（ユーザーが手動設定していない場合のみ）
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches
        applyTheme()
      }
    })
  }

  function toggleTheme() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  function applyTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }

  return { isDark, initTheme, toggleTheme }
})
