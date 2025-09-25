"use client";

import { useEffect, useMemo, useState } from "react";
import { FaApple } from "react-icons/fa";
import { IoIosBatteryFull, IoIosWifi } from "react-icons/io";
import { useTheme } from "../theme/themeProvider";
import { usePathname } from "next/navigation"; // <-- Next.js route

type Accent = "violet" | "blue" | "green" | "amber" | "rose";

const ACCENT_SWATCH: Record<Accent, string> = {
  violet: "oklch(0.53 0.26 300)",
  blue:   "oklch(0.60 0.18 236)",
  green:  "oklch(0.64 0.20 148)",
  amber:  "oklch(0.78 0.19 84)",
  rose:   "oklch(0.65 0.25 20)",
};

// Customize route -> title mapping here
const TITLE_MAP: Record<string, string> = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/settings": "System Settings",
  "/about": "About",
};

function pathToTitle(pathname: string): string {
  if (!pathname || pathname === "/") return TITLE_MAP["/"];

  // exact match first
  if (TITLE_MAP[pathname]) return TITLE_MAP[pathname];

  // best-effort: take first segment and Title Case it
  const first = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean)[0];
  if (!first) return TITLE_MAP["/"];

  // e.g. /posts/123 -> "Posts"; /user-profile -> "User Profile"
  const title = first
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
  return title;
}

// Define interface for CSS custom properties
interface CSSPropertiesWithVars extends React.CSSProperties {
  "--accent"?: string;
}

export default function MacTopBar() {
  const { accent } = useTheme();
  const pathname = usePathname();
  const routeTitle = pathToTitle(pathname ?? "/");

  const [time, setTime] = useState("—");
  const [mounted, setMounted] = useState(false);

  const accentColor = useMemo(
    () => ACCENT_SWATCH[(accent as Accent) ?? "violet"] ?? ACCENT_SWATCH.violet,
    [accent]
  );

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat(undefined, {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        }).format(now)
      );
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={[
        "fixed inset-x-0 top-0 h-10 z-50",
        "backdrop-blur-xl bg-background/60 dark:bg-background/45",
        "border-b border-border/70",
        "flex items-center justify-between px-3",
        "text-sm text-foreground",
      ].join(" ")}
      // Fix: Replace 'any' with proper typing for CSS custom properties
      style={
        {
          "--accent": `var(--accent, ${accentColor})`
        } as CSSPropertiesWithVars
      }
      role="menubar"
      aria-label="macOS-style menu bar"
    >
      {/* LEFT cluster: Apple + menus. First label reflects current route */}
      <div className="flex items-center gap-2">
        <button
          className="px-1.5 py-1 rounded-md hover:bg-foreground/5 focus:outline-none"
          title="Apple"
          aria-label="Apple menu"
        >
          <FaApple size={16} style={{ color: "var(--accent)" }} />
        </button>

        {[
          { label: routeTitle, active: true }, // <-- dynamic route title here
        //   { label: "File" },
        //   { label: "Edit" },
        //   { label: "View" },
        //   { label: "Go" },
        //   { label: "Window" },
        //   { label: "Help" },
        ].map((m) => (
          <button
            key={m.label}
            className={[
              "px-2 py-1 rounded-md leading-none transition-colors",
              m.active
                ? "font-medium text-[color:var(--accent)]"
                : "hover:bg-foreground/5 hover:text-[color:var(--accent)]",
            ].join(" ")}
            aria-current={m.active ? "page" : undefined}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* RIGHT cluster: status */}
      <div className="flex items-center gap-3">
        <IoIosWifi size={16} style={{ color: "var(--accent)" }} aria-label="Wi-Fi" />
        <span className="text-xs tabular-nums opacity-90">100%</span>
        <IoIosBatteryFull
          size={16}
          className="opacity-80 dark:opacity-90"
          aria-label="Battery"
        />
        <span className="text-xs tabular-nums">{mounted ? time : "—"}</span>
      </div>
    </div>
  );
}
