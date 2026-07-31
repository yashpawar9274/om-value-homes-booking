import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ContentAutoRefresh from "@/components/ContentAutoRefresh";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site-data";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OM Value Homes | Flats in Palghar West",
    template: "%s | OM Value Homes",
  },
  description:
    "Book a FREE site visit at OM Value Homes, Fair Township, Palghar West. Explore 1, 2 and 3 BHK homes, prices, amenities and location.",
  keywords: [
    "flats in Palghar West",
    "1 BHK flat in Palghar West",
    "ready possession flats Palghar",
    "OM Value Homes",
    "Fair Township Palghar",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "OM Value Homes",
    title: "OM Value Homes | Flats in Palghar West",
    description:
      "Explore 1, 2 and 3 BHK homes at Fair Township, Palghar West and book a free guided site visit.",
    images: [
      {
        url: "/om-value-homes-building.png",
        width: 1200,
        height: 630,
        alt: "OM Value Homes at Fair Township, Palghar West",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OM Value Homes | Flats in Palghar West",
    description:
      "Explore 1, 2 and 3 BHK homes at Fair Township, Palghar West.",
    images: ["/om-value-homes-building.png"],
  },
  icons: {
    icon: "/om-value-homes-logo.jpeg",
    shortcut: "/om-value-homes-logo.jpeg",
    apple: "/om-value-homes-logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: SITE_URL,
                name: "OM Value Homes",
                inLanguage: "en-IN",
              },
              {
                "@type": ["Organization", "RealEstateAgent"],
                "@id": `${SITE_URL}/#organization`,
                name: "OM Value Homes",
                url: SITE_URL,
                logo: `${SITE_URL}/om-value-homes-logo.jpeg`,
                telephone: "+91-90164-46666",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Fair Township, Satpati–Palghar Road, Dhansar",
                  addressLocality: "Palghar West",
                  addressRegion: "Maharashtra",
                  postalCode: "401501",
                  addressCountry: "IN",
                },
              },
            ],
          }}
        />
        <ContentAutoRefresh />
        {children}
      </body>
    </html>
  );
}
