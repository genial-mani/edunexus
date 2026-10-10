import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getCurrentUser } from "@/lib/auth/session";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "EduNexus — Education Recruitment & Institutional Marketplace",
    template: "%s | EduNexus",
  },
  description:
    "India's leading platform connecting verified schools, colleges, talented teachers open to work, and school bus marketplace.",
  keywords: [
    "teaching jobs",
    "school recruitment",
    "teachers open to work",
    "school buses for sale",
    "education marketplace",
    "CBSE teachers",
    "ICSE schools",
  ],
  authors: [{ name: "EduNexus" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8FAF7] text-[#1F2937] font-sans selection:bg-[#65A88A] selection:text-white">
        <Navbar
          initialUser={
            user
              ? {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                }
              : null
          }
        />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
