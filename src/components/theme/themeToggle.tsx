"use client";

import React from "react";
import { useTheme } from "./themeProvider";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconMoon, IconSun } from "@tabler/icons-react";

type Mode = "light" | "dark" | "system";
type Accent = "violet" | "blue" | "green" | "amber" | "rose";
type BuiltinWallpaperId = "default" | "mountains" | "abstract" | "solid";

const ACCENTS = ["violet", "blue", "green", "amber", "rose"] as const;
const ACCENT_SWATCH: Record<Accent, string> = {
  violet: "oklch(0.53 0.26 300)",
  blue: "oklch(0.60 0.18 236)",
  green: "oklch(0.64 0.20 148)",
  amber: "oklch(0.78 0.19 84)",
  rose: "oklch(0.65 0.25 20)",
};

const WALLPAPER_PREVIEW: Record<BuiltinWallpaperId, React.CSSProperties> = {
  default: { background: "#e1ecff" },
  solid: { background: "var(--solid-bg, #111111)" }, // UPDATED: reflect chosen color
  mountains: {
    backgroundImage: "url(/wallpapers/mountains.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  abstract: {
    backgroundImage: "url(/wallpapers/abstract.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
};

export function ThemeTogglePopover({
  side = "top",
  align = "center",
}: {
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}) {
  const {
    mode,
    accent,
    wallpaper,
    setMode,
    setAccent,
    setWallpaper,
    solidColor, // NEW
    setSolidColor, // NEW
  } = useTheme() as any;

  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const TriggerIcon = !mounted ? (
    <div className="h-5 w-5 rounded-full border border-border/60" />
  ) : mode === "dark" ? (
    <IconSun className="h-5 w-5 text-neutral-500 dark:text-neutral-300" />
  ) : (
    <IconMoon className="h-5 w-5 text-neutral-500 dark:text-neutral-300" />
  );

  const isActiveBuiltin = (id: BuiltinWallpaperId) =>
    wallpaper?.type === "builtin" && wallpaper.id === id;

  // quick presets for solid
  const SOLID_PRESETS = [
    "#111111",
    "#0ea5e9",
    "#1f2937",
    "#0f172a",
    "#18181b",
    "#020617",
    "#e11d48",
    "#22c55e",
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Theme"
          className="h-full w-full flex items-center justify-center"
        >
          {TriggerIcon}
        </button>
      </PopoverTrigger>

      <PopoverContent
        side={side}
        align={align}
        className="w-80 p-0 rounded-xl overflow-hidden border border-border bg-popover text-popover-foreground shadow-2xl"
      >
        {/* Title bar */}
        <div className="relative h-8 flex items-center justify-center border-b border-border bg-muted/70 backdrop-blur-sm">
          <div className="absolute left-2 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff605c]" aria-hidden />
            <span className="h-3 w-3 rounded-full bg-[#ffbd44]" aria-hidden />
            <span className="h-3 w-3 rounded-full bg-[#00ca4e]" aria-hidden />
          </div>
          <div className="text-xs font-medium tracking-wide select-none">
            Appearance
          </div>
        </div>

        {/* Body */}
        <div className="p-3 space-y-4 bg-card">
          {/* Theme Select */}
          {!mounted ? (
            <div className="w-full h-9 rounded-md border border-border/60 bg-background/60" />
          ) : (
            <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Accent */}
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide opacity-70">
              Accent
            </div>
            <div className="grid grid-cols-5 gap-2">
              {ACCENTS.map((a) =>
                !mounted ? (
                  <div
                    key={a}
                    className="h-8 w-8 rounded-full border border-border/60"
                    style={{ background: ACCENT_SWATCH[a] }}
                    aria-hidden
                  />
                ) : (
                  <Button
                    key={a}
                    type="button"
                    variant={a === accent ? "default" : "outline"}
                    className="h-8 w-8 p-0 rounded-full border border-border data-[state=on]:ring-2 data-[state=on]:ring-primary/50"
                    aria-label={`Set accent ${a}`}
                    onClick={() => setAccent(a as Accent)}
                    style={{ background: ACCENT_SWATCH[a] }}
                    data-state={a === accent ? "on" : "off"}
                  />
                )
              )}
            </div>
          </div>

          {/* Wallpaper */}
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide opacity-70">
              Wallpaper
            </div>

            {/* Built-ins (no Upload now) */}
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  "default",
                  "solid",
                  "mountains",
                  "abstract",
                ] as BuiltinWallpaperId[]
              ).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setWallpaper({ type: "builtin", id })}
                  className={[
                    "h-14 w-full rounded-md border overflow-hidden relative",
                    isActiveBuiltin(id) ? "ring-2 ring-primary" : "",
                  ].join(" ")}
                  aria-label={`Set wallpaper ${id}`}
                >
                  <div
                    className="absolute inset-0"
                    style={
                      id === "default"
                        ? mode === "dark"
                          ? { background: "#111111" }
                          : { background: "#e1ecff" }
                        : WALLPAPER_PREVIEW[id]
                    }
                  />
                  <div className="absolute bottom-0 left-0 right-0 text-[10px] px-1 py-0.5 bg-black/30 text-white backdrop-blur-sm">
                    {id}
                  </div>
                </button>
              ))}
            </div>

            {/* NEW: Solid color controls (only when solid selected) */}
            {mounted &&
              wallpaper?.type === "builtin" &&
              wallpaper.id === "solid" && (
                <div className="mt-3 space-y-2 rounded-md border p-2">
                  <div className="text-xs opacity-70">Solid color</div>

                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={solidColor}
                      onChange={(e) => setSolidColor(e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded border bg-transparent p-0"
                      aria-label="Pick solid background color"
                    />
                    <div className="flex items-center gap-2">
                      {SOLID_PRESETS.map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => setSolidColor(hex)}
                          className="h-6 w-6 rounded border"
                          style={{ background: hex }}
                          aria-label={`Set ${hex}`}
                          title={hex}
                        />
                      ))}
                    </div>
                    <div
                      className="ml-auto h-6 w-10 rounded border"
                      style={{ background: solidColor }}
                    />
                  </div>
                </div>
              )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
