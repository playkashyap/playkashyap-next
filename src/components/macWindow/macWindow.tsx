"use client";

import { Rnd } from "react-rnd";
import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme/themeProvider";
import { AnimatePresence, motion } from "motion/react";
import { useWindowManager } from "@/components/window/windowManager";

type Accent = "violet" | "blue" | "green" | "amber" | "rose";
const ACCENT_SWATCH: Record<Accent, string> = {
  violet: "oklch(0.53 0.26 300)",
  blue: "oklch(0.60 0.18 236)",
  green: "oklch(0.64 0.20 148)",
  amber: "oklch(0.78 0.19 84)",
  rose: "oklch(0.65 0.25 20)",
};

interface WindowState {
  width: number;
  height: number;
  x?: number;
  y?: number;
}

function pathToTitle(pathname: string): string {
  if (!pathname || pathname === "/") return "Home";
  const first = pathname
    .split("?")[0]
    .split("#")[0]
    .split("/")
    .filter(Boolean)[0];
  if (!first) return "Home";
  return first.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function MacWindow({
  children,
  storageKey,
  initial = { width: 1100, height: 700 },
  margin = 12,
}: {
  children: React.ReactNode;
  storageKey?: string;
  initial?: { width: number; height: number; x?: number; y?: number };
  margin?: number;
}) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const { accent } = useTheme();
  const pathname = usePathname() ?? "/";
  const title = pathToTitle(pathname);
  const key = storageKey ?? `macwin:${pathname}`;

  // ---- Window Manager (minimize state) ----
  const { minimized, minimize, restore: unminimize } = useWindowManager(key);

  // ---- Compute initial position/size within the stage ----
  const computeInitial = React.useCallback((): WindowState => {
    const rect = stageRef.current?.getBoundingClientRect();
    const vw = rect?.width ?? window.innerWidth;
    const vh = rect?.height ?? window.innerHeight;
    const w = Math.min(initial.width, vw - margin * 2);
    const h = Math.min(initial.height, vh - margin * 2);
    const x = (vw - w) / 2;
    const y = (vh - h) / 2;
    return { width: w, height: h, x, y };
  }, [initial.width, initial.height, margin]);

  // ---- Persisted window state (size/position) ----
  const [state, setState] = React.useState<WindowState>(() => {
    if (typeof window === "undefined") return initial;
    const saved = window.localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved) as WindowState;
      } catch {}
    }
    return computeInitial();
  });

  const save = React.useCallback(
    (next: WindowState) => {
      setState(next);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(next));
      }
    },
    [key]
  );

  // ---- Keep the window clamped inside the stage on viewport resize ----
  React.useEffect(() => {
    const onResize = () => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      const maxW = rect.width - margin * 2;
      const maxH = rect.height - margin * 2;
      const width = Math.min(state.width, maxW);
      const height = Math.min(state.height, maxH);
      const x = Math.min(
        Math.max(state.x ?? 0, margin),
        rect.width - width - margin
      );
      const y = Math.min(
        Math.max(state.y ?? 0, margin),
        rect.height - height - margin
      );
      setState({ width, height, x, y });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [state.width, state.height, state.x, state.y, margin]);

  // ---- Maximize / Restore-layout (size+pos), separate from minimize ----
  const maximize = () => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    save({
      width: rect.width - margin * 2,
      height: rect.height - margin * 2,
      x: margin,
      y: margin,
    });
  };

  const restoreLayout = () => save(computeInitial());

  // When restoring from the Dock, you can also choose to call restoreLayout().
  const restoreFromDock = () => {
    unminimize();
    // Optionally re-center:
    // restoreLayout();
  };

  const accentColor = `var(--accent, ${
    ACCENT_SWATCH[accent as Accent] ?? ACCENT_SWATCH.violet
  })`;

  return (
    // === Stage: the safe area between TopBar and Dock ===
    <div
      ref={stageRef}
      className="fixed left-0 right-0 z-40 pointer-events-none"
      style={{
        top: "var(--topbar-h, 40px)",
        bottom: "var(--dock-h, 72px)",
      }}
    >
      <AnimatePresence initial={false}>
        {!minimized && (
          <motion.div
            key="macwin"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="h-full w-full"
          >
            <Rnd
              size={{ width: state.width, height: state.height }}
              position={{ x: state.x ?? 0, y: state.y ?? 0 }}
              onDragStop={(_, data) => save({ ...state, x: data.x, y: data.y })}
              onResizeStop={(_, __, ref, ___, pos) =>
                save({
                  width: ref.offsetWidth,
                  height: ref.offsetHeight,
                  x: pos.x,
                  y: pos.y,
                })
              }
              bounds="parent"
              minWidth={325}
              minHeight={220}
              dragHandleClassName="macwin-drag"
              enableResizing={{
                top: true,
                right: true,
                bottom: true,
                left: true,
                topRight: true,
                bottomRight: true,
                bottomLeft: true,
                topLeft: true,
              }}
              className="pointer-events-auto rounded-2xl border border-border shadow-[0_10px_40px_-20px_var(--ring)] overflow-hidden bg-card"
            >
              {/* Title bar */}
              <div
                className="macwin-drag relative h-9 flex items-center border-b border-border bg-muted/70 select-none"
                onDoubleClick={restoreLayout}
              >
                <div className="absolute left-3 flex items-center gap-2">
                  <button
                    aria-label="Close"
                    className="h-3 w-3 rounded-full bg-[#ff605c]"
                    onClick={restoreLayout}
                  />
                  <button
                    aria-label="Minimize"
                    className="h-3 w-3 rounded-full bg-[#ffbd44]"
                    onClick={minimize}
                  />
                  <button
                    aria-label="Zoom"
                    className="h-3 w-3 rounded-full bg-[#00ca4e]"
                    onClick={maximize}
                  />
                </div>

                <div className="mx-auto text-xs font-medium text-foreground/80">
                  {title}
                </div>

                <div className="absolute right-3 flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: accentColor }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="h-[calc(100%-2.25rem)] overflow-auto bg-card text-foreground">
                {children}
              </div>
            </Rnd>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
