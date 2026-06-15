import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const base = process.env.VITE_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/memo-list/' : '/')

// PR プレビューはすべて同一オリジン（/memo-list/ 配下）に配信されるため、
// Service Worker を有効にすると本番用 SW（スコープ /memo-list/）がプレビューの
// ナビゲーションを横取りし、本番の画面が表示されてしまう。プレビュービルドでは
// 自己破棄する SW を生成して登録済み SW・キャッシュを掃除し、本番 SW 側では
// プレビューパスをナビゲーションフォールバックの対象外にすることで競合を防ぐ。
const disablePWA = process.env.VITE_DISABLE_PWA === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      selfDestroying: disablePWA,
      registerType: 'autoUpdate',
      base,
      includeAssets: ['favicon.ico', 'icon.svg', 'apple-touch-icon.png', 'icons/*.png'],
      manifest: {
        name: 'メモリスト - Memo List',
        short_name: 'メモリスト',
        description: 'シンプルで使いやすいメモアプリ',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: base,
        scope: base,
        lang: 'ja',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // 本番 SW（スコープ /memo-list/）が PR プレビュー（/memo-list/pr-N/）への
        // ナビゲーションを本番のアプリシェルで肩代わりしないようにする。
        navigateFallbackDenylist: [/^\/memo-list\/pr-\d+\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  base,
})
