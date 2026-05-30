import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { css } from "@/styled-system/css";
import { sortPostsByDateDesc } from "@/lib/sort";
import { range } from "@/lib/array";
import { PAGINATION_POST_COUNT_PER_PAGE, PAGINATION_MIDDLE_PAGES } from "@/constants";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { PostRepository } from "../../_repositories/PostRepository";
import { PostEntry } from "../../_components/PostEntry";
import { Pagination } from "../../_components/Pagination";

type Props = {
  params: Promise<{ lang: string; page: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  return { title: `Blog — Page ${page}` };
}

export function generateStaticParams() {
  return locales.flatMap((lang) => {
    const posts = new PostRepository().getAllPosts(lang);
    const numPages = Math.ceil(posts.length / PAGINATION_POST_COUNT_PER_PAGE);
    return range(2, numPages - 1).map((page) => ({ lang, page: page.toString() }));
  });
}

export default async function BlogPageN({ params }: Props) {
  const { lang, page: pageStr } = await params;
  const locale = lang as Locale;
  const page = Number(pageStr);
  if (isNaN(page) || page < 2) notFound();

  const allPosts = sortPostsByDateDesc(new PostRepository().getAllPosts(locale));
  const numPages = Math.ceil(allPosts.length / PAGINATION_POST_COUNT_PER_PAGE);
  if (page > numPages) notFound();

  const posts = allPosts.slice(
    (page - 1) * PAGINATION_POST_COUNT_PER_PAGE,
    page * PAGINATION_POST_COUNT_PER_PAGE,
  );

  return (
    <div
      className={css({
        maxWidth: "token(sizes.container)",
        mx: "auto",
        px: { base: "6", md: "8" },
        py: { base: "16", md: "24" },
      })}
    >
      <h1
        className={css({
          fontFamily: "token(fonts.heading)",
          fontSize: { base: "3xl", md: "4xl" },
          fontWeight: "700",
          color: "token(colors.text)",
          letterSpacing: "-0.03em",
          mb: "4",
        })}
      >
        Blog
      </h1>
      <div
        className={css({
          width: "40px",
          height: "3px",
          backgroundColor: "token(colors.accent)",
          borderRadius: "full",
          mb: "12",
        })}
      />

      <ol className={css({ listStyle: "none", p: 0, m: 0 })}>
        {posts.map((post) => (
          <PostEntry key={post.id} post={post} locale={locale} />
        ))}
      </ol>

      <Pagination
        currentPage={page}
        numPages={numPages}
        middleNumPages={PAGINATION_MIDDLE_PAGES}
        locale={locale}
      />
    </div>
  );
}
