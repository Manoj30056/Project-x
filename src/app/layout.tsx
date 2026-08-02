import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { PageTransition } from "@/components/layout/page-transition";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ENGRAM — One QR. Every Memory. Forever.",
    template: "%s | ENGRAM",
  },
  description:
    "Create an event, share a QR code, and let every guest contribute photos and videos into one stunning AI-organized gallery.",
  keywords: [
    "event photos",
    "qr code gallery",
    "shared memories",
    "event gallery",
    "photo sharing",
    "ai photo organizer",
  ],
  authors: [{ name: "ENGRAM" }],
  openGraph: {
    title: "ENGRAM — One QR. Every Memory. Forever.",
    description:
      "The beautiful way to collect and relive event memories together.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ENGRAM — One QR. Every Memory. Forever.",
    description:
      "The beautiful way to collect and relive event memories together.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface text-text-primary antialiased overflow-x-hidden">
        <ThemeProvider>
          <ToastProvider>
            <PageTransition>{children}</PageTransition>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
