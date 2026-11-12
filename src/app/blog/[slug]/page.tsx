import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostBody } from "@/components/PostBody";
import { getPostBySlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const date = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(post.createdAt));

  return (
    <article className="shell article">
      <header className="article__header">
        <p className="eyebrow">{date}</p>
        <h1>{post.title}</h1>
        {post.excerpt ? <p className="muted">{post.excerpt}</p> : null}
      </header>

      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="article__cover" src={post.coverImage} alt="" />
      ) : null}

      <PostBody html={post.content} />
    </article>
  );
}
