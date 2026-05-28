export type Post = {
  id: string;
  slug: string;
  date: string; // ISO 8601
  title: string;
  description: string;
  tags: string[];
  author: string;
  content: string;
};
