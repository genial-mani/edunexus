import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account — Register as Educator or Institute",
  description:
    "Join EduNexus as a teacher open to work or register your educational institution to recruit top educators across India.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
