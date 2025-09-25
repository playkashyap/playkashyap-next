"use client";

import { useEffect, useState } from "react";

// Shows the loader once (first visit), then reveals children.
// Uses sessionStorage so client-side route changes won’t re-show it.
export function SplashGate({
  durationMs = 4500,
  children,
  Loader,
}: {
  durationMs?: number;
  children: React.ReactNode;
  Loader: React.ComponentType;
}) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("seen-splash") === "1";
    if (seen) {
      setShowSplash(false);
      return;
    }
    const t = setTimeout(() => {
      sessionStorage.setItem("seen-splash", "1");
      setShowSplash(false);
    }, durationMs);
    return () => clearTimeout(t);
  }, [durationMs]);

  if (showSplash) {
    return <Loader />;
  }
  return <>{children}</>;
}
