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

const ACCENTS = ["violet", "blue", "green", "amber", "rose"] as const;

// fixed OKLCH preview colors so SSR === CSR
const ACCENT_SWATCH: Record<Accent, string> = {
  violet: "oklch(0.53 0.26 300)",
  blue:   "oklch(0.60 0.18 236)",
  green:  "oklch(0.64 0.20 148)",
  amber:  "oklch(0.78 0.19 84)",
  rose:   "oklch(0.65 0.25 20)",
};

export function ThemeTogglePopover({
  side = "top",
  align = "center",
}: {
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}) {
  const { mode, accent, setMode, setAccent } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Trigger shows sun/moon. We keep SSR placeholder neutral.
  const TriggerIcon = !mounted ? (
    <div className="h-5 w-5 rounded-full border border-border/60" />
  ) : mode === "dark" ? (
    <IconSun className="h-5 w-5 text-neutral-500 dark:text-neutral-300" />
  ) : (
    <IconMoon className="h-5 w-5 text-neutral-500 dark:text-neutral-300" />
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* asChild lets us use your Dock's icon container styles */}
      <PopoverTrigger asChild>
        <button
          aria-label="Theme"
          className="h-full w-full flex items-center justify-center"
        >
          {TriggerIcon}
        </button>
      </PopoverTrigger>

      {/* Mac window look */}
      <PopoverContent
        side={side}
        align={align}
        // zero padding; we'll build our own chrome inside
        className="w-72 p-0 rounded-xl overflow-hidden border border-border bg-popover text-popover-foreground shadow-2xl"
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
        <div className="p-3 space-y-3 bg-card">
          {/* Theme Select (SSR-safe shell until mounted) */}
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

          {/* Accent grid */}
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
                  data-preview-accent={a}
                  data-state={a === accent ? "on" : "off"}
                />
              )
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
