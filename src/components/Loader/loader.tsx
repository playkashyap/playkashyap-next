"use client";

import React from "react";

export const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="mx-auto w-[500px] rounded-xl overflow-hidden drop-shadow-xl border border-border bg-card">
        {/* Header (like a macOS window) */}
        <div className="bg-muted flex items-center p-[5px] relative">
          <div className="flex absolute left-3">
            <span className="h-3.5 w-3.5 bg-[#ff605c] rounded-full mr-2"></span>
            <span className="h-3.5 w-3.5 bg-[#ffbd44] rounded-full mr-2"></span>
            <span className="h-3.5 w-3.5 bg-[#00ca4e] rounded-full"></span>
          </div>
          <div className="flex-1 text-center text-foreground">status</div>
        </div>

        {/* Body */}
        <div className="p-4 font-mono text-primary">
          <div>
            <span className="mr-2">Loading</span>
            <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite]">.</span>
            <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite]">.</span>
            <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite]">.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
