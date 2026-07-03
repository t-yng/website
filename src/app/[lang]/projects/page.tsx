import type { Metadata } from "next";
import { css } from "@/styled-system/css";
import { ProjectCard } from "./_components/ProjectCard";
import type { Project } from "./_components/ProjectCard";

export const metadata: Metadata = {
  title: "Projects — Tomohiro Yanagi",
  description: "A selection of projects I've built.",
};

const projects: Project[] = [
  {
    title: "Claude Review Dashboard",
    description:
      "A local web app that lets Claude review your GitHub pull requests, then lets a human cherry-pick only the valuable findings and post them back as inline review comments. Reuses your existing Claude Code and gh CLI auth, checks out each PR into a temp dir so the AI can explore the whole codebase, and streams review progress over SSE.",
    tags: ["Next.js", "TypeScript", "React", "Claude Agent SDK", "GitHub CLI"],
    github: "https://github.com/t-yng/claude-review-dashboard",
    image: "/images/projects/claude-review-dashboard.png",
  },
  {
    title: "Review Cat",
    description:
      "A desktop app for managing GitHub pull requests that need your review. Aggregates review requests across multiple repositories so you can triage and act on them quickly.",
    tags: ["TypeScript", "React", "GraphQL", "Electron", "GitHub API"],
    github: "https://github.com/t-yng/review-cat",
    image: "/images/projects/review-cat.png",
  },
  {
    title: "Wasm Othello",
    description:
      "An Othello game running in the browser with a CPU opponent powered by WebAssembly. Implemented the game AI algorithm from scratch in Rust and benchmarked it against a JavaScript equivalent to quantify the real-world performance gains of WASM.",
    tags: ["Next.js", "TypeScript", "Rust", "WebAssembly"],
    github: "https://github.com/t-yng/wasm-othello",
    live: "https://wasm-othello.t-yng.jp/",
    image: "/images/projects/wasm-othello.png",
  },
];

export default function ProjectsPage() {
  return (
    <div
      className={css({
        maxWidth: "token(sizes.containerWide)",
        mx: "auto",
        px: { base: "6", md: "8" },
        py: { base: "16", md: "24" },
      })}
    >
      <h1
        className={css({
          fontFamily: "token(fonts.heading)",
          fontSize: { base: "2xl", md: "3xl" },
          fontWeight: "700",
          color: "token(colors.text)",
          letterSpacing: "-0.03em",
          mb: "4",
        })}
      >
        Projects
      </h1>
      <div
        className={css({
          width: "40px",
          height: "3px",
          backgroundColor: "token(colors.accent)",
          borderRadius: "full",
          mb: "4",
        })}
      />
      <p
        className={css({
          fontSize: "lg",
          color: "token(colors.secondary)",
          mb: "12",
          maxWidth: "560px",
        })}
      >
        A selection of personal and open-source projects I&apos;ve worked on.
      </p>

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
          gap: "6",
        })}
      >
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}
