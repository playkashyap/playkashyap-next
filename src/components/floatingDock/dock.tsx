"use client";

import React, { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import { ThemeTogglePopover } from "../theme/themeToggle";
import Image from "next/image";
import { useWindowManager } from "@/components/window/windowManager";

export function Dock() {
  const pathname = usePathname() || "/";
  const key = `macwin:${pathname}`;
  const { minimized, restore } = useWindowManager(key);

  // Helper: intercept clicks on the active item when minimized
  const interceptIfMinimized = (href: string) => (e: MouseEvent) => {
    const isSameRoute = href === pathname || (href === "/" && pathname === "/");
    if (minimized && isSameRoute) {
      e.preventDefault();
      restore();
    }
  };

  const links = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-foreground/80" />,
      href: "/",
      onClick: interceptIfMinimized("/"),
    },
    {
      title: "Skills",
      icon: <IconTerminal2 className="h-full w-full text-foreground/80" />,
      href: "/skills",
      onClick: interceptIfMinimized("/skills"),
    },
    {
      title: "Components",
      icon: <IconNewSection className="h-full w-full text-foreground/80" />,
      href: "#",
    },
    {
      title: "Profile",
      icon: (
        <Image
          src="/profile.jpg"
          alt="profile"
          className="h-full w-full rounded-md object-cover"
          width={24}
          height={24}
        />
      ),
      href: "#",
    },
    {
      title: "Changelog",
      icon: <IconExchange className="h-full w-full text-foreground/80" />,
      href: "#",
    },
    {
      title: "Twitter",
      icon: <IconBrandX className="h-full w-full text-foreground/80" />,
      href: "#",
    },
    {
      title: "GitHub",
      icon: <IconBrandGithub className="h-full w-full text-foreground/80" />,
      href: "#",
    },
    {
      title: "Theme",
      icon: <ThemeTogglePopover side="top" align="center" />,
      href: "#",
    },
    // Optional: show a dedicated Restore button only when minimized
    // ...(minimized
    //   ? [
    //       {
    //         title: "Restore",
    //         icon: (
    //           <IconTerminal2 className="h-full w-full text-foreground/80" />
    //         ),
    //         href: pathname, // stay on the same page
    //         onClick: (e: MouseEvent) => {
    //           e.preventDefault();
    //           restore();
    //         },
    //       },
    //     ]
    //   : []),
  ];

  return (
    <div className="w-full flex items-center justify-center">
      <FloatingDock items={links} mobileClassName="" />
    </div>
  );
}
