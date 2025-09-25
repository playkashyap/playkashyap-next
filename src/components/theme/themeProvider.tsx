"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Mode = "light" | "dark" | "system";
type Accent = "violet" | "blue" | "green" | "amber" | "rose";

// Wallpapers can be built-in (string id) or user-upload (session only)
type Wallpaper =
  | { type: "builtin"; id: "default" | "mountains" | "abstract" | "solid" }
  | { type: "upload"; url: string };

type ThemeCtx = {
  mode: Mode;
  accent: Accent;
  wallpaper: Wallpaper;
  setMode: (m: Mode) => void;
  setAccent: (a: Accent) => void;
  setWallpaper: (w: Wallpaper) => void;
  ready: boolean;
};

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({
  children,
  defaultMode = "system",
  defaultAccent = "violet",
  defaultWallpaper = { type: "builtin", id: "default" } as Wallpaper,
}: {
  children: React.ReactNode;
  defaultMode?: Mode;
  defaultAccent?: Accent;
  defaultWallpaper?: Wallpaper;
}) {
  // 1) SSR-safe defaults
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [accent, setAccent] = useState<Accent>(defaultAccent);
  const [wallpaper, setWallpaper] = useState<Wallpaper>(defaultWallpaper);
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

    setMode(savedMode);
    setAccent(savedAccent);
    setWallpaper({ type: "builtin", id: savedWallpaper as any });

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
  }, []); // <-- empty array, runs only once

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
    if (wallpaper.type === "builtin") {
      root.setAttribute("data-wallpaper", wallpaper.id);
      localStorage.setItem("ui-theme-wallpaper", wallpaper.id);
      root.style.backgroundImage = "";
    } else {
      // user-upload: session only
      root.setAttribute("data-wallpaper", "upload");
      root.style.backgroundImage = `url(${wallpaper.url})`;
      root.style.backgroundSize = "cover";
      root.style.backgroundPosition = "center";
    }
  }, [wallpaper, ready]);

  return (
    <Ctx.Provider
      value={{
        mode,
        accent,
        wallpaper,
        setMode,
        setAccent,
        setWallpaper,
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
