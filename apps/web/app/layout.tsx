import type { Metadata } from "next";
import { Laila, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const laila = Laila({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AVC Pet Hospital | Multispeciality Pet Care Hospital, Gurugram",
  description:
    "Comprehensive, compassionate veterinary care in Gurugram, Haryana. 24/7 emergency response, modern surgeries, diagnostics, OPD & pet spa.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${laila.variable} ${plusJakartaSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
