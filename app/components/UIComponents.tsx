/**
 * 天気カード用スケルトンUIコンポーネント
 */
export function WeatherCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
      {/* ヘッダー部分 */}
      <div className="text-center mb-6">
        <div className="h-8 bg-gray-200 rounded-md w-3/4 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/2 mx-auto"></div>
      </div>

      {/* 天気アイコンと温度 */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
        <div>
          <div className="h-10 bg-gray-200 rounded-md w-20 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-16"></div>
        </div>
      </div>

      {/* 詳細情報 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
          <div className="h-6 bg-gray-200 rounded-md w-3/4 mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
          <div className="h-6 bg-gray-200 rounded-md w-3/4 mx-auto"></div>
        </div>
      </div>

      {/* 追加情報 */}
      <div className="mt-6 space-y-2">
        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
        <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded-md w-4/5"></div>
      </div>
    </div>
  );
}

/**
 * エラーメッセージコンポーネント
 */
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
      <div className="flex items-center">
        <div className="shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-800">{message}</p>
        </div>
      </div>
      {onRetry && (
        <div className="mt-3">
          <button
            onClick={onRetry}
            className="text-sm bg-red-100 text-red-800 px-3 py-2 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500">
            再試行
          </button>
        </div>
      )}
    </div>
  );
}
