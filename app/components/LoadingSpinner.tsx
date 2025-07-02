/**
 * ローディングスピナーコンポーネント
 */
export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-gray-600">天気情報を取得中...</span>
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
        <div className="flex-shrink-0">
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
