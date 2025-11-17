# メモリスト - Memo List

Vue.js + TypeScript + Capacitorで構築されたクロスプラットフォーム対応のメモアプリケーションです。
iOS、Android、Webで動作します。

## デモ

🌐 **GitHub Pages**: https://keigo-hisazumi.github.io/memo-list/

mainブランチへのプッシュ時に自動的にGitHub Pagesにデプロイされます。

## 機能

- ✅ メモの作成、編集、削除
- ✅ カテゴリ管理
- ✅ リアルタイム更新
- ✅ レスポンシブデザイン（モバイル対応）
- ✅ TypeScriptによる型安全性
- ✅ Piniaによる状態管理
- ✅ クロスプラットフォーム対応（iOS/Android/Web）

## スクリーンショット

### デスクトップ表示
![メモ一覧](https://github.com/user-attachments/assets/fdc0e6cb-6206-4400-ae83-723c16a8a294)

### メモ編集
![メモ編集](https://github.com/user-attachments/assets/320b5eb4-2ed5-47d7-b107-76aba5b169a8)

### 新規メモ作成
![新規作成](https://github.com/user-attachments/assets/9d33894f-3916-4273-bed5-e4c1269689f5)

### モバイル表示
![モバイル](https://github.com/user-attachments/assets/cc272164-18e1-4c94-95ad-d77cd6746eb0)

## 技術スタック

- **Vue 3** - プログレッシブJavaScriptフレームワーク
- **TypeScript** - 型安全なJavaScript
- **Vite** - 高速なビルドツール
- **Pinia** - Vue 3用の状態管理ライブラリ
- **Vue Router** - 公式ルーター
- **Capacitor** - クロスプラットフォームネイティブランタイム

## セットアップ

### 必要な環境

- Node.js 20.19.0以上または22.12.0以上
- npm 10.x以上

### インストール

```bash
# 依存関係のインストール
npm install
```

### 開発

```bash
# 開発サーバーの起動
npm run dev

# ブラウザで http://localhost:5173/ を開く
```

### ビルド

```bash
# プロダクション向けビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

### 型チェック

```bash
# TypeScriptの型チェック
npm run type-check
```

## デプロイメント

### GitHub Pages

このプロジェクトは、mainブランチへのプッシュ時に自動的にGitHub Pagesにデプロイされます。

デプロイプロセス：
1. mainブランチへコードをプッシュ
2. GitHub Actionsが自動的にビルドを実行
3. ビルド成果物がGitHub Pagesにデプロイされる

**公開URL**: https://keigo-hisazumi.github.io/memo-list/

**注意**: 初回デプロイ時は、GitHubリポジトリの設定でGitHub Pagesを有効にする必要があります：
1. リポジトリの「Settings」→「Pages」を開く
2. Sourceで「GitHub Actions」を選択

## モバイルアプリのビルド

### iOS

```bash
# iOSプラットフォームの追加（初回のみ）
npm run cap:add:ios

# ビルドとプロジェクトの同期
npm run cap:sync

# Xcodeで開く
npm run cap:open:ios
```

**必要な環境:**
- macOS
- Xcode 14以上
- CocoaPods

### Android

```bash
# Androidプラットフォームの追加（初回のみ）
npm run cap:add:android

# ビルドとプロジェクトの同期
npm run cap:sync

# Android Studioで開く
npm run cap:open:android
```

**必要な環境:**
- Android Studio
- Android SDK

## プロジェクト構成

```
src/
├── components/        # Vueコンポーネント
│   ├── MemoList.vue   # メモ一覧コンポーネント
│   └── MemoEditor.vue # メモ編集コンポーネント
├── stores/            # Piniaストア
│   └── memo.ts        # メモストア（状態管理）
├── types/             # TypeScript型定義
│   └── memo.ts        # メモの型定義
├── views/             # ページビュー
│   └── MemoView.vue   # メインビュー
├── router/            # Vue Router設定
│   └── index.ts       # ルーター設定
├── App.vue            # ルートコンポーネント
└── main.ts            # エントリーポイント
```

## 使い方

1. **メモの作成**: 「新規作成」ボタンをクリック
2. **メモの編集**: リストからメモを選択して編集
3. **メモの削除**: 編集画面でゴミ箱アイコンをクリック
4. **カテゴリ設定**: 編集画面でカテゴリを入力

## モックデータ

アプリケーションには以下のカテゴリのサンプルメモが含まれています：
- 日常
- 仕事
- 学習
- 趣味

## ライセンス

MIT
