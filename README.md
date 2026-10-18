# memo-list

メモを作成・整理し、Firebase で複数の端末に同期するメモアプリ「メモリスト」です。PWA として Web で動作し、Capacitor で iOS / Android アプリとしてもビルドできます。

**公開 URL**: <https://keigo-hisazumi.github.io/memo-list/>

## 主な機能

- メールアドレスとパスワードによるログイン・新規登録
- メモの作成・編集・削除
- ゴミ箱（復元・完全削除・ゴミ箱を空にする）
- ピン留め（ピン留めしたメモを一覧の先頭に表示）
- カテゴリの設定とメモの検索
- 他の端末での編集をリアルタイムに反映
- ライト / ダークテーマの切り替え（OS の設定に追従）
- PWA 対応（スマートフォンのホーム画面に追加可能）
- iOS / Android / Web のクロスプラットフォーム対応

## 使い方

1. メールアドレスとパスワードでログインする（初回は新規登録）
2. 「新規作成」ボタンでメモを作成する
3. 一覧からメモを選択して編集する（編集画面でカテゴリを入力できる）
4. 削除したメモはゴミ箱へ移動し、ゴミ箱から復元・完全削除できる

## スクリーンショット

### デスクトップ表示

![メモ一覧](https://github.com/user-attachments/assets/fdc0e6cb-6206-4400-ae83-723c16a8a294)

### メモ編集

![メモ編集](https://github.com/user-attachments/assets/320b5eb4-2ed5-47d7-b107-76aba5b169a8)

### 新規メモ作成

![新規作成](https://github.com/user-attachments/assets/9d33894f-3916-4273-bed5-e4c1269689f5)

### モバイル表示

![モバイル](https://github.com/user-attachments/assets/cc272164-18e1-4c94-95ad-d77cd6746eb0)

## Firestore のデータとセキュリティルール

メモは Firestore の `users/{userId}/memos/{memoId}` に保存します。セキュリティルールは `firestore.rules` で管理しており、ログイン中の本人だけが自分のメモを読み書きできます。

## モバイルアプリのビルド

Capacitor でネイティブアプリをビルドします（`capacitor.config.ts` の `webDir` は `dist`）。

### iOS

macOS と Xcode が必要です。

```bash
npm run cap:add:ios     # iOS プラットフォームの追加（初回のみ）
npm run cap:sync        # ビルドとネイティブプロジェクトへの同期
npm run cap:open:ios    # Xcode で開く
```

### Android

Android Studio と Android SDK が必要です。

```bash
npm run cap:add:android   # Android プラットフォームの追加（初回のみ）
npm run cap:sync          # ビルドとネイティブプロジェクトへの同期
npm run cap:open:android  # Android Studio で開く
```

## 技術スタック

- TypeScript
- React（状態管理は React Context）
- React Router
- Vite
- vite-plugin-pwa（PWA）
- Firebase（Authentication / Cloud Firestore）
- Capacitor（iOS / Android）
- GitHub Pages（ホスティング）

## 開発

### 必要な環境

- Node.js 22（`package.json` の `engines` は `^20.19.0 || >=22.12.0`）

### コマンド

```bash
npm ci               # 依存関係のインストール
npm run dev          # 開発サーバーを起動
npm run build        # 型チェックと dist/ への本番ビルドを並列実行
npm run build-only   # 型チェックなしで dist/ に本番ビルド
npm run preview      # ビルド結果をプレビュー
npm run type-check   # TypeScript の型チェック
npm run lint         # ESLint
npm run lint:fix     # ESLint の自動修正
```

## ディレクトリ構成

```text
src/
  main.tsx          エントリーポイント
  App.tsx           ルーティング（ログイン必須ページの制御）
  firebase.ts       Firebase（Authentication / Firestore）の初期化
  theme.ts          テーマの解決・適用（描画前に適用してちらつきを防止）
  views/            画面（ログイン / 新規登録・メイン画面・ゴミ箱）
  components/       メモ一覧・メモ編集・メニュー（テーマ切り替え・ゴミ箱・ログアウト）
  contexts/         認証状態・メモの購読と CRUD・テーマの Context
  types/            メモの型定義
  assets/           スタイル
public/             favicon と PWA 用アイコン
firestore.rules     Firestore のセキュリティルール
capacitor.config.ts Capacitor の設定
vite.config.ts      Vite と PWA の設定（GitHub Pages 用の base パス）
```

## デプロイ

- `main` への PR マージ時に `.github/workflows/deploy.yml` が GitHub Pages（`gh-pages` ブランチ）へデプロイします
- PR ごとに `.github/workflows/pr-preview.yml` がプレビューを `gh-pages` の `pr-<番号>/` に公開し、PR に URL をコメントします（プレビューでは Service Worker を無効化、PR を閉じると削除）

## 開発ルール

開発ルールは [AGENTS.md](./AGENTS.md) を参照してください。
貢献の手順は [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## ライセンス

MIT
