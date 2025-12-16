import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WashPoint",
  description: "Sistem Manajemen Laundry Modern",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    // TAMBAHKAN 'scroll-smooth' DI SINI
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Navbar session={session} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}