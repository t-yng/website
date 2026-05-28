import { css } from "@/styled-system/css";

type Props = {
  html: string;
};

export function PostContent({ html }: Props) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className={css({
        "& h2, & h3, & h4": {
          fontFamily: "token(fonts.heading)",
          color: "token(colors.text)",
          marginTop: "2.5rem",
          marginBottom: "1rem",
          fontWeight: "600",
          letterSpacing: "-0.02em",
        },
        "& h2": {
          fontSize: "2xl",
          borderBottom: "1px solid token(colors.border)",
          paddingBottom: "0.5rem",
        },
        "& h3": {
          fontSize: "xl",
        },
        "& h4": {
          fontSize: "lg",
        },
        "& p": {
          marginTop: "1rem",
          lineHeight: "1.8",
          color: "token(colors.text)",
        },
        "& a": {
          color: "token(colors.accent)",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
          _hover: { color: "token(colors.accentHover)" },
        },
        "& img": {
          maxWidth: "100%",
          height: "auto",
          marginTop: "1rem",
          borderRadius: "md",
        },
        "& blockquote": {
          borderLeft: "4px solid token(colors.accent)",
          color: "token(colors.secondary)",
          padding: "0.75rem 1rem",
          margin: "1.5rem 0",
          backgroundColor: "token(colors.surface)",
          borderRadius: "0 md md 0",
        },
        "& blockquote p": {
          marginTop: "0",
          marginBottom: "0",
        },
        "& pre": {
          fontSize: "0.875rem",
          marginTop: "1rem",
          borderRadius: "md",
          overflow: "auto",
        },
        "& pre:has(code)": {
          padding: "1rem",
        },
        "& code": {
          fontSize: "0.875rem",
          fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
        },
        "& :not(pre) code": {
          backgroundColor: "token(colors.surface)",
          border: "1px solid token(colors.border)",
          borderRadius: "sm",
          padding: "0.1em 0.4em",
        },
        "& table": {
          borderCollapse: "collapse",
          display: "block",
          width: "100%",
          overflow: "auto",
          margin: "1rem 0",
        },
        "& table th, & table td": {
          padding: "6px 13px",
          border: "1px solid token(colors.border)",
        },
        "& thead th": {
          backgroundColor: "token(colors.surface)",
          fontWeight: "600",
        },
        "& table tr:nth-child(even)": {
          backgroundColor: "token(colors.surface)",
        },
        "& ul, & ol": {
          paddingLeft: "1.8em",
          marginTop: "1rem",
        },
        "& li": {
          marginTop: "0.25rem",
          lineHeight: "1.8",
          color: "token(colors.text)",
        },
        "& hr": {
          border: "none",
          borderTop: "1px solid token(colors.border)",
          margin: "2rem 0",
        },
      })}
    />
  );
}
