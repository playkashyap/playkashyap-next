"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Mode = "light" | "dark" | "system";
type Accent = "violet" | "blue" | "green" | "amber" | "rose";

type ThemeCtx = {
  mode: Mode;
  accent: Accent;
  setMode: (m: Mode) => void;
  setAccent: (a: Accent) => void;
  ready: boolean; // <-- expose readiness
};

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({
  children,
  defaultMode = "system",
  defaultAccent = "violet",
}: {
  children: React.ReactNode;
  defaultMode?: Mode;
  defaultAccent?: Accent;
}) {
  // 1) SSR-safe defaults
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [accent, setAccent] = useState<Accent>(defaultAccent);
  const [ready, setReady] = useState(false);

  // 2) After mount, load persisted values and apply to <html>
  useEffect(() => {
    const savedMode =
      (localStorage.getItem("ui-theme-mode") as Mode) || defaultMode;
    const savedAccent =
      (localStorage.getItem("ui-theme-accent") as Accent) || defaultAccent;

    setMode(savedMode);
    setAccent(savedAccent);

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark =
      savedMode === "dark" || (savedMode === "system" && prefersDark);
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.setAttribute("data-accent", savedAccent);

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
  }, [defaultMode, defaultAccent]);

  // 3) Update <html> + persist when user changes
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

  useEffect(() => {
    if (!ready) return;
    document.documentElement.setAttribute("data-accent", accent);
    localStorage.setItem("ui-theme-accent", accent);
  }, [accent, ready]);

  return (
    <Ctx.Provider value={{ mode, accent, setMode, setAccent, ready }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme must be used inside ThemeProvider");
  return v;
}
