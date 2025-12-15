"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function Navbar({ session }: { session: any }) {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-10 container mx-auto">
        {/* Logo / Brand */}
        <Link href="/" className="text-xl font-bold text-primary">
          WashPoint 🧺
        </Link>

        {/* Menu Kanan */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <div className="text-sm text-right hidden md:block">
                <p className="font-medium">{session.user.name}</p>
                <p className="text-xs text-gray-500">{session.user.role}</p>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Logout
              </Button>
            </>
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