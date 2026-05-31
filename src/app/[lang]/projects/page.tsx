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
    title: "DevFlow",
    description:
      "A project management tool for developers with GitHub integration, sprint planning, and automated release notes powered by AI.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "OpenAI"],
    github: "https://github.com",
    live: "https://example.com",
  },
  {
    title: "Markdown Notes",
    description:
      "A minimalist note-taking app with real-time markdown preview, offline support via IndexedDB, and end-to-end encrypted sync.",
    tags: ["React", "Vite", "IndexedDB", "Web Crypto API"],
    github: "https://github.com",
    live: "https://example.com",
    image: "https://placehold.co/600x400.png",
  },
  {
    title: "Open Charts",
    description:
      "A lightweight, accessible charting library for React with zero dependencies. Supports bar, line, pie, and scatter charts.",
    tags: ["React", "TypeScript", "SVG", "Open Source"],
    github: "https://github.com",
    image: "https://placehold.co/600x400.png",
  },
  {
    title: "CLI Buddy",
    description:
      "A command-line tool that explains shell commands in plain English and suggests safer alternatives for dangerous operations.",
    tags: ["Go", "OpenAI", "CLI"],
    github: "https://github.com",
    image: "https://placehold.co/600x400.png",
  },
  {
    title: "Recipe Box",
    description:
      "A full-stack recipe management app with ingredient scaling, shopping list generation, and meal planning features.",
    tags: ["Next.js", "Prisma", "tRPC", "Tailwind CSS"],
    github: "https://github.com",
    live: "https://example.com",
  },
  {
    title: "Deploy Watch",
    description:
      "A self-hosted monitoring dashboard for tracking deployment health across multiple services with Slack and email alerts.",
    tags: ["Node.js", "Docker", "Redis", "React"],
    github: "https://github.com",
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
          columns: { base: 1, md: 2 },
          columnGap: "6",
        })}
      >
        {projects.map((project) => (
          <div
            key={project.title}
            className={css({
              breakInside: "avoid",
              mb: "6",
            })}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
