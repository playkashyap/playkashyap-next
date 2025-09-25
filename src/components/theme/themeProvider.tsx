"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Mode = "light" | "dark" | "system";
type Accent = "violet" | "blue" | "green" | "amber" | "rose";

// UPDATED: Wallpapers are now only built-ins (we're removing upload for now)
type Wallpaper = {
  type: "builtin";
  id: "default" | "mountains" | "abstract" | "solid";
};

type ThemeCtx = {
  mode: Mode;
  accent: Accent;
  wallpaper: Wallpaper;
  setMode: (m: Mode) => void;
  setAccent: (a: Accent) => void;
  setWallpaper: (w: Wallpaper) => void;
  // NEW: solid color
  solidColor: string;
  setSolidColor: (hex: string) => void;
  ready: boolean;
};

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({
  children,
  defaultMode = "system",
  defaultAccent = "violet",
  defaultWallpaper = { type: "builtin", id: "default" } as Wallpaper,
  // NEW: default for solid color
  defaultSolidColor = "#111111",
}: {
  children: React.ReactNode;
  defaultMode?: Mode;
  defaultAccent?: Accent;
  defaultWallpaper?: Wallpaper;
  defaultSolidColor?: string;
}) {
  // 1) SSR-safe defaults
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [accent, setAccent] = useState<Accent>(defaultAccent);
  const [wallpaper, setWallpaper] = useState<Wallpaper>(defaultWallpaper);
  const [solidColor, setSolidColor] = useState<string>(defaultSolidColor); // NEW
  const [ready, setReady] = useState(false);

  // 2) On mount: load persisted values
  useEffect(() => {
    const savedMode =
      (localStorage.getItem("ui-theme-mode") as Mode) || defaultMode;
    const savedAccent =
      (localStorage.getItem("ui-theme-accent") as Accent) || defaultAccent;
    const savedWallpaper =
      (localStorage.getItem("ui-theme-wallpaper") as string) ||
      (defaultWallpaper.type === "builtin" ? defaultWallpaper.id : "default");
    const savedSolid =
      localStorage.getItem("ui-theme-solid-color") || defaultSolidColor; // NEW

    setMode(savedMode);
    setAccent(savedAccent);
    setWallpaper({ type: "builtin", id: savedWallpaper as any });
    setSolidColor(savedSolid); // NEW

    // apply to <html>
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark =
      savedMode === "dark" || (savedMode === "system" && prefersDark);

    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.setAttribute("data-accent", savedAccent);
    root.setAttribute("data-wallpaper", savedWallpaper);
    // NEW: seed the CSS var so the solid rule can read it
    root.style.setProperty("--solid-bg", savedSolid);

    // listen for system theme changes
    const onChange = () => {
      if (savedMode === "system") {
        const prefers = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        root.classList.toggle("dark", prefers);
      }
    };
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", onChange);

    setReady(true);
    return () => mql.removeEventListener("change", onChange);
  }, []); // <-- only once

  // 3) Watch mode
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = mode === "dark" || (mode === "system" && prefersDark);
    root.classList.toggle("dark", isDark);
    localStorage.setItem("ui-theme-mode", mode);
  }, [mode, ready]);

  // 4) Watch accent
  useEffect(() => {
    if (!ready) return;
    document.documentElement.setAttribute("data-accent", accent);
    localStorage.setItem("ui-theme-accent", accent);
  }, [accent, ready]);

  // 5) Watch wallpaper
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.setAttribute("data-wallpaper", wallpaper.id);
    localStorage.setItem("ui-theme-wallpaper", wallpaper.id);

    // Reset image-related styles unconditionally
    root.style.backgroundImage = "";
    root.style.backgroundSize = "";
    root.style.backgroundPosition = "";

    // If solid, ensure --solid-bg is applied (actual color set in the next effect as well)
    if (wallpaper.id === "solid") {
      root.style.setProperty("--solid-bg", solidColor);
    }
  }, [wallpaper, ready]); // reads solidColor too, but separate effect below keeps it in sync

  // NEW 6) Watch solidColor
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("ui-theme-solid-color", solidColor);
    const root = document.documentElement;
    root.style.setProperty("--solid-bg", solidColor);
    // if current wallpaper is solid, make sure background reflects it immediately
    if (wallpaper.id === "solid") {
      // nothing else needed because CSS uses var(--solid-bg)
    }
  }, [solidColor, wallpaper, ready]);

  return (
    <Ctx.Provider
      value={{
        mode,
        accent,
        wallpaper,
        setMode,
        setAccent,
        setWallpaper,
        solidColor, // NEW
        setSolidColor, // NEW
        ready,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme must be used inside ThemeProvider");
  return v;
}
