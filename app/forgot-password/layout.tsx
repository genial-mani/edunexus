import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password — Account Recovery",
  description:
    "Reset your EduNexus account password securely to regain access to your dashboard.",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
