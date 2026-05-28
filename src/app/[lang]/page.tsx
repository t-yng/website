import Link from "next/link";
import { css } from "@/styled-system/css";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  return (
    <section
      className={css({
        maxWidth: "token(sizes.containerWide)",
        mx: "auto",
        px: { base: "6", md: "8" },
        py: { base: "20", md: "32" },
        minHeight: "calc(100vh - 65px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      })}
    >
      <div
        className={css({
          maxWidth: "token(sizes.container)",
        })}
      >
        <p
          className={css({
            fontSize: "sm",
            fontWeight: "500",
            color: "token(colors.accent)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            mb: "4",
          })}
        >
          Software Developer
        </p>

        <h1
          className={css({
            fontFamily: "token(fonts.heading)",
            fontSize: { base: "4xl", md: "6xl" },
            fontWeight: "700",
            color: "token(colors.text)",
            letterSpacing: "-0.03em",
            lineHeight: "1.1",
            mb: "6",
          })}
        >
          Hi, I&apos;m Tomohiro Yanagi.
          <br />
          <span
            className={css({
              color: "token(colors.secondary)",
            })}
          >
            I build things for the web.
          </span>
        </h1>

        <p
          className={css({
            fontSize: { base: "lg", md: "xl" },
            color: "token(colors.secondary)",
            lineHeight: "1.75",
            mb: "10",
            maxWidth: "560px",
          })}
        >
          I'm a software developer focused on building clean, performant, and accessible web
          experiences. Currently open to new opportunities.
        </p>

        <div
          className={css({
            display: "flex",
            gap: "4",
            flexWrap: "wrap",
          })}
        >
          <Link
            href={`/${lang}/projects`}
            className={css({
              display: "inline-flex",
              alignItems: "center",
              px: "6",
              py: "3",
              backgroundColor: "token(colors.buttonBg)",
              color: "token(colors.buttonText)",
              borderRadius: "md",
              fontSize: "sm",
              fontWeight: "600",
              cursor: "pointer",
              _hover: { opacity: 0.85 },
              transition: "opacity 0.2s",
            })}
          >
            View Projects
          </Link>
          <Link
            href={`/${lang}/contact`}
            className={css({
              display: "inline-flex",
              alignItems: "center",
              px: "6",
              py: "3",
              border: "1.5px solid token(colors.border)",
              color: "token(colors.text)",
              borderRadius: "md",
              fontSize: "sm",
              fontWeight: "600",
              cursor: "pointer",
              _hover: {
                borderColor: "token(colors.text)",
                backgroundColor: "token(colors.surface)",
              },
              transition: "border-color 0.2s, background-color 0.2s",
            })}
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
