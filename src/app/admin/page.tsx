import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/admin/DashboardClient";
import { isAuthenticated } from "@/lib/auth";
import { listPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const posts = await listPosts({ includeDrafts: true });

  return (
    <div className="shell">
      <DashboardClient posts={posts} />
    </div>
  );
}
