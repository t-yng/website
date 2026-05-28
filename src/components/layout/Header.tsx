"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { css } from "@/styled-system/css";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SunIcon } from "@/components/icons/SunIcon";
import { MoonIcon } from "@/components/icons/MoonIcon";
import type { Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
};

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={css({ width: "36px", height: "36px" })} aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={css({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        borderRadius: "md",
        border: "1px solid token(colors.border)",
        color: "token(colors.secondary)",
        backgroundColor: "transparent",
        cursor: "pointer",
        _hover: {
          backgroundColor: "token(colors.surface)",
          color: "token(colors.text)",
        },
        transition: "background-color 0.2s, color 0.2s",
      })}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

export default function Header({ lang }: Props) {
  const pathname = usePathname();

  const navLinks = [
    { href: `/${lang}/about`, label: "About" },
    { href: `/${lang}/projects`, label: "Projects" },
    { href: `/${lang}/blog`, label: "Blog" },
    { href: `/${lang}/contact`, label: "Contact" },
  ];

  const pathWithoutLang = pathname.replace(`/${lang}`, "") || "";
  const jaHref = `/ja${pathWithoutLang}`;
  const enHref = `/en${pathWithoutLang}`;

  return (
    <header
      className={css({
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "color-mix(in srgb, var(--colors-background) 90%, transparent)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid token(colors.border)",
      })}
    >
      <nav
        className={css({
          maxWidth: "token(sizes.containerWide)",
          mx: "auto",
          px: { base: "6", md: "8" },
          py: "4",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        })}
      >
        <Link
          href={`/${lang}`}
          className={css({
            fontFamily: "token(fonts.heading)",
            fontWeight: "700",
            fontSize: "lg",
            color: "token(colors.text)",
            letterSpacing: "-0.02em",
            _hover: { color: "token(colors.accent)" },
            transition: "color 0.2s",
          })}
        >
          Tomohiro Yanagi
        </Link>

        <div
          className={css({
            display: "flex",
            alignItems: "center",
            gap: { base: "4", md: "8" },
          })}
        >
          <ul
            className={css({
              display: "flex",
              gap: { base: "5", md: "8" },
              listStyle: "none",
              m: 0,
              p: 0,
            })}
          >
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={css({
                      fontSize: "sm",
                      fontWeight: isActive ? "600" : "400",
                      color: isActive ? "token(colors.accent)" : "token(colors.secondary)",
                      _hover: { color: "token(colors.text)" },
                      transition: "color 0.2s",
                      position: "relative",
                      _after: isActive
                        ? {
                            content: '""',
                            position: "absolute",
                            bottom: "-2px",
                            left: 0,
                            right: 0,
                            height: "2px",
                            backgroundColor: "token(colors.accent)",
                            borderRadius: "full",
                          }
                        : undefined,
                    })}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <LanguageSwitcher currentLocale={lang} jaHref={jaHref} enHref={enHref} />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
