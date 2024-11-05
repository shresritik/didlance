"use client"
import localFont from "next/font/local";
import { WalletProvider } from '@suiet/wallet-kit';
import "./globals.css";
import Navbar from "@/components/Nav";
import '@suiet/wallet-kit/style.css';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          <Navbar />
          <div className="mt-16">
            {children}
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
