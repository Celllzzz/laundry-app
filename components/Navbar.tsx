"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, History, LogOut, WashingMachine, ListChecks, 
  Loader2, Menu, X, User 
} from "lucide-react" // Tambah Menu, X, User
import { toast } from "sonner"
import { useState } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // State Hamburger

  // Sembunyikan Navbar di halaman login dan register
  if (pathname === "/login" || pathname === "/register") {
    return null
  }

  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname === "/riwayat"

  // Loading Skeleton saat Logout di halaman protected
  if (isProtectedRoute && !user) {
    return (
      <nav className="w-full border-b bg-white z-50">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2 text-xl font-bold text-gray-300">
              <div className="bg-gray-200 text-white p-1 rounded-lg">
                <WashingMachine size={24} />
              </div>
              WashPoint
           </div>
           <Loader2 className="animate-spin text-gray-300" />
        </div>
      </nav>
    )
  }

  const handleLogout = async () => {
    setIsLoggingOut(true) 
    await signOut({ redirect: false })
    toast.success("Berhasil logout. Sampai jumpa lagi!")
    window.location.href = "/" // Hard Reload
  }

  const isActive = (path: string) => pathname === path ? "text-blue-600 font-bold bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"

  // Helper untuk menutup menu saat link diklik
  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <nav className="w-full border-b bg-white z-50 relative">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* --- BRAND LOGO --- */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2 text-xl font-bold text-blue-700 tracking-tight group">
          <div className="bg-blue-600 text-white p-1 rounded-lg group-hover:bg-blue-700 transition-colors">
            <WashingMachine size={24} />
          </div>
          WashPoint
        </Link>

        {/* --- DESKTOP MENU (Hidden on Mobile) --- */}
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

        {/* --- DESKTOP RIGHT MENU (Profile/Auth) --- */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right leading-tight">
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
                disabled={isLoggingOut}
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

        {/* --- HAMBURGER BUTTON (Mobile Only) --- */}
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN (Animated) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-lg animate-in slide-in-from-top-5 duration-300 z-40">
          <div className="flex flex-col p-4 space-y-4">
            
            {/* 1. Mobile Links */}
            {user ? (
              <div className="flex flex-col space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu Utama</p>
                {user.role === "ADMIN" ? (
                  <>
                    <Link href="/admin/dashboard" onClick={closeMenu} className={`p-3 rounded-lg flex items-center gap-3 ${isActive('/admin/dashboard')}`}>
                      <LayoutDashboard size={20} /> Mesin
                    </Link>
                    <Link href="/admin/bookings" onClick={closeMenu} className={`p-3 rounded-lg flex items-center gap-3 ${isActive('/admin/bookings')}`}>
                      <ListChecks size={20} /> Pesanan
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" onClick={closeMenu} className={`p-3 rounded-lg flex items-center gap-3 ${isActive('/dashboard')}`}>
                      <LayoutDashboard size={20} /> Beranda
                    </Link>
                    <Link href="/riwayat" onClick={closeMenu} className={`p-3 rounded-lg flex items-center gap-3 ${isActive('/riwayat')}`}>
                      <History size={20} /> Riwayat
                    </Link>
                  </>
                )}
              </div>
            ) : null}

            {/* Separator */}
            <div className="h-px bg-gray-100 w-full my-2" />

            {/* 2. Mobile Profile / Auth */}
            {user ? (
              <div className="flex flex-col space-y-4">
                 <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                       <User size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role === "ADMIN" ? "Administrator" : "Pelanggan"}</p>
                    </div>
                 </div>

                 <Button 
                    variant="destructive" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                 >
                    {isLoggingOut ? <Loader2 className="animate-spin" size={18} /> : <LogOut size={18} />}
                    Keluar Aplikasi
                 </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={closeMenu}>
                  <Button variant="outline" className="w-full">Masuk</Button>
                </Link>
                <Link href="/register" onClick={closeMenu}>
                  <Button className="w-full bg-blue-600">Daftar Sekarang</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}