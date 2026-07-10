import type { Metadata } from "next";
import { Archivo, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

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
