"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerUser } from "@/app/actions/auth"
import { toast } from "sonner"
import { 
  Loader2, 
  WashingMachine, 
  ArrowRight, 
  User, 
  Mail, 
  Phone, 
  Lock 
} from "lucide-react"

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const res = await registerUser(formData)

    if (res.error) {
      toast.error(res.error)
      setLoading(false)
    } else {
      toast.success(res.success)
      // Redirect ke login setelah sukses
      setTimeout(() => {
        router.push("/login")
      }, 1000)
    }
  }

  return (
    // UPDATED: Menambahkan py-10 untuk mobile dan md:py-16 untuk desktop agar tidak mentok
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-10 md:py-16">
      
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
          <div className="bg-blue-600 text-white p-2 rounded-lg shadow-md group-hover:bg-blue-700 transition-colors">
            <WashingMachine size={28} />
          </div>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">WashPoint System</h1>
        <p className="text-gray-500 text-sm mt-1">Daftar akun untuk mulai mencuci.</p>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Buat Akun Baru 🚀</h2>
            <p className="text-sm text-gray-500 mt-1">Isi data diri Anda dengan lengkap.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input Nama */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <Input 
                  id="name" 
                  name="name" 
                  type="text" 
                  placeholder="Nama Anda"
                  className="pl-9 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                  required 
                />
              </div>
            </div>

            {/* Input Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="user@example.com"
                  className="pl-9 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                  required 
                />
              </div>
            </div>

            {/* Input Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  placeholder="08123456789"
                  className="pl-9 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                  required 
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <Input 
                  id="password" 
                  name="password" 
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                  required 
                  minLength={6}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all mt-2" 
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <span className="flex items-center gap-2">
                  Daftar Sekarang <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            {/* Link Login */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                  Masuk di sini
                </Link>
              </p>
            </div>

          </form>
        </div>
        
        {/* Footer Card */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">
            &copy; 2025 WashPoint. All rights reserved.
          </p>
        </div>
      </div>

    </div>
  )
}