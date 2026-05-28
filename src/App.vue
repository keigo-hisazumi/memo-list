<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMemoStore } from '@/stores/memo'
import { useThemeStore } from '@/stores/theme'

const authStore = useAuthStore()
const memoStore = useMemoStore()
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})

watch(
  () => authStore.currentUser,
  (user) => {
    if (user) {
      memoStore.subscribeToMemos(user.uid)
    } else {
      memoStore.unsubscribeFromMemos()
    }
  },
  { immediate: true }
)
</script>

<template>
  <RouterView />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', 'Noto Sans CJK JP', 'Noto Sans JP', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', Meiryo, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}
</style>
