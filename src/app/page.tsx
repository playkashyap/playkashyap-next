"use client";
import React from "react";
import { Dock } from "@/components/floatingDock/dock";

export default function Home() {
  return (
    <>
      <div className=" fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex justify-center ">
        <Dock />
      </div>
    </>
  );
}
