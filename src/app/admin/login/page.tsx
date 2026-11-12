import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAuthenticated } from "@/lib/auth";

export const metadata = {
  title: "Admin login",
};

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="login-shell">
      <LoginForm />
    </div>
  );
}
