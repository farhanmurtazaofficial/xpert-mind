export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PostInput = {
  title: string;
  slug?: string;
  excerpt?: string;
  coverImage?: string | null;
  content?: string;
  published?: boolean;
};
