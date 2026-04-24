// @ts-ignore
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { site } from "@/content/Site";
import { FloatingCTA } from "@/components/FloatingCta";
import { Cormorant_Garamond, Inter } from "next/font/google";
import CustomCursor from "@/components/Cursor";

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

export const metadata = {
  title: "Ideias e Tranças | Cabelereiro",
  description:
    "Cabeleireira em Campo de Ourique, Lisboa. Especialista em tranças, penteados, coloração, corte unissexo, progressiva e hidratação. Marca já o teu atendimento.",
  keywords: [
    "cabeleireira Campo de Ourique",
    "cabeleireira Lisboa",
    "tranças Lisboa",
    "penteados Campo de Ourique",
    "corte unissexo Lisboa",
    "coloração cabelo Lisboa",
  ],
  openGraph: {
    title: "Arlete Cabeleireira | Campo de Ourique Lisboa",
    description:
      "Especialista em cabelo em Lisboa. Tranças, coloração, corte e muito mais.",
    url: "https://arlete-hairstudio",
    siteName: "Arlete Cabeleireira",
    locale: "pt_PT",
    type: "website",
  },

  other: {
  "geo.region": "PT-11",
  "geo.placename": "Campo de Ourique, Lisboa",
  "geo.position": "38.7169;-9.1604",
  ICBM: "38.7169, -9.1604",
},
};



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={`${serif.variable} ${sans.variable}`}
      suppressHydrationWarning={true}>
      <body className="min-h-dvh bg-[#edeae2] text-[#2f2d2d] antialiased">
        <CustomCursor />
        <Navbar />
        <main>{children}</main>
        <FloatingCTA />
        <Footer />
      </body>
    </html>
  );
}