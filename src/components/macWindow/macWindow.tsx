"use client";

import { Rnd } from "react-rnd";
import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme/themeProvider";

type Accent = "violet" | "blue" | "green" | "amber" | "rose";
const ACCENT_SWATCH: Record<Accent, string> = {
  violet: "oklch(0.53 0.26 300)",
  blue: "oklch(0.60 0.18 236)",
  green: "oklch(0.64 0.20 148)",
  amber: "oklch(0.78 0.19 84)",
  rose: "oklch(0.65 0.25 20)",
};

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
  margin = 12, // inner gap from stage edges
}: {
  children: React.ReactNode;
  storageKey?: string;
  initial?: { width: number; height: number; x?: number; y?: number };
  margin?: number;
}) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const { accent } = useTheme();
  const pathname = usePathname();
  const title = pathToTitle(pathname ?? "/");
  const key = storageKey ?? `macwin:${pathname}`;

  const computeInitial = React.useCallback(() => {
    const rect = stageRef.current?.getBoundingClientRect();
    const vw = rect?.width ?? window.innerWidth;
    const vh = rect?.height ?? window.innerHeight;
    const w = Math.min(initial.width, vw - margin * 2);
    const h = Math.min(initial.height, vh - margin * 2);
    const x = (vw - w) / 2;
    const y = (vh - h) / 2;
    return { width: w, height: h, x, y };
  }, [initial.width, initial.height, margin]);

  const [state, setState] = React.useState(() => {
    if (typeof window === "undefined") return initial;
    const saved = window.localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return computeInitial();
  });

  const save = React.useCallback(
    (next: any) => {
      setState(next);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(next));
      }
    },
    [key]
  );

  // Re-center on resize so the stage constraints stay correct
  React.useEffect(() => {
    const onResize = () => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Clamp current size/pos to stage
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

  const restore = () => save(computeInitial());

  const accentColor = `var(--accent, ${
    ACCENT_SWATCH[accent as Accent] ?? ACCENT_SWATCH.violet
  })`;

  return (
    // === Stage: the safe area between TopBar and Dock ===
    <div
      ref={stageRef}
      className="fixed left-0 right-0"
      style={{
        top: "var(--topbar-h, 40px)",
        bottom: "var(--dock-h, 72px)",
      }}
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
        bounds="parent" // <-- stays inside the stage
        minWidth={520}
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
        className="rounded-2xl border border-border shadow-[0_10px_40px_-20px_var(--ring)] overflow-hidden bg-card"
      >
        {/* Title bar */}
        <div
          className="macwin-drag relative h-9 flex items-center border-b border-border bg-muted/70 select-none"
          onDoubleClick={restore}
        >
          <div className="absolute left-3 flex items-center gap-2">
            <button
              aria-label="Close"
              className="h-3 w-3 rounded-full bg-[#ff605c]"
              onClick={restore}
            />
            <button
              aria-label="Minimize"
              className="h-3 w-3 rounded-full bg-[#ffbd44]"
              onClick={() => save({ ...state, height: 48 })}
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
    </div>
  );
}
