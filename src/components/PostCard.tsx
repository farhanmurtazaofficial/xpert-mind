import Link from "next/link";
import type { Post } from "@/lib/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-card">
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="post-card__cover"
          src={post.coverImage}
          alt=""
        />
      ) : null}
      <div className="post-card__body">
        <p className="eyebrow">{formatDate(post.createdAt)}</p>
        <h2>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        {post.excerpt ? <p className="muted">{post.excerpt}</p> : null}
        <Link className="text-link" href={`/blog/${post.slug}`}>
          Read article
        </Link>
      </div>
    </article>
  );
}
