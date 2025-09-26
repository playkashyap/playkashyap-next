"use client";

import React from "react";
import {
  IoLogoReact,
  IoLogoPython,
  IoLogoAngular,
  IoLogoCss3,
} from "react-icons/io5";
import {
  BiLogoTypescript,
  BiLogoPostgresql,
  BiLogoJavascript,
} from "react-icons/bi";
import {
  SiMongodb,
  SiSqlite,
  SiExpress,
  SiTailwindcss,
  SiMui,
  SiShadcnui,
} from "react-icons/si";
import { DiMsqlServer, DiNodejs } from "react-icons/di";
import { FaHtml5 } from "react-icons/fa";
import { FaBootstrap } from "react-icons/fa6";
import { RiNextjsFill } from "react-icons/ri";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { FaStar, FaRegStar } from "react-icons/fa";
import ColourfulText from "@/components/ui/colourful-text";
import { motion } from "motion/react";

/* ---------- Types ---------- */

interface Skill {
  name: string;
  level: number; // 1..10
  icon: React.ReactNode;
  color: string;
}

interface CardProps {
  skill: Skill;
}

/* ---------- Constants (keep card sizing stable) ---------- */

const CARD_REM_WIDTH = 18; // 18rem
const CARD_REM_HEIGHT = 22; // 22rem

/* ---------- Stars ---------- */

const renderStars = (level: number) => {
  const max = 10;
  const stars = [];
  for (let i = 1; i <= max; i++) {
    stars.push(i <= level ? <FaStar key={i} /> : <FaRegStar key={i} />);
  }
  return stars;
};

/* ---------- Card ---------- */

const Card: React.FC<CardProps> = ({ skill }) => {
  return (
    <CardContainer className="inter-var">
      <CardBody
        className="relative group/card dark:hover:shadow-[0_10px_40px_-20px_var(--ring)]
                   dark:border-white/[0.2] border-black/[0.1]
                   w-[18rem] h-[15rem] rounded-xl p-6 border"
      >
        <CardItem
          translateZ="50"
          className="text-xl font-bold"
          style={{ color: skill.color }}
        >
          {skill.name}
        </CardItem>

        <CardItem
          as="p"
          translateZ="60"
          className="flex space-x-1 mt-2 text-yellow-500"
        >
          {renderStars(skill.level)}
        </CardItem>

        <CardItem
          translateZ="100"
          rotateX={20}
          rotateZ={-10}
          className="w-full p-4 mt-4 justify-center flex"
        >
          {skill.icon}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
};

/* ---------- Section (title + responsive grid flowing naturally) ---------- */

type SkillsSectionProps = {
  title: string;
  items: Skill[];
};

const SkillsSection: React.FC<SkillsSectionProps> = ({ title, items }) => {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans">
        <ColourfulText text={title} /> <br />
      </h1>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${CARD_REM_WIDTH}rem, 1fr))`,
        }}
      >
        {items.map((s) => (
          <div
            key={`${title}-${s.name}`}
            className="flex items-start justify-center"
          >
            <Card skill={s} />
          </div>
        ))}
      </div>
    </section>
  );
};

/* ---------- Data ---------- */

const frameworks: Skill[] = [
  {
    name: "React",
    level: 8,
    icon: <IoLogoReact size={100} color="#0000FF" />,
    color: "#0000FF",
  },
  {
    name: "Angular",
    level: 7,
    icon: <IoLogoAngular size={100} color="#FF0000" />,
    color: "#FF0000",
  },
  {
    name: "Next.js",
    level: 8,
    icon: <RiNextjsFill size={100} className="text-black dark:text-white" />,
    color: "currentColor", // let text color drive it
  },
  {
    name: "Express.js",
    level: 7,
    icon: <SiExpress size={100} className="text-black dark:text-white" />,
    color: "currentColor",
  },
  {
    name: "Tailwind",
    level: 8,
    icon: <SiTailwindcss size={100} color="#38B2AC" />,
    color: "#38B2AC",
  },
  {
    name: "Bootstrap",
    level: 8,
    icon: <FaBootstrap size={100} color="#563D7C" />,
    color: "#563D7C",
  },
  {
    name: "Material UI",
    level: 7,
    icon: <SiMui size={100} color="#0081CB" />,
    color: "#0081CB",
  },
  {
    name: "shadcn/ui",
    level: 6,
    icon: <SiShadcnui size={100} className="text-black dark:text-white" />,
    color: "currentColor",
  },
];

const languages: Skill[] = [
  {
    name: "JavaScript",
    level: 9,
    icon: <BiLogoJavascript size={100} color="#FFFF00" />,
    color: "#FFFF00",
  },
  {
    name: "TypeScript",
    level: 8,
    icon: <BiLogoTypescript size={100} color="#3178C6" />,
    color: "#3178C6",
  },
  {
    name: "Python",
    level: 7,
    icon: <IoLogoPython size={100} color="#306998" />,
    color: "#306998",
  },
  {
    name: "HTML5",
    level: 9,
    icon: <FaHtml5 size={100} color="#E34F26" />,
    color: "#E34F26",
  },
  {
    name: "CSS3",
    level: 8,
    icon: <IoLogoCss3 size={100} color="#1572B6" />,
    color: "#1572B6",
  },
  {
    name: "Node.js",
    level: 7,
    icon: <DiNodejs size={100} color="#339933" />,
    color: "#339933",
  },
];

const databases: Skill[] = [
  {
    name: "MS SQL Server",
    level: 7,
    icon: <DiMsqlServer size={100} color="#e31f24" />,
    color: "#e31f24",
  },
  {
    name: "SQLite",
    level: 6,
    icon: <SiSqlite size={100} color="#003B57" />,
    color: "#003B57",
  },
  {
    name: "PostgreSQL",
    level: 6,
    icon: <BiLogoPostgresql size={100} color="#336791" />,
    color: "#336791",
  },
  {
    name: "MongoDB",
    level: 6,
    icon: <SiMongodb size={100} color="#4DB33D" />,
    color: "#4DB33D",
  },
];

/* ---------- Page ---------- */

export default function Skill() {
  return (
    <BackgroundBeamsWithCollision className="h-full w-full">
      {/* Single column layout with stacked sections */}
      <div className="flex flex-col gap-10 p-4">
        <SkillsSection title="Languages" items={languages} />
        <SkillsSection title="Frameworks" items={frameworks} />
        <SkillsSection title="Databases" items={databases} />
      </div>
    </BackgroundBeamsWithCollision>
  );
}
