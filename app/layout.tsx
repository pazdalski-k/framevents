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
    default: "FramEvent — Photographie événementielle en Normandie",
    template: "%s | FramEvent",
  },

  description:
    "FramEvent par Krzysztof Pazdalski — galeries photo d’événements en Normandie. Retrouvez, achetez et téléchargez vos photos en haute qualité.",

  applicationName: "FramEvent",

  keywords: [
    "FramEvent",
    "photographe événementiel Normandie",
    "photographe Caen",
    "galerie photo événement",
    "photos événement sportif",
    "photographie événementielle",
    "Krzysztof Pazdalski",
    "photo event Normandy",
    "event photography Caen",
  ],

  authors: [
    {
      name: "Krzysztof Pazdalski",
      url: "https://www.instagram.com/kristof.pazdalski",
    },
  ],

  creator: "Krzysztof Pazdalski",
  publisher: "FramEvent",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "FramEvent",
    title: "FramEvent — Photographie événementielle en Normandie",
    description:
      "Galeries photo d’événements en Normandie. Retrouvez, achetez et téléchargez vos photos en haute qualité.",
    images: [
      {
        url: "/hero-framevent-2026.jpg",
        width: 1600,
        height: 900,
        alt: "FramEvent — photographie événementielle en Normandie",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "FramEvent — Photographie événementielle en Normandie",
    description:
      "Galeries photo d’événements en Normandie. Retrouvez, achetez et téléchargez vos photos en haute qualité.",
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