import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TansTackProvider from './provider/TanstackProvider';
import { TooltipProvider } from "./core/ui/elements/tooltip";


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


  return (

    <html lang="en">
     
       
      
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <TansTackProvider>
             <TooltipProvider>
            {children}
            </TooltipProvider>
            </TansTackProvider>
   
          </body>
       
    </html>
  );
}
