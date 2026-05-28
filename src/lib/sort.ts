import { Post } from "@/types/Post";

export const sortPostsByDateDesc = (posts: Post[]): Post[] =>
  posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
