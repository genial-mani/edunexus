import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function DashboardIndexPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (user.role === "teacher") {
    redirect("/dashboard/teacher");
  } else if (user.role === "institute_admin") {
    redirect("/dashboard/institute");
  } else if (user.role === "platform_admin") {
    redirect("/dashboard/admin");
  }

  redirect("/");
}
