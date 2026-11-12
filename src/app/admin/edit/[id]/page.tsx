import { notFound, redirect } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";
import { isAuthenticated } from "@/lib/auth";
import { getPostById } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id);
  return { title: post ? `Edit · ${post.title}` : "Edit post" };
}

export default async function EditPostPage({ params }: Props) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div className="shell">
      <PostEditor post={post} />
    </div>
  );
}
