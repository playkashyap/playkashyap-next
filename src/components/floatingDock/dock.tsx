"use client";

import React from "react";
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

export function Dock() {
  const links = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-foreground/80" />,
      href: "/",
    },
    {
      title: "Skills",
      icon: <IconTerminal2 className="h-full w-full text-foreground/80" />,
      href: "/skills",
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
    // External links: if your FloatingDock uses Next <Link>, keep these as '#'
    // or update FloatingDock to detect absolute URLs and render <a target="_blank">.
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
    // Theme popover in a dock icon
    {
      title: "Theme",
      icon: <ThemeTogglePopover side="top" align="center" />,
      href: "#",
    },
  ];

  return (
    <div className="w-full flex items-center justify-center">
      <FloatingDock items={links} mobileClassName="" />
    </div>
  );
}
