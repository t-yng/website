import { Tag } from "@/types/Tag";
import { PostRepository, type Locale, defaultLocale } from "./PostRepository";

export class TagRepository {
  getAllTags(locale: Locale = defaultLocale): Tag[] {
    const posts = new PostRepository().getAllPosts(locale);
    const grouped = posts.reduce(
      (acc, post) => {
        for (const tag of post.tags) {
          acc[tag] = { name: tag, count: (acc[tag]?.count ?? 0) + 1 };
        }
        return acc;
      },
      {} as Record<string, Tag>
    );
    return Object.values(grouped);
  }
}
