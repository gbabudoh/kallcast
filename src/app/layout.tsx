import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/providers/Providers";
import { initializeBuckets } from "@/lib/minio";
import "./globals.css";

// Initialize MinIO buckets
initializeBuckets().catch(console.error);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kallcast - Live Coaching Platform",
  description: "Connect with expert coaches for live learning sessions. Book 1-on-1 or small group coaching sessions with world-class professionals.",
  keywords: "coaching, live sessions, online learning, professional development, mentorship, video calls",
  authors: [{ name: "Kallcast Team" }],
  creator: "Kallcast",
  publisher: "Kallcast",
  icons: {
    icon: [
      {
        url: '/favicon.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  openGraph: {
    title: "Kallcast - Live Coaching Platform",
    description: "Connect with expert coaches for transformative live learning sessions",
    url: "https://kallcast.com",
    siteName: "Kallcast",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kallcast - Live Coaching Platform",
    description: "Connect with expert coaches for transformative live learning sessions",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
            <Providers>
              {children}
              <Toaster />
            </Providers>
      </body>
    </html>
  );
}
