"use client";

import React from "react";
import { Timeline } from "@/components/ui/timeline";

function RoleHeader({
  role,
  org,
  meta,
}: {
  role: string;
  org: string;
  meta: string;
}) {
  return (
    <div className="mb-3">
      <h4 className="text-sm md:text-base font-bold text-neutral-800 dark:text-neutral-100">
        {role} <span className="font-normal text-neutral-500">·</span>{" "}
        <span className="text-primary">{org}</span>
      </h4>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">{meta}</p>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mb-4 flex flex-col gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-2 text-xs md:text-sm font-normal text-neutral-800 dark:text-neutral-200"
        >
          <span className="text-primary shrink-0">›</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <div className="mb-8 flex flex-wrap gap-1.5">
      {items.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] md:text-[11px] text-neutral-600 dark:text-neutral-400"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default function Experience() {
  const data = [
    {
      title: "2025 – Now",
      content: (
        <div>
          <RoleHeader
            role="Fullstack Developer"
            org="Mostedge"
            meta="Aug 2025 – Present · Vadodara, India"
          />
          <Bullets
            items={[
              "Building WatchGuard — a remote surveillance platform for C-stores with real-time face recognition, GPU-accelerated video processing, and live streaming via HLS and WebRTC exposed through Nginx.",
              "Designed a microservice architecture from scratch, scaling independently per camera and per AI worker — currently processing 2× 1080p feeds at 20fps with AI inference per stream.",
              "Implemented an event-driven pipeline with Kafka and AWS MSK for high-throughput video event logs, face recognition alerts, and metadata across distributed services.",
              "Built REST APIs with Node.js (TypeScript) and Python (FastAPI) backed by MSSQL and PostgreSQL; containerized with Docker and deployed on AWS GPU instances.",
            ]}
          />
          <Tags
            items={[
              "GStreamer",
              "FFmpeg",
              "CUDA",
              "InsightFace",
              "Kafka",
              "MediaMTX",
              "FastAPI",
              "Node.js",
              "Docker",
              "AWS",
              "Nginx",
            ]}
          />
        </div>
      ),
    },
    {
      title: "2023 – 2025",
      content: (
        <div>
          <RoleHeader
            role="Software Developer (Frontend & Backend)"
            org="Cosmotech AI"
            meta="Jun 2023 – May 2025 · Noida, India"
          />
          <Bullets
            items={[
              "HRIS — pixel-perfect responsive frontend in Next.js with a drag-and-drop customizable dashboard, Zustand global state, and a dynamic org chart exportable to PDF.",
              "PMS — Project Management System frontend in Angular with NgRx state management, RxJS real-time data binding, and Apex Charts reporting dashboards.",
              "Rate System — React + Vite frontend with Bootstrap and Apex Charts.",
              "Built REST APIs with Node.js (TypeScript) and MongoDB for real-time data operations.",
            ]}
          />
          <Tags
            items={[
              "Next.js",
              "React",
              "Angular",
              "NgRx",
              "RxJS",
              "Zustand",
              "Tailwind",
              "Apex Charts",
              "Node.js",
              "MongoDB",
            ]}
          />
        </div>
      ),
    },
    {
      title: "Early 2023",
      content: (
        <div>
          <RoleHeader
            role="Frontend Developer Intern"
            org="Cosmotech AI"
            meta="Jan 2023 – Jun 2023 · Noida, India"
          />
          <Bullets
            items={[
              "First step into the industry — contributed to production UI development using React, Angular, HTML, CSS, and TypeScript.",
              "Assisted in API integration and dynamic content updates.",
              "Learned the craft of shipping in a team: Git workflows, sprint planning, daily stand-ups.",
            ]}
          />
          <Tags items={["React", "Angular", "TypeScript", "Git"]} />
        </div>
      ),
    },
    {
      title: "2019 – 2023",
      content: (
        <div>
          <RoleHeader
            role="B.Tech, Computer Science & Technology"
            org="Sharda University"
            meta="Aug 2019 – Aug 2023 · Greater Noida, India"
          />
          <Bullets
            items={[
              "HandFlow — a framework for controlling computer functions with hand gestures. Real-time CNN pipeline hitting 96% accuracy on static and 97% on dynamic gestures (Python, OpenCV, Mediapipe, TensorFlow).",
              "Published a research paper — “Image Processing based Brain Tumor Detection” (SVM classification with pre-processing and segmentation) at ICFIRTP-2022.",
            ]}
          />
          <Tags
            items={[
              "Python",
              "OpenCV",
              "TensorFlow",
              "Mediapipe",
              "CNN",
              "SVM",
            ]}
          />
        </div>
      ),
    },
    {
      title: "2014 – 2018",
      content: (
        <div>
          <RoleHeader
            role="School"
            org="Columbus International School"
            meta="Ballia, India"
          />
          <Bullets
            items={[
              "Secondary (2014 – 2016) — 10 CGPA.",
              "Higher Secondary (2016 – 2018) — 81%.",
              "Where the curiosity for computers started.",
            ]}
          />
        </div>
      ),
    },
  ];

  return <Timeline data={data} />;
}
