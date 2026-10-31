import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password — Account Recovery | School Market",
  description:
    "Reset your School Market account password securely to regain access to your dashboard.",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
