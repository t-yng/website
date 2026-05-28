import type { Metadata } from "next";
import { css } from "@/styled-system/css";

export const metadata: Metadata = {
  title: "About — Tomohiro Yanagi",
  description: "Learn more about me and my background.",
};

const skills = [
  "TypeScript",
  "JavaScript",
  "Python",
  "PHP",
  "React",
  "Next.js",
  "Vue.js",
  "Nuxt.js",
  "Node.js",
  "NestJS",
  "Express",
  "FastAPI",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "AWS",
  "Docker",
  "Terraform",
  "GitHub Actions",
  "Jest",
  "Vitest",
  "Playwright",
];

const experience = [
  {
    company: "OPENHEART Inc.",
    role: "Full Stack Developer",
    period: "Aug 2024 — Present",
    bullets: [
      "Led backend architecture, database design, and web API development with TypeScript, Node.js, NestJS and AWS.",
      "Designed a scalable cloud 3D data generation pipeline integrating object storage (R2) and a distributed job queue (SQS) to enable asynchronous processing of long-running jobs.",
      "Implemented performance monitoring with Datadog and improved RESTful API latency by 50% by eliminating key bottlenecks.",
      "Designed and maintained CI/CD pipelines using GitHub Actions, reducing CI test runtime by 50%.",
      "Built an AI-powered bug-fix pipeline using GenAI tools to auto-generate PRs and documentation, cutting bug resolution lead time by 30%.",
      "Designed and implemented automated test suites using Jest, reaching 70% coverage for critical backend services.",
    ],
  },
  {
    company: "YAMAP Inc.",
    role: "Frontend Developer",
    period: "Jun 2021 — Mar 2024",
    bullets: [
      "Led the frontend team as Tech Lead, mentoring junior engineers through pair programming, structured code reviews, and regular feedback cycles.",
      "Reduced render time from 200ms to 50ms by optimizing React component state updates and lifecycles to eliminate unnecessary re-renders.",
      "Aligned code review goals across the team and reinforced coding standards to prevent regressions and reduce spec-miss defects.",
      "Drove test automation adoption end-to-end, raising coverage from 2% to 65% and unblocking regular dependency upgrades.",
    ],
  },
  {
    company: "Hamee Corp.",
    role: "Full Stack Developer",
    period: "Apr 2016 — May 2021",
    bullets: [
      "Built and maintained E-commerce SaaS platform features using PHP and HTML/CSS/JavaScript.",
      "Led the migration of a legacy E-Commerce platform UI, refactoring 10,000+ lines of code to improve performance and maintainability.",
      "Designed and implemented a memory-efficient chunked CSV import feature with PHP, processing 10,000+ rows without memory overflow.",
      "Developed API servers using Node.js and AWS Lambda to facilitate communication between mobile applications and IoT products.",
    ],
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
          mb: "6",
        })}
      />

      {/* Bio */}
      <div
        className={css({
          mb: "16",
        })}
      >
        <div>
          <p
            className={css({
              fontSize: "lg",
              color: "token(colors.secondary)",
              lineHeight: "1.8",
              mb: "5",
            })}
          >
            I&apos;m a Full Stack Developer with 9+ years of experience building web applications
            using TypeScript, Node.js, and React. I take end-to-end ownership from requirements
            analysis and system design to backend development, frontend implementation, testing, and
            deployment.
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
                pb: "8",
                borderBottom: "1px solid token(colors.border)",
                _last: { borderBottom: "none", pb: 0 },
              })}
            >
              <div
                className={css({
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: "1",
                  mb: "1",
                })}
              >
                <h3
                  className={css({
                    fontFamily: "token(fonts.heading)",
                    fontSize: "lg",
                    fontWeight: "600",
                    color: "token(colors.text)",
                  })}
                >
                  {item.role}
                </h3>
                <span
                  className={css({
                    fontSize: "sm",
                    color: "token(colors.muted)",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                  })}
                >
                  {item.period}
                </span>
              </div>
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
              <ul
                className={css({
                  listStyle: "disc",
                  p: 0,
                  m: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "2",
                  pl: "4",
                })}
              >
                {item.bullets.map((bullet, i) => (
                  <li
                    key={i}
                    className={css({
                      fontSize: "base",
                      color: "token(colors.secondary)",
                      lineHeight: "1.7",
                      position: "relative",
                    })}
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
