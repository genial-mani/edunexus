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
  metadataBase: new URL("https://schoolmarket.arundigi.in"),
  title: {
    default: "School Market — Education Recruitment & Institutional Marketplace",
    template: "%s | School Market",
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
    "faculty vacancies India",
  ],
  authors: [{ name: "School Market", url: "https://schoolmarket.arundigi.in" }],
  creator: "School Market",
  publisher: "School Market",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://schoolmarket.arundigi.in",
    siteName: "School Market",
    title: "School Market — Education Recruitment & Institutional Marketplace",
    description:
      "India's leading platform connecting verified schools, colleges, talented teachers open to work, and school bus marketplace.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "School Market Educational Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "School Market — Education Recruitment & Institutional Marketplace",
    description:
      "India's leading platform connecting verified schools, colleges, talented teachers open to work, and school bus marketplace.",
    images: ["/og-image.png"],
    creator: "@schoolmarket_in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/icon.svg",
  },
  verification: {
    google: "google-site-verification=edunexus-verify-arundigi",
  },
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
