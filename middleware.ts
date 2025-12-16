import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const user = req.auth?.user
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isOnAdmin = req.nextUrl.pathname.startsWith('/admin')
  const isOnLogin = req.nextUrl.pathname.startsWith('/login')

  // 1. Jika sudah login tapi buka halaman login, lempar ke halaman yang sesuai
  if (isOnLogin && isLoggedIn) {
    if (user?.role === "ADMIN") {
      return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl))
    } else {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
  }

  // 2. Jika belum login tapi coba akses halaman private (Admin/Dashboard)
  if (!isLoggedIn && (isOnAdmin || isOnDashboard)) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 3. Proteksi Khusus Role: Jika Customer coba masuk halaman Admin
  if (isOnAdmin && user?.role !== "ADMIN") {
    // Redirect ke dashboard user biasa
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  // 4. [BARU] Jika ADMIN masuk ke Dashboard User, pindahkan ke Dashboard Admin
  if (isOnDashboard && user?.role === "ADMIN") {
    return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl))
  }

  return NextResponse.next()
})

// Tentukan halaman mana saja yang dijaga oleh Satpam (Middleware) ini
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}