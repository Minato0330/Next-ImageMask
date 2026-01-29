import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
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
  title: "Maskit — CSS Mask Effects Studio",
  description:
    "Professional CSS mask, filter, and clip-path studio with real-time preview and code generation. Create stunning visual effects with gradients, blend modes, and export production-ready CSS.",
  keywords: [
    "CSS mask",
    "mask-image",
    "CSS filter",
    "clip-path",
    "gradient generator",
    "CSS effects",
    "web design tool",
    "CSS generator",
    "image effects",
    "blend modes",
  ],
  authors: [{ name: "Maskit" }],
  creator: "Maskit",
  metadataBase: new URL("https://maskit.sachi.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://maskit.sachi.dev",
    siteName: "Maskit",
    title: "Maskit — CSS Mask Effects Studio",
    description:
      "Professional CSS mask, filter, and clip-path studio with real-time preview and code generation. Create stunning visual effects with gradients, blend modes, and export production-ready CSS.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Maskit — CSS Mask Effects Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maskit — CSS Mask Effects Studio",
    description:
      "Professional CSS mask, filter, and clip-path studio with real-time preview and code generation.",
    images: ["/og.png"],
    creator: "@maskit",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
