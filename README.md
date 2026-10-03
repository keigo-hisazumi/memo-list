# メモリスト - Memo List

React + TypeScript + Firebase + Capacitorで構築されたクロスプラットフォーム対応のメモアプリケーションです。
iOS、Android、Webで動作します。

## デモ

🌐 **GitHub Pages**: https://keigo-hisazumi.github.io/memo-list/

mainブランチへのプッシュ時に自動的にGitHub Pagesにデプロイされます。

## 機能

- ✅ メールアドレス／パスワードによるログイン・新規登録（Firebase Authentication）
- ✅ メモの作成、編集、削除
- ✅ ゴミ箱（復元・完全削除・ゴミ箱を空にする）
- ✅ ピン留め・カテゴリ管理・検索
- ✅ Firestore によるリアルタイム同期（他デバイスでの編集を即時反映）
- ✅ ライト／ダークテーマ切り替え（OS 設定に追従）
- ✅ PWA 対応（スマートフォンへのインストール可）
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

- [React 19](https://react.dev/) - UI ライブラリ（状態管理は React Context）
- [React Router 7](https://reactrouter.com/) - ルーティング
- TypeScript - 型安全な JavaScript
- [Vite](https://vite.dev/) + [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) - ビルドツール / PWA
- [Firebase](https://firebase.google.com/)（Authentication / Firestore）- 認証・データ同期
- [Capacitor](https://capacitorjs.com/) - クロスプラットフォームネイティブランタイム

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

### Lint

```bash
# ESLint によるチェック
npm run lint

# 自動修正
npm run lint:fix
```

PR 作成時は GitHub Actions の CI（Lint / 型チェック / ビルド）が自動で実行されます。

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
├── components/            # UI コンポーネント
│   ├── HamburgerMenu.tsx  # メニュー（テーマ切り替え・ゴミ箱・ログアウト）
│   ├── MemoList.tsx       # メモ一覧
│   └── MemoEditor.tsx     # メモ編集
├── contexts/              # React Context（状態管理）
│   ├── AuthContext.tsx    # 認証状態
│   ├── MemoContext.tsx    # メモの購読・CRUD
│   └── ThemeContext.tsx   # テーマ
├── types/
│   └── memo.ts            # メモの型定義
├── views/                 # ページ
│   ├── LoginView.tsx      # ログイン / 新規登録
│   ├── MemoView.tsx       # メイン画面
│   └── TrashView.tsx      # ゴミ箱
├── firebase.ts            # Firebase 初期化
├── theme.ts               # テーマ解決・適用（描画前に適用してちらつきを防止）
├── App.tsx                # ルーティング
└── main.tsx               # エントリーポイント
```

Firestore のセキュリティルールは `firestore.rules` で管理しています（`users/{userId}/memos/{memoId}` を本人のみ読み書き可）。

## 使い方

1. **ログイン**: メールアドレスとパスワードでログイン（初回は新規登録）
2. **メモの作成**: 「新規作成」ボタンをクリック
3. **メモの編集**: リストからメモを選択して編集
4. **メモの削除**: 削除したメモはゴミ箱へ移動し、ゴミ箱から復元・完全削除できます
5. **カテゴリ設定**: 編集画面でカテゴリを入力

## 開発ルール

開発ルールの正本は [`AGENTS.md`](./AGENTS.md) です。コントリビューション手順は [`CONTRIBUTING.md`](./CONTRIBUTING.md)、脆弱性の報告方法は [`SECURITY.md`](./SECURITY.md) を参照してください。

## ライセンス

MIT
