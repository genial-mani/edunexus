import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Institutional Partnerships & Support | School Market",
  description:
    "Get in touch with School Market support team for institutional partnerships, campus recruitments, or platform assistance.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
