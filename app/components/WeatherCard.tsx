import type { WeatherData } from "~/types/weather";
import { getWeatherIconUrl, mpsToKmh } from "~/utils/weather";

interface WeatherCardProps {
  weatherData: WeatherData;
}

/**
 * 天気情報を表示するカードコンポーネント
 */
export function WeatherCard({ weatherData }: WeatherCardProps) {
  const weather = weatherData.weather[0];
  const main = weatherData.main;

  // 日時をフォーマット
  const updatedAt = new Date(weatherData.dt * 1000).toLocaleString("ja-JP");

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      {/* ヘッダー */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {weatherData.name}
        </h2>
        <p className="text-sm text-gray-600">更新日時: {updatedAt}</p>
      </div>

      {/* メイン天気情報 */}
      <div className="flex items-center justify-center mb-6">
        <img
          src={getWeatherIconUrl(weather.icon)}
          alt={weather.description}
          className="w-16 h-16 mr-4"
        />
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-800">
            {Math.round(main.temp)}°C
          </p>
          <p className="text-lg text-gray-600 capitalize">
            {weather.description}
          </p>
        </div>
      </div>

      {/* 詳細情報 */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-blue-600 font-semibold mb-1">体感温度</p>
          <p className="text-gray-800 text-lg">
            {Math.round(main.feels_like)}°C
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-green-600 font-semibold mb-1">湿度</p>
          <p className="text-gray-800 text-lg">{main.humidity}%</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-3">
          <p className="text-yellow-600 font-semibold mb-1">気圧</p>
          <p className="text-gray-800 text-lg">{main.pressure} hPa</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-3">
          <p className="text-purple-600 font-semibold mb-1">風速</p>
          <p className="text-gray-800 text-lg">
            {Math.round(mpsToKmh(weatherData.wind?.speed || 0))} km/h
          </p>
        </div>
      </div>

      {/* 最高/最低気温 */}
      <div className="mt-6 flex justify-between items-center bg-gray-50 rounded-lg p-3">
        <div className="text-center">
          <p className="text-blue-600 font-semibold text-sm">最低気温</p>
          <p className="text-gray-800 text-lg">{Math.round(main.temp_min)}°C</p>
        </div>
        <div className="text-center">
          <p className="text-red-600 font-semibold text-sm">最高気温</p>
          <p className="text-gray-800 text-lg">{Math.round(main.temp_max)}°C</p>
        </div>
      </div>
    </div>
  );
}
