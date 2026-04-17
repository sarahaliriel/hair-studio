// @ts-ignore
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { site } from "@/content/Site";
import { FloatingCTA } from "@/components/FloatingCta";
import { Cormorant_Garamond, Inter } from "next/font/google";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#edeae2",
};

const metadataBaseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),
  title: {
    default: `${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.tagline,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "/",
    title: `${site.name} | Cabeleireiro em ${site.city}`,
    description: site.tagline,
    siteName: site.name,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Cabeleireiro em ${site.city}`,
    description: site.tagline,
    images: ["/images/og.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={`${serif.variable} ${sans.variable}`}
      suppressHydrationWarning={true}>
      <body className="min-h-dvh bg-[#edeae2] text-[#2f2d2d] antialiased">
        <Navbar />
        <main>{children}</main>
        <FloatingCTA />
        <Footer />
      </body>
    </html>
  );
}