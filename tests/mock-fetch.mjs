process.env.OPENWEATHER_API_KEY = "e2e-only-key";
import { setTimeout } from "node:timers/promises";

const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
  if (url.hostname !== "api.openweathermap.org") return originalFetch(input, init);
  if (url.pathname !== "/data/2.5/weather") throw new Error(`Unexpected test API request: ${url}`);
  await setTimeout(250);
  if (url.searchParams.get("q") !== "Tokyo,JP") return Response.json({ message: "city not found" }, { status: 404 });
  return Response.json({
    name: "Tokyo", dt: 1700000000, weather: [{ icon: "01d", description: "晴れ" }],
    main: { temp: 22, feels_like: 21, humidity: 60, pressure: 1013, temp_min: 19, temp_max: 24 },
    wind: { speed: 3 },
  });
};
