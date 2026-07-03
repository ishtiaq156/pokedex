import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import SoundInitializer from "./components/SoundInitializer";

import SplashScreens from "./components/SplashScreens";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokédex",
  description: "A mobile-optimized Pokédex app inspired by Pokémon GO",
  icons: {
    icon: "/pokedex.png",
    apple: "/pokedex.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pokédex",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#baf0f0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <SplashScreens />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServiceWorkerRegister />
        <SoundInitializer />
        {children}
      </body>
    </html>
  );
}
