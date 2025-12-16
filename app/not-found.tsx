import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <div className="bg-red-100 p-4 rounded-full mb-6 animate-pulse">
        <AlertCircle className="h-12 w-12 text-red-600" />
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        Ups! Sepertinya halaman yang Anda cari sudah dicuci bersih hingga hilang, atau link-nya salah.
      </p>

      <div className="flex gap-4">
        <Link href="/">
          <Button variant="outline">Kembali ke Depan</Button>
        </Link>
        <Link href="/dashboard">
          <Button>Ke Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}