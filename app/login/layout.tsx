import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to EduNexus — Teacher & Institute Portal",
  description:
    "Log in to EduNexus to manage your teaching applications, faculty job postings, and educational institution listings.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
