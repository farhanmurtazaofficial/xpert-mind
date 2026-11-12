import { promises as fs } from "fs";
import path from "path";
import { slugify } from "./slug";
import type { Post, PostInput } from "./types";

const postsDir = path.join(process.cwd(), "data", "posts");

async function ensurePostsDir() {
  await fs.mkdir(postsDir, { recursive: true });
}

function postPath(id: string) {
  return path.join(postsDir, `${id}.json`);
}

export async function listPosts(options?: {
  includeDrafts?: boolean;
}): Promise<Post[]> {
  await ensurePostsDir();
  const files = await fs.readdir(postsDir);
  const posts: Post[] = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const raw = await fs.readFile(path.join(postsDir, file), "utf8");
    posts.push(JSON.parse(raw) as Post);
  }

  return posts
    .filter((post) => options?.includeDrafts || post.published)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const raw = await fs.readFile(postPath(id), "utf8");
    return JSON.parse(raw) as Post;
  } catch {
    return null;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await listPosts({ includeDrafts: true });
  return posts.find((post) => post.slug === slug) ?? null;
}

async function ensureUniqueSlug(base: string, excludeId?: string) {
  const posts = await listPosts({ includeDrafts: true });
  let candidate = base || "post";
  let n = 2;
  while (
    posts.some((post) => post.slug === candidate && post.id !== excludeId)
  ) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}

export async function createPost(input: PostInput): Promise<Post> {
  await ensurePostsDir();
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const baseSlug = slugify(input.slug || input.title || "untitled");
  const post: Post = {
    id,
    title: input.title.trim() || "Untitled",
    slug: await ensureUniqueSlug(baseSlug),
    excerpt: (input.excerpt || "").trim(),
    coverImage: input.coverImage ?? null,
    content: input.content || "<p></p>",
    published: Boolean(input.published),
    createdAt: now,
    updatedAt: now,
  };
  await fs.writeFile(postPath(id), JSON.stringify(post, null, 2), "utf8");
  return post;
}

export async function updatePost(
  id: string,
  input: PostInput
): Promise<Post | null> {
  const existing = await getPostById(id);
  if (!existing) return null;

  const baseSlug = slugify(input.slug || input.title || existing.slug);
  const updated: Post = {
    ...existing,
    title: input.title.trim() || existing.title,
    slug: await ensureUniqueSlug(baseSlug, id),
    excerpt:
      input.excerpt !== undefined ? input.excerpt.trim() : existing.excerpt,
    coverImage:
      input.coverImage !== undefined ? input.coverImage : existing.coverImage,
    content: input.content !== undefined ? input.content : existing.content,
    published:
      input.published !== undefined ? Boolean(input.published) : existing.published,
    updatedAt: new Date().toISOString(),
  };

  await fs.writeFile(postPath(id), JSON.stringify(updated, null, 2), "utf8");
  return updated;
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    await fs.unlink(postPath(id));
    return true;
  } catch {
    return false;
  }
}
