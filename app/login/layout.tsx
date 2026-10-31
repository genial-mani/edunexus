import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login to School Market — Teacher & Institute Portal",
  description:
    "Log in to School Market to manage your teaching applications, faculty job postings, and educational institution listings.",
};

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return children;
}
