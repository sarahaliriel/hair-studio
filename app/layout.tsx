import "./globals.css";
import { Reveal } from "@/shared/ui/Reveal";
import type { Metadata, Viewport } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { FloatingCTA } from "@/shared/ui/FloatingCta";
import localFont from "next/font/local";
import { PageTransitionProvider } from "@/shared/ui/PageTransition";

const serif = localFont({
  src: [
    { path: "./fonts/serif-normal-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/serif-italic-400.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});
const sans = localFont({
  src: [
    {
      path: "./fonts/inter-latin-variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const metadataBaseUrl = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
  ? process.env.NEXT_PUBLIC_SITE_URL
  : "https://arlete.space";

export const viewport: Viewport = {
  themeColor: "#f5f1eb",
};

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),

  title: "Arlete Space | Cabelos e Beleza em Lisboa",
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
        url: "/images/heroopage.png",
        width: 1920,
        height: 1080,
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
    <html lang="pt-PT" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{if(location.pathname==='/'&&!sessionStorage.getItem('arlete:home-intro:v1')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('intro-pending')}catch{}` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HairSalon",
              name: "Arlete Cabeleireira",
              url: "https://arlete.space",
              image: "https://arlete.space/images/heroopage.png",
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

      <body className="min-h-dvh antialiased">
        <PageTransitionProvider>
          <a href="#main-content" className="skip-link">
            Saltar para o conteúdo
          </a>
          <Navbar />
          <main id="main-content">{children}</main>
          <FloatingCTA />
          <Footer />
          <Reveal />
        </PageTransitionProvider>
      </body>
    </html>
  );
}
