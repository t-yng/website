import type { Metadata } from "next";
import { css } from "@/styled-system/css";
import { PostRepository } from "@/repositories/PostRepository";
import { sortPostsByDateDesc } from "@/lib/sort";
import { PAGINATION_POST_COUNT_PER_PAGE, PAGINATION_MIDDLE_PAGES } from "@/constants";
import { PostEntry } from "./_components/PostEntry";
import { Pagination } from "./_components/Pagination";
import type { Locale } from "@/repositories/PostRepository";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical articles and notes on software development.",
};

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  const allPosts = sortPostsByDateDesc(new PostRepository().getAllPosts(locale));
  const posts = allPosts.slice(0, PAGINATION_POST_COUNT_PER_PAGE);
  const numPages = Math.ceil(allPosts.length / PAGINATION_POST_COUNT_PER_PAGE);

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
          mb: "4",
        })}
      />
      <p
        className={css({
          fontSize: "lg",
          color: "token(colors.secondary)",
          mb: "12",
        })}
      >
        {locale === "ja"
          ? "技術的な学びや調査内容などを書き留めているブログです。"
          : "Technical articles and notes on software development."}
      </p>

      <ol className={css({ listStyle: "none", p: 0, m: 0 })}>
        {posts.map((post) => (
          <PostEntry key={post.id} post={post} locale={locale} />
        ))}
      </ol>

      <Pagination
        currentPage={1}
        numPages={numPages}
        middleNumPages={PAGINATION_MIDDLE_PAGES}
        locale={locale}
      />
    </div>
  );
}
