"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, History, LogOut, WashingMachine, ListChecks, Loader2 } from "lucide-react" // Tambah Loader2
import { toast } from "sonner"
import { useState } from "react" // Tambah useState

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession() // Ambil status juga
  const user = session?.user
  const [isLoggingOut, setIsLoggingOut] = useState(false) // State loading logout

  // Sembunyikan Navbar di halaman login dan register
  if (pathname === "/login" || pathname === "/register") {
    return null
  }

  // LOGIC PENTING: Cek apakah ini halaman yang harusnya hanya untuk User Login
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname === "/riwayat"

  // FIX GLITCH: Jika user sudah null (logout) TAPI masih di halaman protected,
  // Tampilkan skeleton/loading saja biar navbar tidak berubah jadi tombol "Masuk"
  // Ini mencegah layout shift atau tampilan aneh sebelum redirect selesai.
  if (isProtectedRoute && !user) {
    return (
      <nav className="w-full border-b bg-white z-50">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
           {/* Tampilkan Logo Saja atau Kosong */}
           <div className="flex items-center gap-2 text-xl font-bold text-gray-300">
              <div className="bg-gray-200 text-white p-1 rounded-lg">
                <WashingMachine size={24} />
              </div>
              WashPoint
           </div>
           {/* Spinner kecil penanda sedang redirect */}
           <Loader2 className="animate-spin text-gray-300" />
        </div>
      </nav>
    )
  }

  const handleLogout = async () => {
    setIsLoggingOut(true) 
    
    // 1. Hapus sesi di server
    await signOut({ redirect: false })
    
    // 2. Tampilkan Notifikasi
    toast.success("Berhasil logout. Sampai jumpa lagi!")
    
    // 3. SOLUSI: Gunakan window.location.href (Hard Reload)
    // Ini memaksa browser membuang semua cache sesi lama
    window.location.href = "/"
  }

  const isActive = (path: string) => pathname === path ? "text-blue-600 font-bold bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"

  return (
    <nav className="w-full border-b bg-white z-50">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-700 tracking-tight group">
          <div className="bg-blue-600 text-white p-1 rounded-lg group-hover:bg-blue-700 transition-colors">
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

        {/* Menu Kanan */}
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
                className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                onClick={handleLogout}
                disabled={isLoggingOut} // Disable saat proses logout
                title="Keluar"
              >
                {isLoggingOut ? <Loader2 className="animate-spin" size={20} /> : <LogOut size={20} />}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all">
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg hover:shadow-blue-200 transition-all hover:-translate-y-0.5 active:scale-95">
                  Daftar Sekarang
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}