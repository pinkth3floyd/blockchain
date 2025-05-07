import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./core/ui/elements/tooltip";
import { Toaster } from './core/ui/elements/toaster';
import { Toaster as Sonner } from './core/ui/elements/sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blockchain Visualizer By Prakash Niraula",
  description: "One sample typescript implementation of blockchain technology. Github https://github.com/pinkth3floyd/blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (

    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
          </body>
        </TooltipProvider>
      </QueryClientProvider>
    </html>
  );
}
