import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header" // Adjust path as needed (e.g., if in src/app/components/Header.tsx)

import { UserProvider } from "./context/UserContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jayaprada Foundation Portal",
  description: "NGO Management Dashboard for Jayaprada Foundation",
  icons: {
    icon: "/logo/Jayaprada Foundation Logo (1).png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProvider>
        <Header />
        {children}
      </UserProvider>
      </body>
    </html>
  );
}