import Head from "next/head";
import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/globalcve-favicon.ico" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
