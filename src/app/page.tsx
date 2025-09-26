"use client";
import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function Home() {
  return (
    <BackgroundBeamsWithCollision className="h-full w-full">
      <div className="flex justify-center align-middle items-center h-full w-full text-2xl font-bold">
        You are in Home
      </div>
    </BackgroundBeamsWithCollision>
  );
}
