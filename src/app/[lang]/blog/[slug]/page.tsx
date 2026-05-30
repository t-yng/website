import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { css } from "@/styled-system/css";
import { NotFoundPostError } from "@/lib/error";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import { PostContent } from "../_components/PostContent";
import { PostRepository } from "../_repositories/PostRepository";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

const getPost = cache(async (slug: string, locale: Locale) => {
  try {
    return await new PostRepository().getPostBySlugAsync(slug, locale);
  } catch (e) {
    if (e instanceof NotFoundPostError) return null;
    throw e;
  }
});

export function generateStaticParams() {
  const jaParams = new PostRepository().getAllPosts("ja").map((p) => ({
    lang: "ja",
    slug: encodeURIComponent(p.slug),
  }));
  const enParams = new PostRepository().getAllPosts("en").map((p) => ({
    lang: "en",
    slug: encodeURIComponent(p.slug),
  }));
  return [...jaParams, ...enParams];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug: encodedSlug } = await params;
  const post = await getPost(decodeURIComponent(encodedSlug), lang as Locale);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
  };
}

export default async function PostPage({ params }: Props) {
  const { lang, slug: encodedSlug } = await params;
  const locale = lang as Locale;
  const slug = decodeURIComponent(encodedSlug);
  const post = await getPost(slug, locale);
  if (!post) notFound();

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
          mb: "8",
        })}
      >
        <Link
          href={`/${locale}/blog`}
          className={css({
            display: "inline-flex",
            alignItems: "center",
            gap: "1",
            fontSize: "sm",
            color: "token(colors.muted)",
            _hover: { color: "token(colors.accent)" },
            transition: "color 0.2s",
          })}
        >
          ← Blog
        </Link>
      </div>

      <article>
        <header
          className={css({
            mb: "12",
            pb: "8",
            borderBottom: "1px solid token(colors.border)",
          })}
        >
          <time
            dateTime={post.date}
            className={css({
              fontSize: "sm",
              color: "token(colors.muted)",
              display: "block",
              mb: "4",
            })}
          >
            {formatDate(post.date)}
          </time>

          <h1
            className={css({
              fontFamily: "token(fonts.heading)",
              fontSize: { base: "2xl", md: "3xl" },
              fontWeight: "700",
              color: "token(colors.text)",
              letterSpacing: "-0.03em",
              lineHeight: "1.2",
              mb: "6",
            })}
          >
            {post.title}
          </h1>

          {post.tags.length > 0 && (
            <ul
              className={css({
                display: "flex",
                flexWrap: "wrap",
                gap: "2",
                listStyle: "none",
                p: 0,
                m: 0,
              })}
            >
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/${locale}/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
                    className={css({
                      fontSize: "xs",
                      fontWeight: "500",
                      color: "token(colors.accent)",
                      backgroundColor: "token(colors.surface)",
                      border: "1px solid token(colors.border)",
                      px: "2.5",
                      py: "1",
                      borderRadius: "md",
                      _hover: {
                        backgroundColor: "token(colors.accent)",
                        color: "white",
                        borderColor: "token(colors.accent)",
                      },
                      transition: "all 0.2s",
                    })}
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </header>

        <PostContent html={post.content} />
      </article>
    </div>
  );
}
