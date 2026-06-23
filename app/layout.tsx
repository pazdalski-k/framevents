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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "FramEvents — Photographe événementiel à Caen en Normandie",
    template: "%s | FramEvents",
  },

  description:
    "FramEvents par Krzysztof Pazdalski — photographe événementiel à Caen et en Normandie. Galeries photo pour événements sportifs, privés et professionnels avec achat et téléchargement HD sécurisé.",

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
    title: "FramEvents — Photographe événementiel à Caen en Normandie",
    description:
      "Photographe événementiel à Caen et en Normandie. Galeries photo pour événements sportifs, privés et professionnels avec achat et téléchargement HD sécurisé.",
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
    title: "FramEvents — Photographe événementiel à Caen en Normandie",
    description:
      "Galeries photo pour événements sportifs, privés et professionnels en Normandie. Achat et téléchargement HD sécurisé.",
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