import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./pager.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
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
        className={`${plusJakarta.variable} plus-jakarta-font`}
      >
        {children}
      </body>
    </html>
  );
}
