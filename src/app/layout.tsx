import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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
  title: "GlobalCVE — Unified Vulnerability Search",
  description:
    "Search CVEs across NVD, JVN, CIRCL, ExploitDB, and CVE.org — all in one place.",
  icons: {
    icon: "/globalcve-favicon.ico",
  },
  openGraph: {
    title: "GlobalCVE — Unified Vulnerability Search",
    description:
      "Search CVEs across NVD, JVN, CIRCL, ExploitDB, and CVE.org — all in one place.",
    url: "https://globalcve.xyz",
    siteName: "GlobalCVE",
    images: [
      {
        url: "/globalcve-logo.png",
        width: 512,
        height: 512,
        alt: "GlobalCVE Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "GlobalCVE — Unified Vulnerability Search",
    description:
      "Search CVEs across NVD, JVN, CIRCL, ExploitDB, and CVE.org — all in one place.",
    images: ["/globalcve-logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#282a36] text-[#f8f8f2]`}
      >
        {children}
        <div className="mt-12 mb-6 text-center">
          <a
            href="https://www.buymeacoffee.com/globalcve"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded bg-[#ffb86c] px-4 py-2 text-sm font-medium text-[#282a36] hover:bg-[#ff9f50] transition"
          >
            ☕ Buy Me a Coffee
          </a>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
