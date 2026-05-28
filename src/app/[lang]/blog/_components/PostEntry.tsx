import Link from "next/link";
import { css } from "@/styled-system/css";
import { Post } from "@/types/Post";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n";

type Props = {
  post: Post;
  locale?: Locale;
};

function postHref(slug: string, locale: Locale) {
  return `/${locale}/blog/${slug}`;
}

function tagHref(tag: string, locale: Locale) {
  return `/${locale}/blog/tag/${encodeURIComponent(tag.toLowerCase())}`;
}

export function PostEntry({ post, locale = "ja" }: Props) {
  return (
    <li>
      <Link
        href={postHref(post.slug, locale)}
        className={css({
          display: "block",
          py: "8",
          borderBottom: "1px solid token(colors.border)",
          _hover: {
            "& h2": { color: "token(colors.accent)" },
          },
          transition: "all 0.2s",
        })}
      >
        <time
          dateTime={post.date}
          className={css({
            fontSize: "sm",
            color: "token(colors.muted)",
            display: "block",
            mb: "3",
          })}
        >
          {formatDate(post.date)}
        </time>

        <h2
          className={css({
            fontFamily: "token(fonts.heading)",
            fontSize: { base: "xl", md: "2xl" },
            fontWeight: "600",
            color: "token(colors.text)",
            letterSpacing: "-0.02em",
            mb: "3",
            transition: "color 0.2s",
          })}
        >
          {post.title}
        </h2>

        {post.description && (
          <p
            className={css({
              fontSize: "base",
              color: "token(colors.secondary)",
              lineHeight: "1.7",
              mb: "4",
            })}
          >
            {post.description}
          </p>
        )}

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
              <li
                key={tag}
                className={css({
                  fontSize: "xs",
                  fontWeight: "500",
                  color: "token(colors.accent)",
                  backgroundColor: "token(colors.surface)",
                  border: "1px solid token(colors.border)",
                  px: "2.5",
                  py: "1",
                  borderRadius: "md",
                })}
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </Link>
    </li>
  );
}

export { tagHref };
