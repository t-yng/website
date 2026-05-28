import Link from "next/link";
import { css } from "@/styled-system/css";
import { range } from "@/lib/array";
import type { Locale } from "@/lib/i18n";

type Props = {
  currentPage: number;
  numPages: number;
  middleNumPages: number;
  locale?: Locale;
};

function pageLink(page: number, locale: Locale = "ja") {
  const base = `/${locale}/blog`;
  return page === 1 ? base : `${base}/page/${page}`;
}

function PageItem({
  page,
  currentPage,
  locale,
}: {
  page: number;
  currentPage: number;
  locale: Locale;
}) {
  const isActive = page === currentPage;
  return (
    <Link
      href={pageLink(page, locale)}
      aria-label={`Page ${page}`}
      aria-current={isActive ? "page" : undefined}
      className={css({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        borderRadius: "full",
        fontSize: "sm",
        fontWeight: isActive ? "600" : "400",
        color: isActive ? "white" : "token(colors.secondary)",
        backgroundColor: isActive ? "token(colors.accent)" : "transparent",
        border: isActive ? "none" : "1px solid token(colors.border)",
        _hover: {
          backgroundColor: isActive ? "token(colors.accentHover)" : "token(colors.surface)",
          color: isActive ? "white" : "token(colors.text)",
        },
        transition: "all 0.2s",
        cursor: isActive ? "default" : "pointer",
      })}
    >
      {page}
    </Link>
  );
}

export function Pagination({ currentPage, numPages, middleNumPages, locale = "ja" }: Props) {
  if (numPages <= 1) return null;

  let middleStart = currentPage - Math.floor(middleNumPages / 2);
  if (middleStart + middleNumPages > numPages) middleStart = numPages - middleNumPages;
  if (middleStart < 2) middleStart = 2;

  const middlePages = range(middleStart, middleNumPages).filter((p) => p < numPages);

  const ellipsis = (
    <span className={css({ fontSize: "sm", color: "token(colors.muted)", px: "1" })}>…</span>
  );

  return (
    <nav
      aria-label="Pagination"
      className={css({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2",
        py: "12",
      })}
    >
      {currentPage > 1 && (
        <Link
          href={pageLink(currentPage - 1, locale)}
          aria-label="Previous page"
          className={css({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "full",
            border: "1px solid token(colors.border)",
            color: "token(colors.secondary)",
            fontSize: "sm",
            _hover: { backgroundColor: "token(colors.surface)", color: "token(colors.text)" },
            transition: "all 0.2s",
          })}
        >
          ‹
        </Link>
      )}

      <PageItem page={1} currentPage={currentPage} locale={locale} />
      {middleStart > 2 && ellipsis}
      {middlePages.map((p) => (
        <PageItem key={p} page={p} currentPage={currentPage} locale={locale} />
      ))}
      {middleStart < numPages - middleNumPages && ellipsis}
      {numPages > 1 && <PageItem page={numPages} currentPage={currentPage} locale={locale} />}

      {currentPage < numPages && (
        <Link
          href={pageLink(currentPage + 1, locale)}
          aria-label="Next page"
          className={css({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "full",
            border: "1px solid token(colors.border)",
            color: "token(colors.secondary)",
            fontSize: "sm",
            _hover: { backgroundColor: "token(colors.surface)", color: "token(colors.text)" },
            transition: "all 0.2s",
          })}
        >
          ›
        </Link>
      )}
    </nav>
  );
}
