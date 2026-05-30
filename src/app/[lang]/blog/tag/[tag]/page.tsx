import type { Metadata } from "next";
import { css } from "@/styled-system/css";
import { sortPostsByDateDesc } from "@/lib/sort";
import { locales, type Locale } from "@/lib/i18n";
import { PostRepository } from "../../_repositories/PostRepository";
import { TagRepository } from "../../_repositories/TagRepository";
import { PostEntry } from "../../_components/PostEntry";

type Props = {
  params: Promise<{ lang: string; tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);
  return { title: `Blog — ${tag}` };
}

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    new TagRepository().getAllTags(lang).map((tag) => ({
      lang,
      tag: encodeURIComponent(tag.name.toLowerCase()),
    })),
  );
}

export default async function TagPostsPage({ params }: Props) {
  const { lang, tag: encodedTag } = await params;
  const locale = lang as Locale;
  const tag = decodeURIComponent(encodedTag);

  const posts = sortPostsByDateDesc(new PostRepository().getPostsByTag(tag, locale));

  return (
    <div
      className={css({
        maxWidth: "token(sizes.container)",
        mx: "auto",
        px: { base: "6", md: "8" },
        py: { base: "16", md: "24" },
      })}
    >
      <div
        className={css({
          mb: "2",
        })}
      >
        <p className={css({ fontSize: "sm", color: "token(colors.muted)", mb: "2" })}>Tag</p>
        <h1
          className={css({
            fontFamily: "token(fonts.heading)",
            fontSize: { base: "3xl", md: "4xl" },
            fontWeight: "700",
            color: "token(colors.text)",
            letterSpacing: "-0.03em",
          })}
        >
          {tag}
        </h1>
      </div>
      <div
        className={css({
          width: "40px",
          height: "3px",
          backgroundColor: "token(colors.accent)",
          borderRadius: "full",
          mb: "12",
          mt: "4",
        })}
      />

      {posts.length === 0 ? (
        <p className={css({ color: "token(colors.secondary)" })}>No posts found for this tag.</p>
      ) : (
        <ol className={css({ listStyle: "none", p: 0, m: 0 })}>
          {posts.map((post) => (
            <PostEntry key={post.id} post={post} locale={locale} />
          ))}
        </ol>
      )}
    </div>
  );
}
