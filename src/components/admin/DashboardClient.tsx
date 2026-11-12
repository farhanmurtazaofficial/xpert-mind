"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Post } from "@/lib/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function DashboardClient({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function togglePublish(post: Post) {
    setBusyId(post.id);
    try {
      await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          coverImage: post.coverImage,
          content: post.content,
          published: !post.published,
        }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(post: Post) {
    if (!confirm(`Delete “${post.title}”?`)) return;
    setBusyId(post.id);
    try {
      await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Dashboard</h1>
          <p className="muted">Create, edit, and publish Xpert Mind posts.</p>
        </div>
        <div className="dashboard__actions">
          <Link className="btn btn--primary" href="/admin/new">
            New post
          </Link>
          <button type="button" className="btn btn--ghost" onClick={() => void logout()}>
            Log out
          </button>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts yet.</p>
          <Link className="btn btn--primary" href="/admin/new">
            Write your first post
          </Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="posts-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link href={`/admin/edit/${post.id}`}>{post.title}</Link>
                    <div className="muted small">/{post.slug}</div>
                  </td>
                  <td>
                    <span
                      className={`status ${post.published ? "status--live" : "status--draft"}`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>{formatDate(post.updatedAt)}</td>
                  <td className="posts-table__actions">
                    <Link href={`/admin/edit/${post.id}`}>Edit</Link>
                    {post.published ? (
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        View
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      disabled={busyId === post.id}
                      onClick={() => void togglePublish(post)}
                    >
                      {post.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      type="button"
                      className="danger"
                      disabled={busyId === post.id}
                      onClick={() => void remove(post)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
