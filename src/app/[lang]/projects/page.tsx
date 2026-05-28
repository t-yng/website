import type { Metadata } from "next";
import { css } from "@/styled-system/css";

export const metadata: Metadata = {
  title: "Projects — Tomohiro Yanagi",
  description: "A selection of projects I've built.",
};

const projects = [
  {
    title: "DevFlow",
    description:
      "A project management tool for developers with GitHub integration, sprint planning, and automated release notes powered by AI.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "OpenAI"],
    github: "https://github.com",
    demo: "https://example.com",
    featured: true,
  },
  {
    title: "Markdown Notes",
    description:
      "A minimalist note-taking app with real-time markdown preview, offline support via IndexedDB, and end-to-end encrypted sync.",
    tags: ["React", "Vite", "IndexedDB", "Web Crypto API"],
    github: "https://github.com",
    demo: "https://example.com",
    featured: true,
  },
  {
    title: "Open Charts",
    description:
      "A lightweight, accessible charting library for React with zero dependencies. Supports bar, line, pie, and scatter charts.",
    tags: ["React", "TypeScript", "SVG", "Open Source"],
    github: "https://github.com",
    featured: false,
  },
  {
    title: "CLI Buddy",
    description:
      "A command-line tool that explains shell commands in plain English and suggests safer alternatives for dangerous operations.",
    tags: ["Go", "OpenAI", "CLI"],
    github: "https://github.com",
    featured: false,
  },
  {
    title: "Recipe Box",
    description:
      "A full-stack recipe management app with ingredient scaling, shopping list generation, and meal planning features.",
    tags: ["Next.js", "Prisma", "tRPC", "Tailwind CSS"],
    github: "https://github.com",
    demo: "https://example.com",
    featured: false,
  },
  {
    title: "Deploy Watch",
    description:
      "A self-hosted monitoring dashboard for tracking deployment health across multiple services with Slack and email alerts.",
    tags: ["Node.js", "Docker", "Redis", "React"],
    github: "https://github.com",
    featured: false,
  },
];

export default function ProjectsPage() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

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

      {/* Featured */}
      <section className={css({ mb: "16" })} aria-label="Featured projects">
        <h2
          className={css({
            fontSize: "xs",
            fontWeight: "600",
            color: "token(colors.muted)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            mb: "6",
          })}
        >
          Featured
        </h2>
        <div
          className={css({
            display: "grid",
            gridTemplateColumns: { base: "1fr", md: "1fr 1fr" },
            gap: "6",
          })}
        >
          {featured.map((project) => (
            <ProjectCard key={project.title} project={project} featured />
          ))}
        </div>
      </section>

      {/* All other projects */}
      <section aria-label="Other projects">
        <h2
          className={css({
            fontSize: "xs",
            fontWeight: "600",
            color: "token(colors.muted)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            mb: "6",
          })}
        >
          Other Projects
        </h2>
        <div
          className={css({
            display: "grid",
            gridTemplateColumns: { base: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
            gap: "4",
          })}
        >
          {rest.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}

type Project = {
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
  featured: boolean;
};

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <article
      className={css({
        backgroundColor: "token(colors.surface)",
        border: "1px solid token(colors.border)",
        borderRadius: "lg",
        p: featured ? "8" : "6",
        display: "flex",
        flexDirection: "column",
        gap: "4",
        _hover: {
          borderColor: "token(colors.secondary)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        },
        transition: "border-color 0.2s, box-shadow 0.2s",
      })}
    >
      <div
        className={css({
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "4",
        })}
      >
        <h3
          className={css({
            fontFamily: "token(fonts.heading)",
            fontSize: featured ? "xl" : "lg",
            fontWeight: "600",
            color: "token(colors.text)",
            letterSpacing: "-0.01em",
          })}
        >
          {project.title}
        </h3>

        <div
          className={css({
            display: "flex",
            gap: "3",
            flexShrink: 0,
          })}
        >
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} GitHub repository`}
            className={css({
              color: "token(colors.muted)",
              _hover: { color: "token(colors.text)" },
              transition: "color 0.2s",
              cursor: "pointer",
            })}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live demo`}
              className={css({
                color: "token(colors.muted)",
                _hover: { color: "token(colors.text)" },
                transition: "color 0.2s",
                cursor: "pointer",
              })}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </div>
      </div>

      <p
        className={css({
          fontSize: "sm",
          color: "token(colors.secondary)",
          lineHeight: "1.7",
          flexGrow: 1,
        })}
      >
        {project.description}
      </p>

      <ul
        className={css({
          display: "flex",
          flexWrap: "wrap",
          gap: "2",
          listStyle: "none",
          p: 0,
          m: 0,
        })}
      >
        {project.tags.map((tag) => (
          <li
            key={tag}
            className={css({
              fontSize: "xs",
              fontWeight: "500",
              color: "token(colors.secondary)",
              backgroundColor: "token(colors.background)",
              border: "1px solid token(colors.border)",
              px: "2.5",
              py: "1",
              borderRadius: "md",
            })}
          >
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}
