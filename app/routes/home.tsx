import { useState } from "react";
import type { Route } from "./+types/home";
import { useSubmit, useNavigation } from "react-router";
import { PrefectureSelect } from "~/components/PrefectureSelect";
import { WeatherCard } from "~/components/WeatherCard";
import { LoadingSpinner, ErrorMessage } from "~/components/LoadingSpinner";
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

export default function Home({ actionData }: Route.ComponentProps) {
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const submit = useSubmit();
  const navigation = useNavigation();

  // React Router v7では、useNavigationの動作が異なる可能性があるため、
  // 複数の条件を組み合わせて確認
  const isNavigationLoading =
    navigation.state === "submitting" || navigation.state === "loading";

  // 最終的なローディング状態（手動管理とnavigation状態の両方を考慮）
  const finalIsLoading = isLoading || isNavigationLoading;

  // フォーム送信ハンドラ
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // デフォルトの送信を防ぐ

    if (!selectedPrefecture) {
      return;
    }

    // 手動でローディング状態を設定
    setIsLoading(true);

    // useSubmitを使用してプログラム的に送信
    const formData = new FormData();
    formData.append("prefecture", selectedPrefecture);
    submit(formData, { method: "post" });
  };

  // actionDataが変更された時にローディング状態をリセット
  // （React公式の推奨パターン：レンダー中でのstate調整）
  const [prevActionData, setPrevActionData] = useState(actionData);
  if (actionData !== prevActionData) {
    setPrevActionData(actionData);
    setIsLoading(false);
  }

  // エラーリセット
  const handleRetry = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
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
        <form method="post" action="/" onSubmit={handleSubmit} className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
            <PrefectureSelect
              selectedPrefecture={selectedPrefecture}
              onPrefectureChange={setSelectedPrefecture}
              isLoading={finalIsLoading}
            />

            <button
              type="submit"
              disabled={!selectedPrefecture || finalIsLoading}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              {finalIsLoading ? "取得中..." : "天気を確認"}
            </button>
          </div>
        </form>

        {/* 結果表示エリア */}
        <div className="max-w-lg mx-auto">
          {finalIsLoading && <LoadingSpinner />}

          {actionData && "error" in actionData && (
            <ErrorMessage message={actionData.error} onRetry={handleRetry} />
          )}

          {actionData && "weatherData" in actionData && !finalIsLoading && (
            <WeatherCard weatherData={actionData.weatherData} />
          )}
        </div>

        {/* フッター */}
        <div className="text-center mt-12 text-blue-100">
          <p className="text-sm">天気データ提供: OpenWeatherMap API</p>
        </div>
      </div>
    </div>
  );
}
