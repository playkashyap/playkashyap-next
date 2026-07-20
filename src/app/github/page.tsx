"use client";

import React from "react";
import Image from "next/image";
import {
  IconBook,
  IconMapPin,
  IconBuilding,
  IconLink,
  IconStar,
  IconGitFork,
  IconUsers,
} from "@tabler/icons-react";

const GITHUB_USERNAME = "playkashyap";

type GithubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
};

type GithubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  pushed_at: string;
};

// GitHub's official linguist language colors
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  SCSS: "#c6538c",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  Go: "#00ADD8",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Vue: "#41b883",
  Angular: "#dd0031",
};

const NAV_TABS = ["Overview", "Repositories", "Projects", "Packages", "Stars"];

// ---- Content mirrored from github.com/playkashyap/playkashyap (profile README) ----

const CONNECT_BADGES = [
  { label: "Portfolio", href: "https://playkashyap.com", color: "#00d4ff", text: "#04222b" },
  {
    label: "Live Product: DevForge",
    href: "https://devforge.playkashyap.com",
    color: "#7c3aed",
    text: "#ffffff",
  },
  { label: "LinkedIn", href: "https://linkedin.com/in/shubham7080", color: "#0A66C2", text: "#ffffff" },
  { label: "Email", href: "mailto:jackwill021@gmail.com", color: "#D14836", text: "#ffffff" },
];

const BUILDING_NOW = [
  {
    emoji: "🎥",
    title: "Surveillance Platform",
    description:
      "Microservice-based real-time surveillance system with face recognition, theft detection, safety analysis, and shopper recommendations. GPU-accelerated inference across distributed services.",
    tags: ["GStreamer", "InsightFace", "Kafka", "FastAPI", "CUDA", "Docker"],
  },
  {
    emoji: "🧠",
    title: "Custom LLM Hosting Platform",
    description:
      "Self-hosted vLLM inference stack with model fine-tuning and context analysis pipelines. Runtime model switching across multiple models, self-hosted on RunPod via Tailscale.",
    tags: ["vLLM", "Ollama", "Angular", "RunPod", "Tailscale"],
  },
  {
    emoji: "🌙",
    title: "LUNA — Emotion-Aware AI Assistant",
    description:
      "Full-stack local AI integrating speech, vision, and language into one real-time pipeline — STT, TTS, facial emotion detection, and fully offline LLM inference.",
    tags: ["Whisper", "IndexTTS2", "InsightFace", "Llama.cpp"],
  },
  {
    emoji: "🛠️",
    title: "DevForge — AI Developer Workbench",
    description:
      "Live product: multi-model AI chat, visual site generation from a single prompt, and 22 local-first developer tools in one workbench.",
    tags: ["Next.js", "TypeScript", "Claude API", "Oracle Cloud"],
    link: "https://devforge.playkashyap.com",
  },
];

const TECH_STACK: {
  category: string;
  badges: { label: string; color: string; text?: string }[];
}[] = [
  {
    category: "LLM & Agentic AI",
    badges: [
      { label: "vLLM", color: "#FF6B6B" },
      { label: "Ollama", color: "#000000" },
      { label: "RAG / LangChain", color: "#1C3C3C" },
      { label: "MCP", color: "#7c3aed" },
    ],
  },
  {
    category: "AI / Vision / Audio",
    badges: [
      { label: "CUDA", color: "#76B900" },
      { label: "OpenCV", color: "#5C3EE8" },
      { label: "TensorFlow", color: "#FF6F00" },
      { label: "Whisper", color: "#412991" },
    ],
  },
  {
    category: "Backend",
    badges: [
      { label: "Node.js", color: "#339933" },
      { label: "Python", color: "#3776AB" },
      { label: "FastAPI", color: "#009688" },
      { label: "PostgreSQL", color: "#4169E1" },
      { label: "MongoDB", color: "#47A248" },
    ],
  },
  {
    category: "Frontend",
    badges: [
      { label: "React", color: "#61DAFB", text: "#000000" },
      { label: "Angular", color: "#DD0031" },
      { label: "Next.js", color: "#000000" },
      { label: "TypeScript", color: "#3178C6" },
      { label: "Tailwind", color: "#06B6D4" },
    ],
  },
  {
    category: "Streaming & Infra",
    badges: [
      { label: "Kafka", color: "#231F20" },
      { label: "Docker", color: "#2496ED" },
      { label: "AWS", color: "#FF9900" },
      { label: "Nginx", color: "#009639" },
    ],
  },
];

function Pill({
  label,
  color,
  text = "#ffffff",
  href,
}: {
  label: string;
  color: string;
  text?: string;
  href?: string;
}) {
  const style = { background: color, color: text };
  const className =
    "inline-flex items-center rounded px-2.5 py-1 text-[11px] font-semibold tracking-wide";
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        {label}
      </a>
    );
  }
  return (
    <span className={className} style={style}>
      {label}
    </span>
  );
}

function useGithubProfile(username: string) {
  const [user, setUser] = React.useState<GithubUser | null>(null);
  const [repos, setRepos] = React.useState<GithubRepo[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  const fetchProfile = React.useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, {
          cache: "no-store",
        }),
        fetch(
          `https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`,
          { cache: "no-store" }
        ),
      ]);
      if (!userRes.ok) throw new Error("Failed to load GitHub profile");
      const userJson = (await userRes.json()) as GithubUser;
      const reposJson = ((await reposRes.json()) as GithubRepo[]) ?? [];

      const topRepos = [...reposJson]
        .filter((r) => !r.fork)
        .sort(
          (a, b) =>
            b.stargazers_count - a.stargazers_count ||
            +new Date(b.pushed_at) - +new Date(a.pushed_at)
        )
        .slice(0, 6);

      setUser(userJson);
      setRepos(topRepos);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load GitHub profile");
    } finally {
      setLoading(false);
    }
  }, [username]);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { user, repos, loading, err, refresh: fetchProfile };
}

function RepoCard({ repo }: { repo: GithubRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col rounded-md border border-[#30363d] p-4 hover:border-[#8b949e] transition-colors"
    >
      <div className="flex items-center gap-2">
        <IconBook className="h-4 w-4 shrink-0 text-[#7d8590]" />
        <span className="truncate text-sm font-semibold text-[#58a6ff]">
          {repo.name}
        </span>
        <span className="ml-1 shrink-0 rounded-full border border-[#30363d] px-1.5 py-px text-[10px] text-[#7d8590]">
          Public
        </span>
      </div>
      <p className="mt-2 min-h-[2.5rem] text-xs text-[#7d8590] line-clamp-2">
        {repo.description || "No description, website, or topics provided."}
      </p>
      <div className="mt-3 flex items-center gap-3 text-xs text-[#7d8590]">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background: LANGUAGE_COLORS[repo.language] ?? "#8b949e",
              }}
            />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            <IconStar className="h-3.5 w-3.5" />
            {repo.stargazers_count}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1">
            <IconGitFork className="h-3.5 w-3.5" />
            {repo.forks_count}
          </span>
        )}
      </div>
    </a>
  );
}

export default function GithubPage() {
  const { user, repos, loading, err, refresh } =
    useGithubProfile(GITHUB_USERNAME);
  const [activeTab, setActiveTab] = React.useState("Overview");
  const [snakeOk, setSnakeOk] = React.useState(true);

  return (
    <div className="h-full w-full overflow-auto bg-[#0d1117] text-[#c9d1d9] [color-scheme:dark]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-6 md:flex-row">
        {err && (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400 md:hidden">
            {err}{" "}
            <button onClick={refresh} className="underline">
              Retry
            </button>
          </div>
        )}

        {/* Sidebar */}
        <aside className="shrink-0 md:w-[296px]">
          <div className="h-[260px] w-[260px] max-w-full overflow-hidden rounded-full border border-[#30363d] bg-[#161b22]">
            {user?.avatar_url && (
              <Image
                src={user.avatar_url}
                alt={user.login}
                width={260}
                height={260}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <h1 className="mt-4 text-2xl font-bold leading-tight text-[#e6edf3]">
            {loading ? "Loading…" : user?.name ?? GITHUB_USERNAME}
          </h1>
          <p className="text-xl font-light text-[#7d8590]">
            {GITHUB_USERNAME}
          </p>

          {user?.bio && (
            <p className="mt-2 text-sm text-[#c9d1d9]">{user.bio}</p>
          )}

          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center rounded-md border border-[#30363d] bg-[#21262d] py-1.5 text-sm font-medium text-[#c9d1d9] hover:bg-[#30363d] transition-colors"
          >
            Follow
          </a>

          <div className="mt-4 flex items-center gap-1 text-sm text-[#c9d1d9]">
            <IconUsers className="h-4 w-4 text-[#7d8590]" />
            <span className="font-semibold text-[#e6edf3]">
              {loading ? "—" : user?.followers ?? 0}
            </span>
            <span className="text-[#7d8590]">followers</span>
            <span className="text-[#7d8590]">&#183;</span>
            <span className="font-semibold text-[#e6edf3]">
              {loading ? "—" : user?.following ?? 0}
            </span>
            <span className="text-[#7d8590]">following</span>
          </div>

          <ul className="mt-4 flex flex-col gap-2 text-sm text-[#c9d1d9]">
            {user?.company && (
              <li className="flex items-center gap-2">
                <IconBuilding className="h-4 w-4 shrink-0 text-[#7d8590]" />
                {user.company}
              </li>
            )}
            {user?.location && (
              <li className="flex items-center gap-2">
                <IconMapPin className="h-4 w-4 shrink-0 text-[#7d8590]" />
                {user.location}
              </li>
            )}
            {user?.blog && (
              <li className="flex items-center gap-2">
                <IconLink className="h-4 w-4 shrink-0 text-[#7d8590]" />
                <a
                  href={
                    user.blog.startsWith("http")
                      ? user.blog
                      : `https://${user.blog}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#58a6ff] hover:underline"
                >
                  {user.blog.replace(/^https?:\/\//, "")}
                </a>
              </li>
            )}
          </ul>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          {err && (
            <div className="mb-4 hidden rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400 md:block">
              {err}{" "}
              <button onClick={refresh} className="underline">
                Retry
              </button>
            </div>
          )}

          <nav className="flex gap-4 border-b border-[#21262d] text-sm text-[#7d8590]">
            {NAV_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 border-b-2 px-1 pb-3 pt-1 font-medium transition-colors ${
                  activeTab === tab
                    ? "border-[#f78166] text-[#e6edf3]"
                    : "border-transparent hover:text-[#e6edf3]"
                }`}
              >
                {tab}
                {tab === "Repositories" && (
                  <span className="rounded-full bg-[#30363d] px-1.5 py-px text-[11px] text-[#c9d1d9]">
                    {loading ? "—" : user?.public_repos ?? 0}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* README.md — mirrored from github.com/playkashyap/playkashyap */}
          <div className="mt-6 rounded-md border border-[#30363d]">
            <div className="flex items-center gap-2 border-b border-[#21262d] px-4 py-3 text-sm text-[#7d8590]">
              <IconBook className="h-4 w-4" />
              README.md
            </div>

            <div className="px-6 py-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-[#e6edf3]">
                  Shubham Kumar Prajapati
                </h3>
                <p className="mt-1 text-sm text-[#7d8590]">
                  Fullstack Developer &amp; AI/LLM Engineer
                </p>
                <p className="mt-3 font-mono text-xs text-[#39d0d8]">
                  Building systems that see, think, and respond — GPU
                  surveillance &#183; Custom LLM infra &#183; Local-first AI
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {CONNECT_BADGES.map((b) => (
                    <Pill
                      key={b.label}
                      label={b.label}
                      color={b.color}
                      text={b.text}
                      href={b.href}
                    />
                  ))}
                </div>
              </div>

              <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-[#c9d1d9]">
                I&apos;m a fullstack developer and AI/LLM engineer based in
                Vadodara, India, working at the intersection of computer
                vision, real-time infrastructure, and large language models.
                At{" "}
                <strong className="text-[#e6edf3]">Mostedge</strong>, I
                architect and build production systems — GPU-accelerated
                surveillance pipelines, custom LLM hosting stacks, and the
                distributed services that keep them running. Outside work, I
                build things I&apos;d actually want to use: a local AI
                assistant that sees and hears, and a developer workbench
                that&apos;s now a live product.
              </p>

              <pre className="mt-6 overflow-x-auto rounded-md border border-[#30363d] bg-[#161b22] p-4 font-mono text-xs leading-relaxed text-[#c9d1d9]">
                {`const shubham = {
  role: "Fullstack Developer & AI/LLM Engineer",
  location: "Vadodara, India",
  currentlyAt: "Mostedge",
  philosophy: "Ship systems that see, think, and respond in real time."
};`}
              </pre>

              <h4 className="mt-8 text-sm font-semibold text-[#e6edf3]">
                ⚡ What I&apos;m building right now
              </h4>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {BUILDING_NOW.map((b) => (
                  <div
                    key={b.title}
                    className="rounded-md border border-[#30363d] p-4"
                  >
                    <div className="text-sm font-semibold text-[#e6edf3]">
                      {b.emoji} {b.title}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#8b949e]">
                      {b.description}
                    </p>
                    {b.link && (
                      <a
                        href={b.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-[#58a6ff] hover:underline"
                      >
                        → {b.link.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {b.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded border border-[#30363d] bg-[#161b22] px-1.5 py-0.5 font-mono text-[10px] text-[#7d8590]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <h4 className="mt-8 text-sm font-semibold text-[#e6edf3]">
                🧬 Tech Stack
              </h4>
              <div className="mt-3 flex flex-col gap-4">
                {TECH_STACK.map((group) => (
                  <div key={group.category}>
                    <div className="text-xs font-semibold text-[#7d8590]">
                      {group.category}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {group.badges.map((b) => (
                        <Pill
                          key={b.label}
                          label={b.label}
                          color={b.color}
                          text={b.text}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-center text-xs italic text-[#7d8590]">
                Always building. Always shipping. Open to senior fullstack
                &amp; AI/LLM engineering roles — remote or India-based.
              </p>

              <details className="mt-6 rounded-md border border-[#30363d] p-3 text-xs text-[#c9d1d9]">
                <summary className="cursor-pointer select-none font-medium text-[#e6edf3]">
                  🐚 click for a terminal joke
                </summary>
                <pre className="mt-3 overflow-x-auto rounded bg-[#161b22] p-3 font-mono text-[11px] leading-relaxed text-[#7ee787]">
                  {`$ whoami --verbose
shubham@vadodara:~$ checking credentials...

> role:        fullstack developer, ai/llm engineer
> uptime:      3 years, 0 production incidents caused by me*
> known bugs:  none that survived code review
> coffee:      [████████████████░░] 80% — refilling soon

*citation needed`}
                </pre>
              </details>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#e6edf3]">
              Popular repositories
            </h2>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[126px] animate-pulse rounded-md border border-[#30363d] bg-[#161b22]"
                  />
                ))
              : repos.map((repo) => <RepoCard key={repo.name} repo={repo} />)}
          </div>

          {snakeOk && (
            <div className="mt-8">
              <h2 className="text-base font-semibold text-[#e6edf3]">
                Contribution activity
              </h2>
              <div className="mt-3 overflow-x-auto rounded-md border border-[#30363d] p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}/output/github-contribution-grid-snake.svg`}
                  alt={`${GITHUB_USERNAME}'s GitHub contribution snake`}
                  className="w-full min-w-[640px]"
                  onError={() => setSnakeOk(false)}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
