import type { Metadata, Viewport } from "next";
import { DM_Sans, DM_Serif_Display, BioRhyme } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

const brinnan = localFont({
  src: [
    { path: "../../public/fonts/Brinnan-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Brinnan-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-brinnan",
  display: "swap",
});

const bioRhyme = BioRhyme({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-biorhyme",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Refuje",
    default: "Refuje | Luxe Offbeat Travel Experiences",
  },
  description:
    "Refuje offers luxury offbeat travel experiences and adventures in the Indian Himalayas.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${dmSerif.variable} ${brinnan.variable} ${bioRhyme.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
