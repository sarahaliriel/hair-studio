// @ts-ignore
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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

const metadataBaseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "https://arlete.space";

export const viewport: Viewport = {
  themeColor: "#edeae2",
};

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),

  title: "Arlete Cabeleireira | Cabelos e Beleza em Lisboa",
  description:
    "Cabeleireira em Campo de Ourique, Lisboa. Especialista em tranças, penteados, coloração, corte unissexo, progressiva e hidratação. Marca já o teu atendimento.",

  openGraph: {
    title: "Arlete Cabeleireira | Campo de Ourique, Lisboa",
    description:
      "Especialista em tranças, coloração, cortes e penteados em Lisboa. Marca já o teu horário.",
    url: "https://arlete.space",
    siteName: "Arlete Cabeleireira",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },

  alternates: {
    canonical: "/",
  },

  other: {
    "geo.region": "PT-11",
    "geo.placename": "Campo de Ourique, Lisboa",
    "geo.position": "38.7169;-9.1604",
    ICBM: "38.7169, -9.1604",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT" className={`${serif.variable} ${sans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HairSalon",
              name: "Arlete Cabeleireira",
              url: "https://arlete.space",
              image: "https://arlete.space/og-image.jpg",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Lisboa",
                addressRegion: "Lisboa",
                addressCountry: "PT",
              },
              areaServed: "Lisboa",
              description:
                "Salão de cabeleireiro especializado em tranças, coloração, cortes e penteados em Lisboa.",
            }),
          }}
        />
      </head>

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