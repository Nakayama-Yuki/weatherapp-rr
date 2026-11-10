# 天気予報アプリ開発ガイド (weatherapp-rr)

## 守る設計

- React Router v8 の SSR、React、TypeScript、Tailwind v4、OpenWeatherMap API を使用する。パッケージ管理は pnpm。
- ルートは `app/routes.ts` で登録し、画面は `app/routes/home.tsx` に置く。生成される `./+types/home` の Route 型を使う。
- データ取得は `useFetcher` + action。`fetcher.Form` で都道府県を送り、`fetcher.data` にある結果かエラーを表示する。入力検証、例外処理、再試行の導線を保つ。
- 外部 API の呼び出しは `app/utils/weather.ts` に集約する。`PREFECTURE_TO_CITY` の都道府県→都市名マッピング、単位変換、アイコンURLを再利用する。
- `OPENWEATHER_API_KEY` はサーバー側の `process.env` から読む。クライアントへ渡さない。`.env` の読込方法は README を参照する。
- API レスポンス型は `app/types/weather.ts` に定義し、新しい API も同様に型付けする。

## コンポーネント・表示

- UI は `app/components/` に PascalCase のファイル名で配置する。関数宣言を優先し、Props は interface、UI は名前付き export を使用する。
- Tailwind のユーティリティを使い、既存のグラデーション、カード、グリッド、ボタンの一貫性を保つ。
- 取得中は `WeatherCardSkeleton`、失敗時は `ErrorMessage` と再試行を表示する。
- `PrefectureSelect.tsx` の label と入力の関連付け、disabled 表示、キーボードのフォーカス表示を保つ。
- 新しいルートは `app/routes.ts` に登録する。API 処理は loader / action からサーバー側で実行する。

## 検証・実行

```bash
pnpm typecheck
pnpm build
pnpm start
```

`pnpm start` は `dotenv/config` で `.env` を読み込む。開発時は環境変数を明示して起動する（README を参照）。lint・自動テストのスクリプトはない。UI 変更時は都道府県選択・取得中・成功・失敗・再試行を確認し、未実行の確認は理由を報告する。

## Docker

現在の `Dockerfile` は npm と `package-lock.json` を前提にするが、リポジトリのロックファイルは `pnpm-lock.yaml`。そのままデプロイ可能と説明せず、利用前にパッケージ管理とビルド・起動の整合性を検証する。

## 文書の管理

セットアップと使い方は [README.md](README.md) を参照する。開発ルールはこのファイルで管理し、実装・設定・コマンドの変更時は関連する説明も更新する。依存バージョンとスクリプトは `package.json`、詳細設定は各設定ファイルを正とする。
