import { PostCard } from "@/components/PostCard";
import { listPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await listPosts({ includeDrafts: false });

  return (
    <>
      <section className="hero-band">
        <div className="shell">
          <p className="eyebrow">Blog</p>
          <h1>Xpert Mind</h1>
          <p>Clear writing on ideas worth keeping — published from the dashboard.</p>
        </div>
      </section>

      <section className="shell post-list">
        {posts.length === 0 ? (
          <div className="empty-state">
            <p>No published posts yet. Sign in to the dashboard to write one.</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>
    </>
  );
}
