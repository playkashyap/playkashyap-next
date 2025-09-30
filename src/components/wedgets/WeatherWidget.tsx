"use client";

import React from "react";
import { Rnd } from "react-rnd";
import {
  IconWind,
  IconDroplet,
  IconRefresh,
  IconMapPin,
} from "@tabler/icons-react";

type Weather = {
  name: string;
  country?: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind: number;
  desc: string;
  icon: string;
  sunrise?: number;
  sunset?: number;
  tz?: number;
  units: "metric" | "imperial";
};

function cn(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}
const iconUrl = (code: string) =>
  `https://openweathermap.org/img/wn/${code}@2x.png`;

function useWeather(fallbackCity = "New Delhi") {
  const [units, setUnits] = React.useState<"metric" | "imperial">(() => {
    if (typeof window === "undefined") return "metric";
    return (
      (localStorage.getItem("wx-units") as "metric" | "imperial") || "metric"
    );
  });
  const [data, setData] = React.useState<Weather | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  const fetchWeather = React.useCallback(async () => {
    setErr(null);
    setLoading(true);

    const getWithGeo = () =>
      new Promise<URL>((resolve) => {
        let settled = false;
        const timer = setTimeout(() => {
          if (!settled)
            resolve(
              new URL(
                `/api/weather?city=${encodeURIComponent(
                  fallbackCity
                )}&units=${units}`,
                window.location.origin
              )
            );
        }, 3000);

        if (!("geolocation" in navigator)) {
          clearTimeout(timer);
          resolve(
            new URL(
              `/api/weather?city=${encodeURIComponent(
                fallbackCity
              )}&units=${units}`,
              window.location.origin
            )
          );
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            resolve(
              new URL(
                `/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=${units}`,
                window.location.origin
              )
            );
          },
          () => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            resolve(
              new URL(
                `/api/weather?city=${encodeURIComponent(
                  fallbackCity
                )}&units=${units}`,
                window.location.origin
              )
            );
          },
          { enableHighAccuracy: false, timeout: 2500, maximumAge: 60_000 }
        );
      });

    try {
      let url: URL;
      if (typeof window !== "undefined") {
        url = await getWithGeo();
      } else {
        url = new URL(
          `/api/weather?city=${encodeURIComponent(fallbackCity)}&units=${units}`
        );
      }
      const r = await fetch(url.toString(), { cache: "no-store" });
      const json = await r.json();
      if (!r.ok) throw new Error(json?.error || "Failed to fetch weather");
      setData(json as Weather);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  }, [units, fallbackCity]);

  React.useEffect(() => {
    fetchWeather();
    const id = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchWeather]);

  const toggleUnits = React.useCallback(() => {
    setUnits((u) => {
      const next = u === "metric" ? "imperial" : "metric";
      localStorage.setItem("wx-units", next);
      return next;
    });
  }, []);

  return { data, loading, err, units, toggleUnits, refresh: fetchWeather };
}

export function WeatherWidget({
  className,
  fallbackCity = "New Delhi",
  floating = true,
  storageKey = "wx:widget",
  resizable = false,
  margin = 12,
}: {
  className?: string;
  fallbackCity?: string;
  /** If true: draggable floating widget. If false: inline card. */
  floating?: boolean;
  /** Persist position/size key */
  storageKey?: string;
  /** Allow resize (defaults to false for neat look) */
  resizable?: boolean;
  /** Inner margin from the stage edges (like MacWindow) */
  margin?: number;
}) {
  const { data, loading, err, units, toggleUnits, refresh } =
    useWeather(fallbackCity);
  const unitSymbol = units === "metric" ? "°C" : "°F";
  const windUnit = units === "metric" ? "m/s" : "mph";

  const card = (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-background/70 backdrop-blur-xl p-3 shadow-[0_10px_40px_-20px_var(--ring)] w-64 select-none",
        className
      )}
    >
      {/* drag handle bar (visible only in floating mode) */}
      {floating && (
        <div className="h-3 -mt-1 -mb-1 cursor-grab active:cursor-grabbing macwin-drag-area" />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-foreground/70">
          <IconMapPin className="h-3.5 w-3.5" />
          <span className="truncate">
            {loading
              ? "Locating…"
              : data
              ? `${data.name}${data.country ? `, ${data.country}` : ""}`
              : "—"}
          </span>
        </div>
        <button
          onClick={toggleUnits}
          className="text-xs px-2 py-1 rounded-md border border-border hover:bg-foreground/5"
          title={`Switch to ${units === "metric" ? "°F" : "°C"}`}
        >
          {unitSymbol}
        </button>
      </div>

      <div className="mt-2 flex items-center gap-3">
        <div className="flex items-center justify-center h-16 w-16">
          {loading ? (
            <div className="h-10 w-10 rounded-full border-2 border-foreground/20 border-t-transparent animate-spin" />
          ) : data ? (
            <img
              src={iconUrl(data.icon)}
              alt={data.desc}
              className="h-14 w-14"
            />
          ) : (
            <div className="h-10 w-10 rounded-full border-2 border-destructive/40" />
          )}
        </div>
        <div className="flex flex-col">
          <div className="text-3xl font-semibold tabular-nums">
            {loading ? "—" : data ? data.temp : "—"}
            <span className="text-base align-super">{unitSymbol}</span>
          </div>
          <div className="text-xs text-foreground/70 capitalize">
            {loading ? "Loading…" : data ? data.desc : err || "—"}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-md border border-border/60 p-2 bg-muted/50">
          <div className="text-foreground/60">Feels</div>
          <div className="font-medium">
            {loading ? "—" : data ? `${data.feels_like}${unitSymbol}` : "—"}
          </div>
        </div>
        <div className="rounded-md border border-border/60 p-2 bg-muted/50">
          <div className="flex items-center gap-1 text-foreground/60">
            <IconDroplet className="h-3.5 w-3.5" /> Hum
          </div>
          <div className="font-medium">
            {loading ? "—" : data ? `${data.humidity}%` : "—"}
          </div>
        </div>
        <div className="rounded-md border border-border/60 p-2 bg-muted/50">
          <div className="flex items-center gap-1 text-foreground/60">
            <IconWind className="h-3.5 w-3.5" /> Wind
          </div>
          <div className="font-medium">
            {loading ? "—" : data ? `${data.wind} ${windUnit}` : "—"}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-[10px] text-foreground/55">
          Updated {loading ? "…" : "now"}
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-border hover:bg-foreground/5"
          title="Refresh"
        >
          <IconRefresh className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>
    </div>
  );

  if (!floating) return card;

  // ---- Draggable floating mode with MacWindow-like clamping ----
  type Pos = { x: number; y: number; width: number; height: number };
  const stageRef = React.useRef<HTMLDivElement>(null);

  const getStageRect = () => stageRef.current?.getBoundingClientRect();

  const clampToStage = React.useCallback(
    (p: Pos): Pos => {
      const rect = getStageRect();
      if (!rect) return p;

      const maxW = Math.max(120, rect.width - margin * 2);
      const maxH = Math.max(120, rect.height - margin * 2);

      const width = Math.min(Math.max(p.width, 220), maxW);
      const height = Math.min(Math.max(p.height, 160), maxH);

      const minX = margin;
      const minY = margin;
      // 👇 remove margin on right edge
      const maxX = rect.width - width;
      const maxY = rect.height - height - margin;

      const x = Math.min(Math.max(p.x, minX), maxX);
      const y = Math.min(Math.max(p.y, minY), maxY);

      return { width, height, x, y };
    },
    [margin]
  );

  // initial placement: top-right within stage
  const computeInitial = React.useCallback((): Pos => {
    const rect = getStageRect();
    const width = 256;
    const height = 184;

    if (!rect) {
      // SSR or first paint fallback
      return { width, height, x: margin, y: margin };
    }
    const p = {
      width,
      height,
      x: rect.width - width - margin,
      y: margin,
    };
    return clampToStage(p);
  }, [clampToStage, margin]);

  const [pos, setPos] = React.useState<Pos>(() => {
    if (typeof window === "undefined")
      return { width: 256, height: 184, x: margin, y: margin };
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved) as Pos;
      } catch {}
    }
    return { width: 256, height: 184, x: margin, y: margin };
  });

  // After mount, compute proper initial based on actual stage bounds
  React.useEffect(() => {
    setPos((p) => clampToStage(savedOrInitial(p)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savedOrInitial = (p: Pos): Pos => {
    // if storage had something, clamp it; otherwise compute initial
    const rect = getStageRect();
    if (!rect) return p;
    // If it's the "default" placeholder (margin,margin,256x184), place top-right
    if (
      p.x === margin &&
      p.y === margin &&
      p.width === 256 &&
      p.height === 184
    ) {
      return computeInitial();
    }
    return clampToStage(p);
  };

  const save = React.useCallback(
    (next: Pos) => {
      const clamped = clampToStage(next);
      setPos(clamped);
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(clamped));
      }
    },
    [storageKey, clampToStage]
  );

  // Clamp on resize (stage resizing)
  React.useEffect(() => {
    const onResize = () => save({ ...pos });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pos, save]);

  return (
    <div
      ref={stageRef}
      className="fixed inset-0 pointer-events-none z-30"
      style={{
        top: "var(--topbar-h, 40px)",
        bottom: "var(--dock-h, 72px)",
      }}
    >
      <Rnd
        size={{ width: pos.width, height: pos.height }}
        position={{ x: pos.x, y: pos.y }} // stage already accounts for topbar/dock
        dragHandleClassName="macwin-drag-area" // drag by the handle; remove to drag anywhere
        bounds="parent"
        onDragStop={(_, d) => save({ ...pos, x: d.x, y: d.y })}
        onResizeStop={(_, __, ref, ___, newPos) =>
          save({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            x: newPos.x,
            y: newPos.y,
          })
        }
        minWidth={220}
        minHeight={160}
        enableResizing={
          resizable
            ? { bottom: true, right: true, bottomRight: true }
            : { bottom: false, right: false, bottomRight: false }
        }
        className="pointer-events-auto"
      >
        {card}
      </Rnd>
    </div>
  );
}
