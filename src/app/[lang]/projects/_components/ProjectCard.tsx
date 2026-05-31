import Image from "next/image";
import { css } from "@/styled-system/css";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { ButtonLink } from "@/components/ButtonLink";
import { IconLink } from "@/components/IconLink";

export type Project = {
  title: string;
  description: string;
  tags: string[];
  github: string;
  live?: string;
  image?: string;
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className={css({
        backgroundColor: "token(colors.surface)",
        border: "1px solid token(colors.border)",
        borderRadius: "lg",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        _hover: {
          borderColor: "token(colors.secondary)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        },
        transition: "border-color 0.2s, box-shadow 0.2s",
      })}
    >
      {project.image && (
        <div
          className={css({
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            flexShrink: 0,
          })}
        >
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            className={css({ objectFit: "cover" })}
          />
        </div>
      )}

      <div
        className={css({
          px: "6",
          pb: "6",
          pt: "6",
          display: "flex",
          flexDirection: "column",
          gap: "4",
          flexGrow: 1,
        })}
      >
        <h3
          className={css({
            fontFamily: "token(fonts.heading)",
            fontSize: "lg",
            fontWeight: "600",
            color: "token(colors.text)",
            letterSpacing: "-0.01em",
          })}
        >
          {project.title}
        </h3>

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

        <div
          className={css({
            display: "flex",
            gap: "3",
            alignItems: "center",
          })}
        >
          {project.live && (
            <ButtonLink
              variant="outline"
              href={project.live}
              size="xs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Live
            </ButtonLink>
          )}
          <IconLink
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            ariaLabel={`${project.title} GitHub repository`}
          >
            <GitHubIcon size={24} />
          </IconLink>
        </div>
      </div>
    </article>
  );
}
