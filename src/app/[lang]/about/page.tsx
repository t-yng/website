import type { Metadata } from "next";
import { css } from "@/styled-system/css";

export const metadata: Metadata = {
  title: "About — Tomohiro Yanagi",
  description: "Learn more about me and my background.",
};

const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "GraphQL",
  "Docker",
  "AWS",
];

const experience = [
  {
    company: "Company Name",
    role: "Senior Software Engineer",
    period: "2022 — Present",
    description:
      "Led frontend architecture decisions, improved Core Web Vitals scores across products, and mentored junior engineers.",
  },
  {
    company: "Previous Company",
    role: "Software Engineer",
    period: "2019 — 2022",
    description:
      "Built and shipped features across a React/Node.js stack, collaborated with design to implement accessible UI components.",
  },
  {
    company: "Startup Inc.",
    role: "Frontend Developer",
    period: "2017 — 2019",
    description:
      "Developed the company's customer-facing web application from the ground up using Vue.js and REST APIs.",
  },
];

export default function AboutPage() {
  return (
    <div
      className={css({
        maxWidth: "token(sizes.container)",
        mx: "auto",
        px: { base: "6", md: "8" },
        py: { base: "16", md: "24" },
      })}
    >
      {/* Heading */}
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
        About Me
      </h1>

      <div
        className={css({
          width: "40px",
          height: "3px",
          backgroundColor: "token(colors.accent)",
          borderRadius: "full",
          mb: "10",
        })}
      />

      {/* Bio */}
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", md: "1fr 2fr" },
          gap: { base: "10", md: "16" },
          mb: "16",
          alignItems: "start",
        })}
      >
        <div
          className={css({
            width: "100%",
            aspectRatio: "1",
            backgroundColor: "token(colors.border)",
            borderRadius: "lg",
            maxWidth: "240px",
          })}
          aria-label="Profile photo placeholder"
        />

        <div>
          <p
            className={css({
              fontSize: "lg",
              color: "token(colors.secondary)",
              lineHeight: "1.8",
              mb: "5",
            })}
          >
            I'm a software developer with 7+ years of experience building web applications. I care
            deeply about writing clean, maintainable code and creating experiences that are fast and
            accessible for everyone.
          </p>
          <p
            className={css({
              fontSize: "lg",
              color: "token(colors.secondary)",
              lineHeight: "1.8",
            })}
          >
            When I'm not coding, you'll find me reading, hiking, or experimenting with new cooking
            recipes. I'm based in Tokyo, Japan and open to remote work worldwide.
          </p>
        </div>
      </div>

      {/* Skills */}
      <section className={css({ mb: "16" })} aria-labelledby="skills-heading">
        <h2
          id="skills-heading"
          className={css({
            fontFamily: "token(fonts.heading)",
            fontSize: "2xl",
            fontWeight: "700",
            color: "token(colors.text)",
            letterSpacing: "-0.02em",
            mb: "6",
          })}
        >
          Skills
        </h2>
        <ul
          className={css({
            display: "flex",
            flexWrap: "wrap",
            gap: "3",
            listStyle: "none",
            p: 0,
            m: 0,
          })}
        >
          {skills.map((skill) => (
            <li
              key={skill}
              className={css({
                px: "4",
                py: "2",
                border: "1px solid token(colors.border)",
                borderRadius: "full",
                fontSize: "sm",
                fontWeight: "500",
                color: "token(colors.secondary)",
                backgroundColor: "token(colors.surface)",
              })}
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>

      {/* Experience */}
      <section aria-labelledby="experience-heading">
        <h2
          id="experience-heading"
          className={css({
            fontFamily: "token(fonts.heading)",
            fontSize: "2xl",
            fontWeight: "700",
            color: "token(colors.text)",
            letterSpacing: "-0.02em",
            mb: "8",
          })}
        >
          Experience
        </h2>

        <ol
          className={css({
            listStyle: "none",
            p: 0,
            m: 0,
            display: "flex",
            flexDirection: "column",
            gap: "8",
          })}
        >
          {experience.map((item) => (
            <li
              key={item.company}
              className={css({
                display: "grid",
                gridTemplateColumns: { base: "1fr", sm: "160px 1fr" },
                gap: { base: "1", sm: "8" },
                pb: "8",
                borderBottom: "1px solid token(colors.border)",
                _last: { borderBottom: "none", pb: 0 },
              })}
            >
              <span
                className={css({
                  fontSize: "sm",
                  color: "token(colors.muted)",
                  fontWeight: "500",
                  pt: { sm: "1" },
                })}
              >
                {item.period}
              </span>
              <div>
                <h3
                  className={css({
                    fontFamily: "token(fonts.heading)",
                    fontSize: "lg",
                    fontWeight: "600",
                    color: "token(colors.text)",
                    mb: "1",
                  })}
                >
                  {item.role}
                </h3>
                <p
                  className={css({
                    fontSize: "sm",
                    color: "token(colors.accent)",
                    fontWeight: "500",
                    mb: "3",
                  })}
                >
                  {item.company}
                </p>
                <p
                  className={css({
                    fontSize: "base",
                    color: "token(colors.secondary)",
                    lineHeight: "1.7",
                  })}
                >
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
