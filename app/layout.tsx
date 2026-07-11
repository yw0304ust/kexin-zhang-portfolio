import type { Metadata } from "next";
import { Archivo, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./pager.css";

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kxzhang.com"),
  alternates: {
    canonical: "/",
  },
  title: "Kexin Zhang — Game Design & Player Experience Research",
  description:
    "The selected portfolio of Kexin Zhang, exploring narrative game design, player experience, human-centered HCI, and digital communication.",
  keywords: [
    "Kexin Zhang",
    "game design",
    "player experience",
    "HCI",
    "narrative design",
    "user research",
  ],
  openGraph: {
    title: "Kexin Zhang — Game Design & Player Experience Research",
    description:
      "Narrative game design, player experience research, and human-centered HCI.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1736,
        height: 909,
        alt: "Kexin Zhang — Game Design, Player Experience, and HCI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kexin Zhang — Game Design & Player Experience Research",
    description:
      "Narrative game design, player experience research, and human-centered HCI.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} ${spaceGrotesk.variable} ${geistMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
