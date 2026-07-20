"use client";
import React from "react";
import Link from "next/link";
import { IconArrowRight, IconBrandGithub } from "@tabler/icons-react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import ColourfulText from "@/components/ui/colourful-text";
import { Button } from "@/components/ui/button";

const STATS = [
  { label: "Projects Shipped", value: "12+" },
  { label: "Vision Pipelines", value: "Real-time · GPU" },
  { label: "Experience", value: "3+ yrs" },
];

const TAGLINE_WORDS = [
  { text: "Fullstack" },
  { text: "Developer" },
  { text: "&" },
  { text: "AI/LLM" },
  { text: "Engineer.", className: "text-primary" },
];

export default function Home() {
  return (
    <BackgroundBeamsWithCollision className="h-full w-full">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 overflow-y-auto px-4 text-center">
        <h1 className="text-3xl font-bold sm:text-5xl lg:text-6xl">
          <ColourfulText text="Shubham Kumar Prajapati" />
        </h1>

        <TypewriterEffect
          words={TAGLINE_WORDS}
          className="text-lg sm:text-2xl lg:text-3xl"
          cursorClassName="bg-primary"
        />

        <p className="max-w-xl text-sm text-foreground/60 sm:text-base">
          I build systems that see, think, and respond in real time — from
          GPU surveillance pipelines to custom LLM inference stacks.
          Currently at <span className="font-semibold text-foreground/80">Mostedge</span>.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild size="lg">
            <Link href="/projects">
              View My Work
              <IconArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/github">
              <IconBrandGithub className="size-4" />
              GitHub
            </Link>
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-xl font-bold sm:text-2xl">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-wide text-foreground/50 sm:text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
