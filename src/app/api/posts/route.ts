import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createPost, listPosts } from "@/lib/posts";
import type { PostInput } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "1";

  if (all) {
    const ok = await isAuthenticated();
    if (!ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(await listPosts({ includeDrafts: true }));
  }

  return NextResponse.json(await listPosts({ includeDrafts: false }));
}

export async function POST(request: Request) {
  const ok = await isAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as PostInput | null;
  if (!body?.title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const post = await createPost(body);
  return NextResponse.json(post, { status: 201 });
}
