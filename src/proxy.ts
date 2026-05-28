import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";
import { getLocaleCookie } from "@/lib/cookie";

function detectLocale(request: NextRequest): Locale {
  const cookieLocale = getLocaleCookie(request.cookies.toString());
  if (cookieLocale) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language") ?? "";

  const preferred = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, q] = part.trim().split(";q=");
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q)
    .map(({ lang }) => lang);

  for (const lang of preferred) {
    const match = locales.find((locale) => locale === lang || lang.startsWith(`${locale}-`));
    if (match) return match;
  }

  return defaultLocale;
}

function extractLocaleFromPath(pathname: string): Locale | null {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathLocale = extractLocaleFromPath(pathname);

  if (pathLocale) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", pathLocale);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const locale = detectLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|images|public).*)"],
};
