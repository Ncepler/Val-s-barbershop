import type { Metadata } from "next";
import { Oswald, Inter_Tight } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-tight",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://valselegant.com"),
  title: "Val's Elegant Barbershop — Barbershop in Roslyn, NY",
  description:
    "Val and Vlad cut hair at 8 Main St in Roslyn Village. Haircuts, fades, beard trims, and hot towel shaves. Walk in or call (516) 399-2220.",
  alternates: {
    canonical: "https://valselegant.com",
  },
  openGraph: {
    title: "Val's Elegant Barbershop — Barbershop in Roslyn, NY",
    description:
      "Val and Vlad cut hair at 8 Main St in Roslyn Village. Haircuts, fades, beard trims, and hot towel shaves. Walk in or call (516) 399-2220.",
    url: "https://valselegant.com",
    siteName: "Val's Elegant Barbershop",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${interTight.variable}`}>
      <body>{children}</body>
    </html>
  );
}
