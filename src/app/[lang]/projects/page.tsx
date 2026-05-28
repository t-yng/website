import type { Metadata } from "next";
import { css } from "@/styled-system/css";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";

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
            <GitHubIcon size={18} />
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
              <ExternalLinkIcon size={18} />
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
