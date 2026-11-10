# 天気予報アプリ 🌤️

OpenWeatherMap API を使用した日本の都道府県別天気予報アプリです。React Router 8、React 19、TailwindCSS v4 を使用して構築されています。

## 機能

- 日本全国の都道府県別天気情報表示
- 🌡️ 現在の気温、体感温度、最高・最低気温
- 💨 風速、湿度、気圧などの詳細情報
- 🌈 直感的で美しい UI/UX
- 📱 レスポンシブデザイン対応
- ⚡️ サーバーサイドレンダリング（SSR）
- リアルタイムデータ取得

## 技術スタック

- **React 19** - 最新の React フレームワーク
- **React Router 8** - フルスタック React フレームワーク
- **TypeScript** - 型安全な開発
- **TailwindCSS v4** - ユーティリティファースト CSS
- **Vite** - 高速ビルドツール
- **OpenWeatherMap API** - 天気データプロバイダー

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/Nakayama-Yuki/weatherapp-rr.git
cd weatherapp-rr
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 環境変数の設定

1. [OpenWeatherMap](https://openweathermap.org/api)で API キーを取得
2. `.env`ファイルを作成し、API キーを設定：

現在 `.env.example` はありません。プロジェクト直下に `.env` を新規作成します：

```
OPENWEATHER_API_KEY=your_api_key_here
```

### 4. 開発サーバーの起動

```bash
node --env-file=.env --run dev
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

## 検証・本番起動

Node.js LTS と pnpm を使用します。依存バージョンとスクリプトは [package.json](package.json) を参照してください。

```bash
pnpm typecheck
pnpm build
pnpm start
```

`pnpm start` は `dotenv/config` で `.env` を読み込みます。開発サーバーでは dotenv の読込を明示していないため、上記の起動例では Node.js の `--env-file` でキーを読み込ませます。`pnpm dev` を直接使う場合は、起動前にシェルの `OPENWEATHER_API_KEY` を設定してください。

lint・自動テストのスクリプトはありません。画面変更時は都道府県選択、取得中、成功、失敗と再試行を確認します。API キーはサーバー側で使用します。

本番ビルドの出力は `build/` です。

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

- API の利用上限は契約プランと利用中の API に応じて確認
- 現在の天気情報を取得
- 日本語での天気説明に対応

## 開発ルール

開発時の指示は [AGENTS.md](AGENTS.md) を参照してください。依存バージョンと実行可能なスクリプトは [package.json](package.json) を正とします。

## Docker の現状

`Dockerfile` は `package-lock.json` と npm を前提にしていますが、現在のリポジトリは `pnpm-lock.yaml` を使用します。そのまま実行できる構成とは扱わず、利用前にパッケージ管理と Dockerfile を揃え、ビルド・起動を確認してください。
