import Link from "next/link";
import { css } from "@/styled-system/css";
import type { Locale } from "@/repositories/PostRepository";

type Props = {
  currentLocale: Locale;
  jaHref: string;
  enHref: string;
  enAvailable?: boolean;
};

export function LanguageSwitcher({ currentLocale, jaHref, enHref, enAvailable = true }: Props) {
  return (
    <div
      className={css({
        display: "flex",
        gap: "1",
        alignItems: "center",
      })}
    >
      <Link
        href={jaHref}
        aria-current={currentLocale === "ja" ? "page" : undefined}
        className={css({
          fontSize: "xs",
          fontWeight: "500",
          px: "2",
          py: "1",
          borderRadius: "sm",
          border: "1px solid token(colors.border)",
          transition: "all 0.2s",
          color: currentLocale === "ja" ? "white" : "token(colors.secondary)",
          backgroundColor: currentLocale === "ja" ? "token(colors.accent)" : "transparent",
          borderColor: currentLocale === "ja" ? "token(colors.accent)" : "token(colors.border)",
          _hover:
            currentLocale === "ja"
              ? {}
              : {
                  color: "token(colors.text)",
                  borderColor: "token(colors.text)",
                },
          cursor: currentLocale === "ja" ? "default" : "pointer",
        })}
      >
        JA
      </Link>

      {enAvailable ? (
        <Link
          href={enHref}
          aria-current={currentLocale === "en" ? "page" : undefined}
          className={css({
            fontSize: "xs",
            fontWeight: "500",
            px: "2",
            py: "1",
            borderRadius: "sm",
            border: "1px solid token(colors.border)",
            transition: "all 0.2s",
            color: currentLocale === "en" ? "white" : "token(colors.secondary)",
            backgroundColor: currentLocale === "en" ? "token(colors.accent)" : "transparent",
            borderColor: currentLocale === "en" ? "token(colors.accent)" : "token(colors.border)",
            _hover:
              currentLocale === "en"
                ? {}
                : {
                    color: "token(colors.text)",
                    borderColor: "token(colors.text)",
                  },
            cursor: currentLocale === "en" ? "default" : "pointer",
          })}
        >
          EN
        </Link>
      ) : (
        <span
          className={css({
            fontSize: "xs",
            fontWeight: "500",
            px: "2",
            py: "1",
            borderRadius: "sm",
            border: "1px solid token(colors.border)",
            color: "token(colors.muted)",
            cursor: "not-allowed",
            opacity: "0.4",
          })}
          title="No English version available"
        >
          EN
        </span>
      )}
    </div>
  );
}
