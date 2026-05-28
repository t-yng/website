import { css } from "@/styled-system/css";
import { ButtonLink } from "@/components/ButtonLink";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  return (
    <div
      className={css({
        position: "relative",
        overflow: "hidden",
      })}
    >
      {/* Blob 1 — top-right, blue */}
      <div
        aria-hidden="true"
        className={css({
          position: "absolute",
          width: "600px",
          height: "600px",
          top: "-150px",
          right: "-150px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)",
          filter: "blur(72px)",
          animation: "blobFloat1 12s ease-in-out infinite",
          pointerEvents: "none",
          _dark: {
            background: "radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%)",
          },
        })}
      />
      {/* Blob 2 — bottom-left, indigo/purple */}
      <div
        aria-hidden="true"
        className={css({
          position: "absolute",
          width: "500px",
          height: "500px",
          bottom: "-100px",
          left: "-100px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          filter: "blur(72px)",
          animation: "blobFloat2 14s ease-in-out infinite",
          pointerEvents: "none",
          _dark: {
            background: "radial-gradient(circle, rgba(129,140,248,0.13) 0%, transparent 70%)",
          },
        })}
      />
      {/* Blob 3 — center, teal accent */}
      <div
        aria-hidden="true"
        className={css({
          position: "absolute",
          width: "400px",
          height: "400px",
          top: "40%",
          left: "55%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "blobFloat3 16s ease-in-out infinite",
          pointerEvents: "none",
          _dark: {
            background: "radial-gradient(circle, rgba(45,212,191,0.1) 0%, transparent 70%)",
          },
        })}
      />

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
          position: "relative",
          zIndex: 1,
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
            I&apos;m a software developer focused on building clean, performant, and accessible web
            experiences. Currently open to new opportunities.
          </p>

          <div
            className={css({
              display: "flex",
              gap: "4",
              flexWrap: "wrap",
            })}
          >
            <ButtonLink href={`/${lang}/about`}>View my profile</ButtonLink>
            <ButtonLink href={`/${lang}/projects`} variant="outline">
              View projects
            </ButtonLink>
            <ButtonLink href={`/${lang}/blog`} variant="outline">
              View blog
            </ButtonLink>
            <ButtonLink href={`/${lang}/contact`} variant="outline">
              Get in Touch
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
