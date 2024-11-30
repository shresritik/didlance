"use client";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Nav";
import "@suiet/wallet-kit/style.css";
import { JobsProvider } from "@/hooks/useJobs";
import { Toaster } from "@/components/ui/toaster";
import { WalletProvider } from "@suiet/wallet-kit";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/utils";
const geistSans = localFont({
  src: "./fonts/Lato-Light.ttf",
  variable: "--font-lato-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/Lato-Regular.ttf",
  variable: "--font-lato-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} `}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <WalletProvider>
            <Navbar />

            <JobsProvider>
              <div className="mt-16 --font-lato-mono" suppressHydrationWarning>
                {children}
                <Toaster />
              </div>
            </JobsProvider>
          </WalletProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
