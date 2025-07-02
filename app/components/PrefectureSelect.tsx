import type { Prefecture } from "~/types/weather";

interface PrefectureSelectProps {
  selectedPrefecture: string;
  onPrefectureChange: (prefecture: string) => void;
  isLoading?: boolean;
}

// 日本の都道府県リスト
const PREFECTURES: Prefecture[] = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];

/**
 * 都道府県選択用のドロップダウンコンポーネント
 */
export function PrefectureSelect({
  selectedPrefecture,
  onPrefectureChange,
  isLoading = false,
}: PrefectureSelectProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <label
        htmlFor="prefecture-select"
        className="block text-sm font-medium text-gray-700 mb-2">
        都道府県を選択してください
      </label>
      <select
        id="prefecture-select"
        value={selectedPrefecture}
        onChange={(e) => onPrefectureChange(e.target.value)}
        disabled={isLoading}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-900">
        <option value="">都道府県を選択</option>
        {PREFECTURES.map((prefecture) => (
          <option key={prefecture} value={prefecture}>
            {prefecture}
          </option>
        ))}
      </select>
    </div>
  );
}
