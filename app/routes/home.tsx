import { useState } from "react";
import type { Route } from "./+types/home";
import {
  isRouteErrorResponse,
  useFetcher,
  useRouteError,
} from "react-router";
import { PrefectureSelect } from "~/components/PrefectureSelect";
import { WeatherCard } from "~/components/WeatherCard";
import { ErrorMessage, WeatherCardSkeleton } from "~/components/UIComponents";
import { getWeatherData } from "~/utils/weather";
import type { WeatherData } from "~/types/weather";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "天気予報アプリ" },
    {
      name: "description",
      content: "日本の都道府県の天気情報を確認できるアプリです",
    },
  ];
}

// Action結果の型定義
type ActionResult =
  | { weatherData: WeatherData; prefecture: string }
  | { error: string };

// サーバーサイドでのAction（天気データ取得）
export async function action({
  request,
}: Route.ActionArgs): Promise<ActionResult> {
  const formData = await request.formData();
  const prefecture = formData.get("prefecture") as string;

  if (!prefecture) {
    return { error: "都道府県を選択してください" };
  }

  try {
    const weatherData = await getWeatherData(prefecture);
    return { weatherData, prefecture };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "天気情報の取得に失敗しました";
    return { error: message };
  }
}

export default function Home({}: Route.ComponentProps) {
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>("");
  const fetcher = useFetcher<ActionResult>();

  // fetcherの状態を使用してローディング状態を判定
  const isLoading = fetcher.state !== "idle";

  // エラーリセット機能
  const handleRetry = () => {
    // 選択されている都道府県で再実行
    if (selectedPrefecture) {
      const formData = new FormData();
      formData.append("prefecture", selectedPrefecture);
      fetcher.submit(formData, { method: "post" });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-400 via-blue-500 to-blue-600">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🌤️ 天気予報アプリ
          </h1>
          <p className="text-blue-100 text-lg">
            日本の都道府県の現在の天気情報をチェック
          </p>
        </div>

        {/* 検索フォーム */}
        <fetcher.Form method="post" className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
            <PrefectureSelect
              selectedPrefecture={selectedPrefecture}
              onPrefectureChange={setSelectedPrefecture}
              isLoading={isLoading}
            />

            {/* 隠しフィールドで都道府県を送信 */}
            <input type="hidden" name="prefecture" value={selectedPrefecture} />

            <button
              type="submit"
              disabled={!selectedPrefecture || isLoading}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              {isLoading ? "取得中..." : "天気を確認"}
            </button>
          </div>
        </fetcher.Form>

        {/* 結果表示エリア */}
        <div className="max-w-lg mx-auto">
          {/* スケルトンUI: データ取得中に表示 */}
          {isLoading && <WeatherCardSkeleton />}

          {/* エラーメッセージ */}
          {fetcher.data && "error" in fetcher.data && !isLoading && (
            <ErrorMessage message={fetcher.data.error} onRetry={handleRetry} />
          )}

          {/* 天気データ表示 */}
          {fetcher.data && "weatherData" in fetcher.data && !isLoading && (
            <>
              <WeatherCard weatherData={fetcher.data.weatherData} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
          <h1 className="text-6xl font-bold text-red-500 mb-4">
            {error.status}
          </h1>
          <p className="text-2xl font-semibold text-gray-800 mb-4">
            {error.statusText}
          </p>
          {error.data && (
            <p className="text-gray-600 mb-6">{String(error.data)}</p>
          )}
          <a
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            ホームに戻る
          </a>
        </div>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md">
          <h1 className="text-3xl font-bold text-red-500 mb-4">エラーが発生しました</h1>
          <p className="text-gray-700 mb-4">{error.message}</p>
          {import.meta.env.DEV && (
            <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-48 text-gray-800 mb-4">
              {error.stack}
            </pre>
          )}
          <a
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            ホームに戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">予期しないエラーが発生しました</h1>
        <p className="text-gray-700 mb-6">
          アプリケーションでエラーが発生しました。しばらく待ってからもう一度お試しください。
        </p>
        <a
          href="/"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          ホームに戻る
        </a>
      </div>
    </div>
  );
}
