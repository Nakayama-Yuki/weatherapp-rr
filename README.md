# 天気予報アプリ 🌤️

OpenWeatherMap API を使用した日本の都道府県別天気予報アプリです。React Router 7、React 19、TailwindCSS v4 を使用して構築されています。

## 機能

- � 日本全国の都道府県別天気情報表示
- 🌡️ 現在の気温、体感温度、最高・最低気温
- 💨 風速、湿度、気圧などの詳細情報
- 🌈 直感的で美しい UI/UX
- 📱 レスポンシブデザイン対応
- ⚡️ サーバーサイドレンダリング（SSR）
- � リアルタイムデータ取得

## 技術スタック

- **React 19** - 最新の React フレームワーク
- **React Router 7** - フルスタック React フレームワーク
- **TypeScript 5** - 型安全な開発
- **TailwindCSS v4** - ユーティリティファースト CSS
- **Vite** - 高速ビルドツール
- **OpenWeatherMap API** - 天気データプロバイダー

## セットアップ

### 1. リポジトリのクローン

```bash
git clone <your-repo-url>
cd weatherapp-rr
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 環境変数の設定

1. [OpenWeatherMap](https://openweathermap.org/api)で API キーを取得
2. `.env`ファイルを作成し、API キーを設定：

```bash
cp .env.example .env
```

`.env`ファイルを編集：

```
OPENWEATHER_API_KEY=your_api_key_here
```

### 4. 開発サーバーの起動

```bash
pnpm dev
```

アプリケーションは `http://localhost:5173` で利用できます。

## 使い方

1. トップページで都道府県を選択
2. 「天気を確認」ボタンをクリック
3. 選択した都道府県の詳細な天気情報が表示されます

表示される情報：

- 現在の気温と天気状況
- 体感温度
- 最高・最低気温
- 湿度、気圧
- 風速
- 天気アイコン

## 本番環境でのビルド

```bash
pnpm build
```

## プロジェクト構造

```
app/
├── components/          # 再利用可能なReactコンポーネント
│   ├── WeatherCard.tsx  # 天気情報表示カード
│   ├── PrefectureSelect.tsx # 都道府県選択ドロップダウン
│   └── UIComponents.tsx     # ローディング・エラー表示
├── routes/              # ページルート
│   └── home.tsx         # メインページ
├── types/               # TypeScript型定義
│   └── weather.ts       # 天気関連の型
├── utils/               # ユーティリティ関数
│   └── weather.ts       # 天気API関連のヘルパー
└── root.tsx            # アプリケーションルート
```

## API について

このアプリケーションは[OpenWeatherMap API](https://openweathermap.org/api)を使用しています。

- 無料プランで 1 日 1000 回まで利用可能
- 現在の天気情報を取得
- 日本語での天気説明に対応
