"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type State = Record<string, { minimized: boolean }>;

type Ctx = {
  get: (key: string) => { minimized: boolean };
  minimize: (key: string) => void;
  restore: (key: string) => void;
  toggle: (key: string) => void;
};

const WindowManagerContext = createContext<Ctx | null>(null);

export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>({});

  const api = useMemo<Ctx>(() => ({
    get: (key) => state[key] ?? { minimized: false },
    minimize: (key) =>
      setState((s) => ({ ...s, [key]: { minimized: true } })),
    restore: (key) =>
      setState((s) => ({ ...s, [key]: { minimized: false } })),
    toggle: (key) =>
      setState((s) => ({ ...s, [key]: { minimized: !(s[key]?.minimized ?? false) } })),
  }), [state]);

  return (
    <WindowManagerContext.Provider value={api}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager(key?: string) {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error("useWindowManager must be used within WindowManagerProvider");
  const k = key ?? "__default__";
  return {
    ...ctx,
    minimized: ctx.get(k).minimized,
    minimize: () => ctx.minimize(k),
    restore: () => ctx.restore(k),
    toggle: () => ctx.toggle(k),
  };
}
