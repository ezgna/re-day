# Repository Guidelines

## プロジェクト構成とモジュール
- `src/app`: Expo Router の画面とレイアウトを配置します。パス名がそのままルートになるため、日付別画面は `src/app/(diary)/[date].tsx` のように明示してください。
- `src/components`: UI スニペットとフォーム要素を共通化する場所です。スタイル付きの複合コンポーネントを追加する際は Story 相当の usage コメントを併記するとレビューが早く進みます。
- `src/database`, `src/hooks`, `src/stores`: `expo-sqlite` のクエリラッパー、カスタムフック、Zustand の状態ロジックを分離しています。永続ストアは `src/stores/*Store.ts` という命名で統一してください。
- `assets/` と `locales/`: アイコン・フォントと `i18n-js` 用 JSON を格納します。`app.config.ts` の `locales` マップも忘れず更新し、画像を追加した際は `expo prebuild` 後のリンクも確認してください。
- `ios/`, `utils/`, `eas.json`: ネイティブ設定、横断的ヘルパー、EAS プロファイルをまとめています。プロファイルごとの差分は `app.config.ts` の `extra.eas` に寄せて管理します。

## ビルド・テスト・開発コマンド
- `npm run start`: Metro バンドラと Expo Dev Tools を起動します。`--clear` を付けてキャッシュ起因のレイアウト崩れを切り分けてください。
- `npm run android` / `npm run ios`: 該当シミュレーターで開発ビルドを生成します。ネイティブの変更を加えたら必ず片方ずつ実行し、`reday` スキームのディープリンクを検証します。
- `npm run web`: Web 版の挙動確認。CSS 差異が出やすいのでコンポーネント追加時は最低 1 回実行してください。
- `npm run lint`: `eslint-config-expo` ベースのルールを適用します。CI ではこれがゲートになるため、未使用 import や暗黙 any を残さないでください。
- `npx eas build --profile production --platform ios|android`: `eas.json` に沿ってストア提出物を生成します。Secrets は EAS ダッシュボード側に設定し、`app.config.ts` へ直書きしないでください。

## コーディングスタイルと命名
- TypeScript かつ `tsconfig.json` の `strict` が有効です。新規ファイルも `.tsx` を前提に型注釈を省略せず、`@/` エイリアスを使って深い相対パスを避けます。
- コンポーネント名は `PascalCase`、フックは `useXxx`、ユーティリティ関数は `camelCase` で統一します。Zustand の selector は `selectXxx` 形式で別関数に切り出しテストしやすくしてください。
- レイアウトは 2 スペースインデント、StyleSheet key は `snake_case` を避け `contentWrapper` のような camelCase を使います。
- 文言は `locales/en.json` と `locales/ja.json` を同時に更新し、キーは `screen.section.element` の 3 階層を推奨します。

## テスト指針
- 現時点で Jest などの自動テストは同梱されていません。クリティカルな状態遷移を追加する場合は `devDependencies` に Jest + React Native Testing Library を導入し、`src/__tests__/ComponentName.test.tsx` という命名で配置してください。
- 手動検証では iOS シミュレーター (iOS 18) と Android エミュレーター (API 34) の両方で新規機能を確認し、通知やローカル DB を扱う場合は実機でも 1 回走らせます。
- 品質ゲートの代替として `npm run lint` と `npx expo-doctor` をコミット前に必ず実行してください。致命的なクラッシュが発生した場合は再現手順と端末情報を issue/PR に添えます。

## コミットと Pull Request ガイドライン
- `git log` から分かる通り `feat(scope): 概要`、`fix(scope): 詳細`、`wip(tag): ...` のように種類+スコープ+要約で書く流儀です。UI 変更は `ui`、設定調整は `settings` など既存スコープを流用してください。
- 1 つのコミットには 1 つの論点だけを含め、Zustand など状態管理の更新があれば `stores:` を含むメッセージでレビュー担当が追跡しやすくします。
- PR には変更概要、テスト結果 (端末名 + コマンド)、関連 issue を箇条書きで記載します。UI 差分がある場合は iOS/Android/Web のスクリーンショットまたは動画を添付し、翻訳更新があれば対象キーを説明してください。
- Draft PR を活用し、`Ready for review` にする前に CI (lint/EAS プレビュー) を通過させます。

## セキュリティと設定の注意
- 機密値は `.env` ではなく Expo の Secrets/EAS Variables に保存し、`expo-env.d.ts` に型を追加してから参照します。
- `app.config.ts` にある `scheme`, `bundleIdentifier`, `package` を変更する場合は必ず該当ストアのメタデータを更新し、`git tag` でバージョン管理します。
- 通知やメール系プラグインを追加する際は `plugins` 配列の順序を維持しつつコメントで理由を残し、`eas update` の前に `npx expo prebuild --clean` で差分を確認してください。
