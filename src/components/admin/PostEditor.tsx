"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RichEditor } from "@/components/editor/RichEditor";
import { slugify } from "@/lib/slug";
import type { Post } from "@/lib/types";

type Props = {
  post?: Post;
};

export function PostEditor({ post }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [content, setContent] = useState(post?.content || "<p></p>");
  const [published, setPublished] = useState(post?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);

  const previewSlug = useMemo(
    () => (slugTouched ? slug : slugify(title)),
    [slug, slugTouched, title]
  );

  async function uploadCover(file: File) {
    setUploadingCover(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cover upload failed");
      setCoverImage(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cover upload failed");
    } finally {
      setUploadingCover(false);
    }
  }

  async function save(nextPublished = published) {
    setSaving(true);
    setError("");
    try {
      const payload = {
        title,
        slug: previewSlug,
        excerpt,
        coverImage: coverImage || null,
        content,
        published: nextPublished,
      };

      const res = await fetch(post ? `/api/posts/${post.id}` : "/api/posts", {
        method: post ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="editor-page">
      <div className="editor-page__header">
        <div>
          <p className="eyebrow">Write</p>
          <h1>{post ? "Edit post" : "New post"}</h1>
        </div>
        <div className="editor-page__actions">
          <button
            type="button"
            className="btn btn--ghost"
            disabled={saving}
            onClick={() => {
              setPublished(false);
              void save(false);
            }}
          >
            Save draft
          </button>
          <button
            type="button"
            className="btn btn--primary"
            disabled={saving || !title.trim()}
            onClick={() => {
              setPublished(true);
              void save(true);
            }}
          >
            {saving ? "Saving…" : "Publish"}
          </button>
        </div>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="editor-grid">
        <div className="editor-main">
          <label className="field">
            <span>Title</span>
            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (!slugTouched) setSlug(slugify(event.target.value));
              }}
              placeholder="Post title"
            />
          </label>

          <RichEditor value={content} onChange={setContent} />
        </div>

        <aside className="editor-side">
          <label className="field">
            <span>Slug</span>
            <input
              value={previewSlug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(slugify(event.target.value));
              }}
            />
          </label>

          <label className="field">
            <span>Excerpt</span>
            <textarea
              rows={4}
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="Short summary for the home page"
            />
          </label>

          <div className="field">
            <span>Cover image</span>
            {coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="cover-preview" src={coverImage} alt="" />
            ) : null}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadCover(file);
              }}
            />
            {uploadingCover ? <p className="muted">Uploading cover…</p> : null}
            {coverImage ? (
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => setCoverImage("")}
              >
                Remove cover
              </button>
            ) : null}
          </div>

          <label className="check-field">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
            />
            <span>Published</span>
          </label>
        </aside>
      </div>
    </div>
  );
}
