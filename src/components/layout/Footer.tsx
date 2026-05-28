import { css } from "@/styled-system/css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className={css({
        borderTop: "1px solid token(colors.border)",
        mt: "auto",
      })}
    >
      <div
        className={css({
          maxWidth: "token(sizes.containerWide)",
          mx: "auto",
          px: { base: "6", md: "8" },
          py: "8",
          display: "flex",
          flexDirection: { base: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4",
        })}
      >
        <p
          className={css({
            fontSize: "sm",
            color: "token(colors.muted)",
          })}
        >
          © {year} Tomohiro Yanagi. All rights reserved.
        </p>

        <div
          className={css({
            display: "flex",
            gap: "6",
          })}
        >
          {[
            { href: "https://github.com", label: "GitHub" },
            { href: "https://linkedin.com", label: "LinkedIn" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={css({
                fontSize: "sm",
                color: "token(colors.muted)",
                _hover: { color: "token(colors.text)" },
                transition: "color 0.2s",
              })}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
