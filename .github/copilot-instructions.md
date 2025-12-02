# Copilot Instructions - 天気予報アプリ (weatherapp-rr)

日本の都道府県別天気予報アプリ。OpenWeatherMap APIを使用し、SSRで動作する。

## 技術スタック
- **React Router v7** + **React 19** + **Vite** + **TypeScript 5** + **Tailwind CSS v4**
- **pnpm** をパッケージマネージャーとして使用

## 開発コマンド
```bash
pnpm dev          # 開発サーバー起動 (localhost:5173)
pnpm build        # 本番ビルド
pnpm start        # 本番サーバー起動
pnpm typecheck    # 型チェック (react-router typegen && tsc)
```

## 環境変数
`.env` ファイルに `OPENWEATHER_API_KEY` を設定（サーバーサイド専用、`process.env` でアクセス）

## アーキテクチャ

### ディレクトリ構造
```
app/
├── routes/          # ルートファイル（app/routes.ts で設定管理）
├── components/      # 再利用可能UIコンポーネント
├── types/           # TypeScript型定義
└── utils/           # ユーティリティ関数・API呼び出し
```

### データフロー（fetcher パターン）
このプロジェクトでは `useFetcher` + `action` パターンを使用してフォーム送信とデータ取得を行う：

```tsx
// app/routes/home.tsx のパターン
export async function action({ request }: Route.ActionArgs): Promise<ActionResult> {
  const formData = await request.formData();
  const prefecture = formData.get("prefecture") as string;
  const weatherData = await getWeatherData(prefecture);  // サーバーサイドで実行
  return { weatherData, prefecture };
}

export default function Home() {
  const fetcher = useFetcher<ActionResult>();
  const isLoading = fetcher.state !== "idle";
  // fetcher.Form で送信、fetcher.data で結果取得
}
```

### 都道府県→都市名マッピング
`app/utils/weather.ts` の `PREFECTURE_TO_CITY` で日本語都道府県名を英語都市名に変換してAPIに送信

## コンポーネント設計パターン

### ルートコンポーネント
```tsx
import type { Route } from "./+types/[route-name]";

export function meta({}: Route.MetaArgs) { /* SEOメタ情報 */ }
export async function action({}: Route.ActionArgs) { /* データ変更 */ }
export default function RouteName({}: Route.ComponentProps) { /* UI */ }
```

### UIコンポーネント（`app/components/`）
- **関数宣言**を使用（アロー関数よりも推奨）
- Props は interface で型定義
- Tailwind CSS クラスで直接スタイリング
- スケルトンUI（`WeatherCardSkeleton`）でローディング状態を表示

### 型定義（`app/types/weather.ts`）
OpenWeatherMap APIレスポンスの厳密な型定義。新しいAPI統合時は同様のパターンで型を定義する。

## UI/スタイリング規約

### Tailwind CSS パターン
- グラデーション背景: `bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600`
- カード: `bg-white rounded-xl shadow-lg p-6`
- ボタン: `bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 ... focus:ring-2`
- グリッドレイアウト: `grid grid-cols-2 gap-4`

### アクセシビリティ
- `htmlFor` と `id` の紐付け（`PrefectureSelect.tsx` 参照）
- disabled 状態の視覚的フィードバック
- `focus:ring-2 focus:ring-offset-2` でフォーカス表示

## 新機能追加時のガイドライン

### 新しいルート追加
1. `app/routes/[name].tsx` を作成
2. `app/routes.ts` にルートを追加
3. `Route` 型は `./+types/[name]` から自動生成される

### 外部API統合
1. `app/types/` に型定義を追加
2. `app/utils/` にAPI呼び出し関数を追加
3. ルートの `loader` または `action` でサーバーサイド実行

### コンポーネント追加
1. `app/components/` に PascalCase でファイル作成
2. Props interface を定義
3. 名前付きエクスポートを使用

## Docker デプロイ
マルチステージビルドで最適化済み（`Dockerfile` 参照）。本番イメージは `npm run start` で起動。
