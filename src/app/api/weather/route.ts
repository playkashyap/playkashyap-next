// app/api/weather/route.ts
import { NextResponse } from "next/server";

const API = "https://api.openweathermap.org/data/2.5/weather";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");
    const city = url.searchParams.get("city") || "New Delhi";
    const units = url.searchParams.get("units") || "metric";

    const key = "d8868c617b86e249fda02e77a655eb54";

    if (!key) {
      return NextResponse.json(
        { error: "Server missing OPENWEATHER_API_KEY" },
        { status: 500 }
      );
    }

    const q =
      lat && lon ? `lat=${lat}&lon=${lon}` : `q=${encodeURIComponent(city)}`;
    const resp = await fetch(`${API}?${q}&appid=${key}&units=${units}`, {
      // cache weather briefly; adjust as you like
      next: { revalidate: 600 }, // 10 min
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json(
        { error: `OpenWeather error: ${text}` },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json({
      // normalize a compact shape the widget expects
      name: data.name,
      country: data.sys?.country,
      temp: Math.round(data.main?.temp),
      feels_like: Math.round(data.main?.feels_like),
      humidity: data.main?.humidity,
      wind: Math.round((data.wind?.speed ?? 0) * 10) / 10,
      desc: data.weather?.[0]?.description ?? "",
      icon: data.weather?.[0]?.icon ?? "01d", // e.g. "10d"
      sunrise: data.sys?.sunrise,
      sunset: data.sys?.sunset,
      tz: data.timezone, // seconds offset
      units,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
