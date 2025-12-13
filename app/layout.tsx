import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://weneed.money"),
  title: {
    default: "Finverse | Finance OS with SIP & Investing Calculators",
    template: "%s | Finverse",
  },
  description:
    "Finverse is the operating system for your personal finance with AI-powered SIP, FD, FIRE, NPS, IRR, and net worth calculators built for India, UK, and US investors.",
  keywords: [
    "SIP calculator",
    "finance tools",
    "financial calculator",
    "FD calculator",
    "goal planner",
    "FIRE calculator",
    "NPS calculator",
    "IRR calculator",
    "net worth calculator",
    "personal finance",
  ],
  openGraph: {
    title: "Finverse | Finance OS with SIP & Investing Calculators",
    description:
      "AI-powered finance OS with SIP, FD, FIRE, NPS, IRR, and net worth calculators built for precision.",
    url: "https://weneed.money",
    siteName: "Finverse",
    images: [
      {
        url: "https://weneed.money/logo/transparent_logo.png",
        width: 1200,
        height: 630,
        alt: "Finverse - Finance OS",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finverse | Finance OS with SIP & Investing Calculators",
    description:
      "AI-powered finance OS with SIP, FD, FIRE, NPS, IRR, and net worth calculators built for precision.",
    images: ["https://weneed.money/logo/transparent_logo.png"],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo/transparent_logo.png",
    shortcut: "/logo/transparent_logo.png",
    apple: "/logo/transparent_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteLdJson = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Finverse",
    url: "https://weneed.money",
    description:
      "Finverse is the operating system for personal finance with AI-powered calculators for SIP, FD, FIRE, and more.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://weneed.money/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const organizationLdJson = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Finverse",
    url: "https://weneed.money",
    logo: "https://weneed.money/logo/transparent_logo.png",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLdJson) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLdJson) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
