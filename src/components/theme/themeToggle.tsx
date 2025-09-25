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

// Accent presets (SSR-safe)
const ACCENTS = ["violet", "blue", "green", "amber", "rose"] as const;
const ACCENT_SWATCH: Record<Accent, string> = {
  violet: "oklch(0.53 0.26 300)",
  blue: "oklch(0.60 0.18 236)",
  green: "oklch(0.64 0.20 148)",
  amber: "oklch(0.78 0.19 84)",
  rose: "oklch(0.65 0.25 20)",
};

// Small, self-contained previews so it works even before you add global CSS
const WALLPAPER_PREVIEW: Record<BuiltinWallpaperId, React.CSSProperties> = {
  default: {
    background: "#e1ecff",
  },
  solid: {
    background: "var(--card, #111)",
  },
  mountains: {
    // point to your /public/wallpapers/mountains.jpg (or leave as placeholder color)
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
    wallpaper, // { type: 'builtin' | 'upload', ... }
    setMode,
    setAccent,
    setWallpaper,
  } = useTheme() as any;

  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement | null>(null);

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

            {/* Built-ins */}
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

              {/* Upload (session-only) */}
              <label className="h-14 w-full rounded-md border flex items-center justify-center cursor-pointer text-xs text-muted-foreground hover:bg-accent/10">
                Upload
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setWallpaper({ type: "upload", url });
                    }
                  }}
                />
              </label>
            </div>

            {/* If an upload is active, show a tiny preview + reset */}
            {mounted && wallpaper?.type === "upload" && (
              <div className="mt-2 flex items-center justify-between rounded-md border px-2 py-1">
                <span className="text-xs opacity-70">Custom (session)</span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-10 rounded border"
                    style={{
                      backgroundImage: `url(${wallpaper.url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-xs"
                    onClick={() =>
                      setWallpaper({ type: "builtin", id: "default" })
                    }
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
