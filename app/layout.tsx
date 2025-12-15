import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Ganti localFont jadi Google Font
import "./globals.css";
import { auth } from "@/auth";
import Navbar from "@/components/Navbar";

// Kita pakai font Inter (standar, bersih, mirip GitHub/Vercel)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Laundry App",
  description: "Aplikasi Manajemen Laundry",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        
        <Navbar session={session} />
        
        <main className="container mx-auto py-6">
          {children}
        </main>
        
      </body>
    </html>
  );
}