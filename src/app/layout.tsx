// Favicon patch confirmed
import Head from "next/head";
// import type { Metadata } from "next"; // Temporarily disabled
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

// export const metadata: Metadata = {
//   title: "GlobalCVE — Unified Vulnerability Search",
//   description:
//     "Search CVEs across NVD, JVN, CIRCL, ExploitDB, and CVE.org — all in one place.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/globalcve-favicon.ico" />
        <meta name="msapplication-TileImage" content="/globalcve-favicon.ico" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
