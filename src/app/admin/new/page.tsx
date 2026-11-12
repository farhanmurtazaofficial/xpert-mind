import { redirect } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";
import { isAuthenticated } from "@/lib/auth";

export const metadata = {
  title: "New post",
};

export default async function NewPostPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="shell">
      <PostEditor />
    </div>
  );
}
