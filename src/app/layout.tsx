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
    <html lang="en" className="bg-[#282a36] h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-[#f8f8f2] bg-[#282a36] min-h-screen w-full`}
      >
        <main className="flex flex-col min-h-screen w-full bg-[#282a36]">
          <div className="w-full text-center pt-6 pb-4">
            <a
              href="https://www.buymeacoffee.com/globalcve"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded bg-[#bd93f9] px-4 py-2 text-sm font-medium text-[#282a36] hover:bg-[#a78bfa] transition"
            >
              ☕ Buy Me a Coffee
            </a>
          </div>
          <div className="flex-grow w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
            {children}
          </div>
        </main>
        <Analytics />
      </body>
    </html>
  );
}
