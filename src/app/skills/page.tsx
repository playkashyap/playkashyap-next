"use client";

import React from "react";
import { IoLogoJavascript } from "react-icons/io";
import {
  IoLogoReact,
  IoLogoPython,
  IoLogoAngular,
  IoLogoCss3,
} from "react-icons/io5";
import { BiLogoTypescript } from "react-icons/bi";
import { FaDatabase } from "react-icons/fa";
import {
  SiMongodb,
  SiSqlite,
  SiExpress,
  SiTailwindcss,
  SiMui,
  SiShadcnui,
} from "react-icons/si";
import { BiLogoPostgresql } from "react-icons/bi";
import { DiMsqlServer, DiNodejs } from "react-icons/di";
import { FaHtml5 } from "react-icons/fa";
import { FaBootstrap } from "react-icons/fa6";
import { RiNextjsFill } from "react-icons/ri";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

interface Skill {
  name: string;
  level: number; // Level from 1 to 10
  icon: React.ReactNode; // Icon component
  color: string; // Color for the skill
}

export default function  Skill () {

const Framworks: Skill[] = [
    {
      name: "React",
      level: 8,
      icon: <IoLogoReact size={24} color="#0000FF" />,
      color: "#0000FF",
    },
    {
      name: "Angular",
      level: 7,
      icon: <IoLogoAngular size={24} color="#FF0000" />,
      color: "#FF0000",
    },
    {
      name: "Next.js",
      level: 8,
      icon: <RiNextjsFill size={24} color="#000000" />,
      color: "#000000",
    },
    {
      name: "Express.js",
      level: 7,
      icon: <SiExpress size={24} color="#000000" />,
      color: "#000000",
    },
    {
      name: "Tailwind CSS",
      level: 8,
      icon: <SiTailwindcss size={24} color="#38B2AC" />,
      color: "#38B2AC",
    },
    {
      name: "Bootstrap",
      level: 8,
      icon: <FaBootstrap size={24} color="#563D7C" />,
      color: "#563D7C",
    },
    {
      name: "Material-UI",
      level: 7,
      icon: <SiMui size={24} color="#0081CB" />,
      color: "#0081CB",
    },
    {
      name: "Shadcn UI",
      level: 6,
      icon: <SiShadcnui size={24} color="#000000" />,
      color: "#000000",
    },
  ];

  const languages: Skill[] = [
    {
      name: "JavaScript",
      level: 9,
      icon: <IoLogoJavascript size={24} color="#FFFF00" />,
      color: "#FFFF00",
    },
    {
      name: "TypeScript",
      level: 8,
      icon: <BiLogoTypescript size={24} color="#3178C6" />,
      color: "#3178C6",
    },
    {
      name: "Python",
      level: 7,
      icon: <IoLogoPython size={24} color="#306998" />,
      color: "#306998",
    },
    {
      name: "HTML5",
      level: 9,
      icon: <FaHtml5 size={24} color="#E34F26" />,
      color: "#E34F26",
    },
    {
      name: "CSS3",
      level: 8,
      icon: <IoLogoCss3 size={24} color="#1572B6" />,
      color: "#1572B6",
    },
    {
      name: "Node.js",
      level: 7,
      icon: <DiNodejs size={24} color="#339933" />,
      color: "#339933",
    },
  ];

  const databases: Skill[] = [
    {
      name: "MS SQL Server",
      level: 7,
      icon: <DiMsqlServer size={24} color="#e31f24" />,
      color: "#e31f24",
    },
    {
      name: "SQLite",
      level: 6,
      icon: <SiSqlite size={24} color="#003B57" />,
      color: "#003B57",
    },
    {
      name: "PostgreSQL",
      level: 6,
      icon: <BiLogoPostgresql size={24} color="#336791" />,
      color: "#336791",
    },
    {
      name: "MongoDB",
      level: 6,
      icon: <SiMongodb size={24} color="#4DB33D" />,
      color: "#4DB33D",
    },
  ];

  return (
    <BackgroundBeamsWithCollision className="h-full w-full">
      <div className="flex justify-center align-middle items-center h-full w-full text-2xl font-bold">
        You are in Home
      </div>
    </BackgroundBeamsWithCollision>
  );
};
