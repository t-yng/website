import fs from "fs";
import crypto from "crypto";
import path, { join } from "path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RenderRule = (tokens: any[], idx: number, options: any, env: any, self: any) => string;
import urlJoin from "url-join";
import sizeOf from "image-size";
import cpx from "cpx";
import { Post } from "@/types/Post";
import { NotFoundPostError } from "./error";

export type Locale = "ja" | "en";
export const locales: Locale[] = ["ja", "en"];
export const defaultLocale: Locale = "ja";

let shikiPlugin: ((md: MarkdownIt) => void) | null = null;

async function getShikiPlugin() {
  if (!shikiPlugin) {
    const { default: Shiki } = await import("@shikijs/markdown-it");
    shikiPlugin = await Shiki({ theme: "dark-plus" });
  }
  return shikiPlugin;
}

export class PostRepository {
  getAllPosts(locale: Locale = defaultLocale): Post[] {
    const slugs = this.getAllSlugs(locale);
    return slugs
      .map((slug) => {
        try {
          return this.getPostBySlug(slug, locale);
        } catch {
          return null;
        }
      })
      .filter((p): p is Post => p != null);
  }

  async getPostBySlugAsync(slug: string, locale: Locale = defaultLocale): Promise<Post> {
    const fileName = PostRepository.postFileName(locale);
    const fullPath = join(PostRepository.postsDirectory(), slug, fileName);

    if (!fs.existsSync(fullPath)) {
      throw new NotFoundPostError(`Post not found: ${slug} (${locale})`);
    }

    const fileContent = fs.readFileSync(fullPath);
    const { data, content: rawContent } = matter(fileContent);

    const md = new MarkdownIt({ html: true, breaks: true });
    const shiki = await getShikiPlugin();
    md.use(shiki);

    (md.renderer.rules.image as RenderRule) = (tokens, idx, options, _env, self) => {
      const token = tokens[idx];
      token.attrSet("loading", "lazy");
      token.attrSet("alt", token.content);

      const src = token.attrGet("src");
      if (src) {
        const contentDir = path.join(PostRepository.postsDirectory(), slug);
        const imagePath = path.join(contentDir, src);

        if (fs.existsSync(imagePath)) {
          const dimensions = sizeOf(fs.readFileSync(imagePath));
          if (dimensions.width && dimensions.height) {
            token.attrSet("width", dimensions.width.toString());
            token.attrSet("height", dimensions.height.toString());
          }

          const publicImageDirectory = path.join(
            process.cwd(),
            "public",
            "images",
            "posts",
            slug
          );
          cpx.copySync(imagePath, publicImageDirectory, { update: true });
          token.attrSet("src", urlJoin(`/images/posts/${slug}`, src));
        }
      }

      return self.renderToken(tokens, idx, options);
    };

    (md.renderer.rules["link_open"] as RenderRule) = (tokens, idx, options, _env, self) => {
      const token = tokens[idx];
      const href = token.attrs?.find(([k]: string[]) => k === "href")?.[1];
      if (href && /^http/.test(href)) {
        token.attrSet("target", "_blank");
        token.attrSet("rel", "noopener noreferrer");
      }
      return self.renderToken(tokens, idx, options);
    };

    (md.renderer.rules["heading_open"] as RenderRule) = (tokens, idx, options, _env, self) => {
      const token = tokens[idx];
      const nextToken = tokens[idx + 1];
      token.attrSet("id", nextToken.content);
      return self.renderToken(tokens, idx, options);
    };

    const content = md.render(rawContent);

    return {
      id: crypto.createHash("md5").update(`${slug}-${locale}`).digest("hex"),
      slug,
      date: data["date"].toISOString(),
      title: data["title"],
      description: data["description"] ?? "",
      tags: data["tags"] ?? [],
      author: data["author"] ?? "t-yng",
      content,
    };
  }

  getPostBySlug(slug: string, locale: Locale = defaultLocale): Post {
    const fileName = PostRepository.postFileName(locale);
    const fullPath = join(PostRepository.postsDirectory(), slug, fileName);

    if (!fs.existsSync(fullPath)) {
      throw new NotFoundPostError(`Post not found: ${slug} (${locale})`);
    }

    const fileContent = fs.readFileSync(fullPath);
    const { data } = matter(fileContent);

    return {
      id: crypto.createHash("md5").update(`${slug}-${locale}`).digest("hex"),
      slug,
      date: data["date"].toISOString(),
      title: data["title"],
      description: data["description"] ?? "",
      tags: data["tags"] ?? [],
      author: data["author"] ?? "t-yng",
      content: "",
    };
  }

  getPostsByTag(tag: string, locale: Locale = defaultLocale): Post[] {
    return this.getAllPosts(locale).filter((post) =>
      post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
    );
  }

  availableLocales(slug: string): Locale[] {
    return locales.filter((locale) =>
      fs.existsSync(
        join(PostRepository.postsDirectory(), slug, PostRepository.postFileName(locale))
      )
    );
  }

  private getAllSlugs(locale: Locale = defaultLocale): string[] {
    return fs
      .readdirSync(PostRepository.postsDirectory())
      .filter((slug) =>
        fs.existsSync(
          join(PostRepository.postsDirectory(), slug, PostRepository.postFileName(locale))
        )
      );
  }

  private static postFileName(locale: Locale): string {
    return locale === defaultLocale ? "index.md" : `index.${locale}.md`;
  }

  private static postsDirectory(): string {
    return join(process.cwd(), "content", "posts");
  }
}
