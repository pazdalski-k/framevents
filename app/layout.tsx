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

const siteUrl = "https://www.framevents.fr";

const seoTitle = "FramEvents — Photographe événementiel à Caen en Normandie";

const seoDescription =
  "Photographe événementiel à Caen et en Normandie. Galeries photo privées et sportives avec achat sécurisé et téléchargement HD.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: seoTitle,
    template: "%s | FramEvents",
  },

  description: seoDescription,

  applicationName: "FramEvents",

  keywords: [
    "FramEvents",
    "Krzysztof Pazdalski",
    "photographe événementiel Caen",
    "photographe événementiel Normandie",
    "photographe Caen",
    "photographe Normandie",
    "photographie événementielle Caen",
    "photographie événementielle Normandie",
    "galerie photo événement Caen",
    "galerie photo événement Normandie",
    "photos événement sportif",
    "photos événement sportif Normandie",
    "photos triathlon Deauville",
    "photographe Deauville",
    "photographe Ouistreham",
    "photographe mariage Caen",
    "photographe portrait Caen",
    "photographe famille Caen",
    "galerie photo en ligne",
    "téléchargement photos HD",
    "photo event Normandy",
    "event photography Caen",
    "event photographer Normandy",
  ],

  authors: [
    {
      name: "Krzysztof Pazdalski",
      url: "https://www.instagram.com/kristof.pazdalski",
    },
  ],

  creator: "Krzysztof Pazdalski",
  publisher: "FramEvents",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "FramEvents",
    title: seoTitle,
    description: seoDescription,
    images: [
      {
        url: "/hero-framevent-2026.jpg",
        width: 1600,
        height: 900,
        alt: "FramEvents — photographe événementiel à Caen en Normandie",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: ["/hero-framevent-2026.jpg"],
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

  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}