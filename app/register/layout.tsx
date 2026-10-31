import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create an Account — Register as Educator or Institute | School Market",
  description:
    "Join School Market as a teacher open to work or register your educational institution to recruit top educators across India.",
};

export default async function RegisterLayout({
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
