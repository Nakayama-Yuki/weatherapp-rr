import type { WeatherData, WeatherError } from "~/types/weather";

// 都道府県名を英語の都市名にマッピング
const PREFECTURE_TO_CITY: Record<string, string> = {
  北海道: "Sapporo",
  青森県: "Aomori",
  岩手県: "Morioka",
  宮城県: "Sendai",
  秋田県: "Akita",
  山形県: "Yamagata",
  福島県: "Fukushima",
  茨城県: "Mito",
  栃木県: "Utsunomiya",
  群馬県: "Maebashi",
  埼玉県: "Saitama",
  千葉県: "Chiba",
  東京都: "Tokyo",
  神奈川県: "Yokohama",
  新潟県: "Niigata",
  富山県: "Toyama",
  石川県: "Kanazawa",
  福井県: "Fukui",
  山梨県: "Kofu",
  長野県: "Nagano",
  岐阜県: "Gifu",
  静岡県: "Shizuoka",
  愛知県: "Nagoya",
  三重県: "Tsu",
  滋賀県: "Otsu",
  京都府: "Kyoto",
  大阪府: "Osaka",
  兵庫県: "Kobe",
  奈良県: "Nara",
  和歌山県: "Wakayama",
  鳥取県: "Tottori",
  島根県: "Matsue",
  岡山県: "Okayama",
  広島県: "Hiroshima",
  山口県: "Yamaguchi",
  徳島県: "Tokushima",
  香川県: "Takamatsu",
  愛媛県: "Matsuyama",
  高知県: "Kochi",
  福岡県: "Fukuoka",
  佐賀県: "Saga",
  長崎県: "Nagasaki",
  熊本県: "Kumamoto",
  大分県: "Oita",
  宮崎県: "Miyazaki",
  鹿児島県: "Kagoshima",
  沖縄県: "Naha",
};

/**
 * 都道府県名から英語の都市名を取得
 */
export function getPrefectureCityName(prefecture: string): string {
  return PREFECTURE_TO_CITY[prefecture] || prefecture;
}

/**
 * OpenWeatherMap APIから天気データを取得
 */
export async function getWeatherData(prefecture: string): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("OpenWeatherMap API key is not configured");
  }

  const cityName = getPrefectureCityName(prefecture);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},JP&appid=${apiKey}&units=metric&lang=ja`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      const error = data as WeatherError;
      throw new Error(`Weather API Error: ${error.message}`);
    }

    return data as WeatherData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch weather data");
  }
}

/**
 * 気温を摂氏から華氏に変換
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * 風速をm/sからkm/hに変換
 */
export function mpsToKmh(mps: number): number {
  return mps * 3.6;
}

/**
 * 天気アイコンのURLを生成
 */
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
