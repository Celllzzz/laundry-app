"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react" // <--- 1. Import useSession
import { Button } from "@/components/ui/button"
import { LayoutDashboard, History, LogOut, WashingMachine, ListChecks, User } from "lucide-react"

// 2. Hapus props { session } dari parameter fungsi
export default function Navbar() {
  const pathname = usePathname()
  
  // 3. Ambil session langsung di sini (Real-time update!)
  const { data: session } = useSession()
  const user = session?.user

  // Logic: Sembunyikan Navbar di halaman login
  if (pathname === "/login") {
    return null
  }

  const isActive = (path: string) => pathname === path ? "text-blue-600 font-bold bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-700 tracking-tight">
          <div className="bg-blue-600 text-white p-1 rounded-lg">
            <WashingMachine size={24} />
          </div>
          WashPoint
        </Link>

        {/* Menu Tengah (Desktop Only) */}
        {user && (
          <div className="hidden md:flex items-center gap-1">
            {user.role === "ADMIN" ? (
              <>
                <Link href="/admin/dashboard" className={`px-4 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${isActive('/admin/dashboard')}`}>
                  <LayoutDashboard size={18} />
                  Mesin
                </Link>
                <Link href="/admin/bookings" className={`px-4 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${isActive('/admin/bookings')}`}>
                  <ListChecks size={18} />
                  Pesanan
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className={`px-4 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${isActive('/dashboard')}`}>
                  <LayoutDashboard size={18} />
                  Beranda
                </Link>
                <Link href="/riwayat" className={`px-4 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${isActive('/riwayat')}`}>
                  <History size={18} />
                  Riwayat
                </Link>
              </>
            )}
          </div>
        )}

        {/* Menu Kanan (Profile & Logout) */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block leading-tight">
                <p className="font-semibold text-sm text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 font-medium capitalize flex items-center justify-end gap-1">
                  {user.role === "ADMIN" ? "Administrator" : "Pelanggan"}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => signOut({ callbackUrl: "/" })}
                title="Keluar"
              >
                <LogOut size={20} />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}