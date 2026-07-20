"use client";
import React from "react";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function Projects() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <BackgroundBeamsWithCollision className="h-full w-full">
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-medium text-neutral-700 dark:text-neutral-200 text-base"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-start gap-6">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col  hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col  w-full">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-60 w-full  rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="flex justify-center items-center flex-col">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </BackgroundBeamsWithCollision>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "AI-native dev workspace",
    title: "DevForge",
    src: "/projects/devforge.svg",
    ctaText: "Visit",
    ctaLink: "https://devforge.playkashyap.com/",
    content: () => {
      return (
        <p>
          A precision developer workbench that puts AI chat, an AI site
          builder ("Studio"), and 22 local-first tools inside a single tab
          that never breaks your flow.
          <br /> <br />
          Chat across 15+ models (Claude, GPT-4o, Gemini) with streaming
          responses and live web search, generate whole page sections from a
          prompt and refine them visually or in code, and reach for
          instant, offline instruments — codec, JSON transform, config
          forge, and more — with zero egress: nothing leaves the tab.
        </p>
      );
    },
  },
  {
    description: "Voice-first AI companion",
    title: "LUNA",
    src: "/projects/luna.svg",
    ctaText: "Join Waitlist",
    ctaLink: "https://luna.playkashyap.com/",
    content: () => {
      return (
        <p>
          A voice-first, visually-aware AI companion built to feel less like
          a tool window and more like a live presence on your machine —
          currently in early access.
          <br /> <br />
          Real-time speech-to-text with expressive voice replies and
          barge-in support, multimodal vision through webcam analysis,
          persistent memory across conversations, and OS-level tool use —
          all running local-first, so nothing leaves your machine.
        </p>
      );
    },
  },
  {
    description: "Vector DB admin UI",
    title: "Chroma Admin",
    src: "/projects/chroma-admin.svg",
    ctaText: "Live Demo",
    ctaLink: "https://chroma-admin-nu.vercel.app",
    content: () => {
      return (
        <p>
          A browser-based UI that connects directly to ChromaDB servers to
          manage vector databases — no custom backend required. <br /> <br />
          Lets you browse collections, query embeddings, and visualize data
          with scatter plots straight from the browser.
          <br /> <br />
          <a
            href="https://github.com/playkashyap/chroma-admin"
            target="_blank"
            className="underline"
          >
            View on GitHub
          </a>
        </p>
      );
    },
  },
  {
    description: "Interactive physics learning",
    title: "PhyVerse",
    src: "/projects/PhyVerse.svg",
    ctaText: "GitHub",
    ctaLink: "https://github.com/playkashyap/PhyVerse",
    content: () => {
      return (
        <p>
          An open-source platform that teaches physics through interactive
          simulations and hands-on experimentation instead of memorization.
          <br /> <br />
          Currently offers three interactive worlds — Motion Hall, Force
          Factory, and Gravity Garden — with more planned for circuits, waves,
          and optics.
        </p>
      );
    },
  },
  {
    description: "AI background remover",
    title: "bgremover",
    src: "/projects/bgremover.svg",
    ctaText: "GitHub",
    ctaLink: "https://github.com/playkashyap/bgremover",
    content: () => {
      return (
        <p>
          A background-removal tool that runs entirely client-side, using
          ONNX machine learning models (Silueta and U2Netp) for image
          segmentation directly in the browser.
          <br /> <br />
          No uploads to a server — inference happens on-device.
        </p>
      );
    },
  },
  {
    description: "Angular task manager",
    title: "Task Manager",
    src: "/projects/task-manager.svg",
    ctaText: "GitHub",
    ctaLink: "https://github.com/playkashyap/task-manager",
    content: () => {
      return (
        <p>
          A task management app built with Angular, with dedicated components
          for creating/editing tasks and displaying the task list, backed by
          a service layer for CRUD operations.
        </p>
      );
    },
  },
  {
    description: "Terminal alarm clock",
    title: "AlarmClockPython",
    src: "/projects/AlarmClockPython.svg",
    ctaText: "GitHub",
    ctaLink: "https://github.com/playkashyap/AlarmClockPython",
    content: () => {
      return (
        <p>
          A terminal-based alarm clock built with Textual, featuring a
          live-updating dashboard, a data table navigable with arrow keys,
          and modal dialogs for adding and editing alarms — all inside the
          command line.
        </p>
      );
    },
  },
  {
    description: "Discord bot",
    title: "discbot",
    src: "/projects/discbot.svg",
    ctaText: "GitHub",
    ctaLink: "https://github.com/playkashyap/discbot",
    content: () => {
      return (
        <p>
          A Discord bot for automatically sharing meme content within Discord
          servers.
        </p>
      );
    },
  },
];
