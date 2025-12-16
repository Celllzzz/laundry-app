"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { WashingMachine, ArrowRight, Loader2, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner" // <--- 1. Import Toast

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email atau password tidak valid.")
        toast.error("Gagal login, periksa kembali data Anda.") // Optional: Feedback Error
      } else {
        // 2. Tampilkan Feedback Sukses
        toast.success("Login berhasil! Selamat datang kembali.")
        
        router.refresh()
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem")
      toast.error("Terjadi kesalahan pada sistem.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
          <div className="bg-blue-600 text-white p-2 rounded-lg shadow-md group-hover:bg-blue-700 transition-colors">
            <WashingMachine size={28} />
          </div>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">WashPoint System</h1>
        <p className="text-gray-500 text-sm mt-1">Masuk untuk melanjutkan ke dashboard.</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Selamat Datang 👋</h2>
            <p className="text-sm text-gray-500 mt-1">Silakan masuk untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="user@example.com"
                  className="pl-9 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <Input 
                  id="password" 
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all" 
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <span className="flex items-center gap-2">
                  Masuk <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Belum punya akun?{" "}
                <Link href="/register" className="text-blue-600 font-semibold hover:underline">
                  Daftar di sini
                </Link>
              </p>
            </div>

          </form>
        </div>
        
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">
            &copy; 2024 WashPoint. All rights reserved.
          </p>
        </div>
      </div>

    </div>
  )
}