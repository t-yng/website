import { isLocale, type Locale } from "@/lib/i18n";
import { NextRequest } from "next/server";

const COOKIE_KEYS = {
  locale: "locale",
} as const;

const DEFAULT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getCookie(cookieString: string, name: string): string | undefined {
  return cookieString
    .split(";")
    .map((c) => c.trim().split("="))
    .find(([key]) => key === name)?.[1];
}

export function saveLocaleCookie(locale: Locale) {
  setCookie(COOKIE_KEYS.locale, locale, DEFAULT_COOKIE_MAX_AGE);
}

export function getLocaleCookie(cookieString: string): Locale | null {
  const locale = getCookie(cookieString, COOKIE_KEYS.locale);
  if (locale && isLocale(locale)) {
    return locale;
  }

  return null;
}
