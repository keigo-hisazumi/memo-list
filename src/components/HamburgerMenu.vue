<template>
  <div class="hamburger-menu" ref="menuRef">
    <!-- ハンバーガーボタン -->
    <button
      class="hamburger-btn"
      :class="{ open: isOpen }"
      @click="toggleMenu"
      aria-label="メニューを開く"
    >
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>

    <!-- オーバーレイ -->
    <Transition name="fade">
      <div v-if="isOpen" class="menu-overlay" @click="closeMenu"></div>
    </Transition>

    <!-- ドロップダウンメニュー -->
    <Transition name="slide-down">
      <div v-if="isOpen" class="menu-dropdown">

        <!-- アカウント情報 -->
        <div class="menu-account">
          <div class="account-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <span class="account-name">{{ authStore.currentUser?.email }}</span>
        </div>

        <div class="menu-divider"></div>

        <!-- テーマ切り替え -->
        <button class="menu-item" @click="handleThemeToggle">
          <span class="menu-item-icon">
            <!-- ダークモード時: 太陽アイコン / ライトモード時: 月アイコン -->
            <svg v-if="themeStore.isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </span>
          <span>{{ themeStore.isDark ? 'ライトモード' : 'ダークモード' }}</span>
        </button>

        <div class="menu-divider"></div>

        <!-- ログアウト -->
        <button class="menu-item logout-item" @click="handleLogout">
          <span class="menu-item-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          <span>ログアウト</span>
        </button>

      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const emit = defineEmits<{
  logout: []
}>()

const authStore = useAuthStore()
const themeStore = useThemeStore()

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function closeMenu() {
  isOpen.value = false
}

function handleThemeToggle() {
  themeStore.toggleTheme()
  closeMenu()
}

function handleLogout() {
  closeMenu()
  emit('logout')
}

// メニュー外クリックで閉じる
function handleClickOutside(event: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.hamburger-menu {
  position: relative;
  z-index: 100;
}

/* ハンバーガーボタン */
.hamburger-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  padding: 6px;
  transition: background 0.2s;
}

.hamburger-btn:hover {
  background: var(--app-menu-hover);
}

.bar {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--app-text-secondary);
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.25s ease;
  transform-origin: center;
}

/* バーのX変形アニメーション */
.hamburger-btn.open .bar:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger-btn.open .bar:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger-btn.open .bar:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* オーバーレイ */
.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 99;
}

/* ドロップダウンメニュー */
.menu-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 240px;
  background: var(--app-menu-bg);
  border: 1px solid var(--app-border);
  border-radius: 10px;
  box-shadow: 0 8px 24px var(--app-menu-shadow);
  overflow: hidden;
  z-index: 200;
}

/* アカウント情報 */
.menu-account {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
}

.account-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--app-header-bg);
  border: 1px solid var(--app-border);
  border-radius: 50%;
  color: var(--app-accent);
  flex-shrink: 0;
}

.account-name {
  font-size: 0.85rem;
  color: var(--app-text);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
}

/* 区切り線 */
.menu-divider {
  height: 1px;
  background: var(--app-border);
  margin: 0;
}

/* メニューアイテム */
.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--app-text-secondary);
  text-align: left;
  transition: background 0.15s, color 0.15s;
  font-family: inherit;
}

.menu-item:hover {
  background: var(--app-menu-hover);
  color: var(--app-text);
}

.menu-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  flex-shrink: 0;
  color: var(--app-text-muted);
  transition: color 0.15s;
}

.menu-item:hover .menu-item-icon {
  color: var(--app-text-secondary);
}

/* ログアウトボタン */
.logout-item:hover {
  color: var(--app-logout-hover-text);
}

.logout-item:hover .menu-item-icon {
  color: var(--app-logout-hover-text);
}

/* トランジション */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-down-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
