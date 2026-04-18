import type { Metadata, Viewport } from "next";
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

export const metadata: Metadata = {
  title: "Luvora — Where sparks become stories",
  description:
    "Luvora is the next-gen dating app for real connections. Video & audio calls, live rooms, nearby matches, short videos, groups, random chats and more. Join the waitlist.",
  keywords: [
    "dating app",
    "online dating",
    "video dating",
    "live streaming",
    "nearby matches",
    "Luvora",
  ],
  openGraph: {
    title: "Luvora — Where sparks become stories",
    description:
      "Video calls, live rooms, nearby matches, short videos and more. Join the Luvora waitlist.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0218",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
