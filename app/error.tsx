"use client" // Error components must be Client Components

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error ke console (atau layanan monitoring seperti Sentry)
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Ada Sedikit Masalah 😵</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Jangan panik. Terjadi kesalahan sistem saat memproses permintaan Anda. 
        Tim kami mungkin sedang memperbaikinya.
      </p>
      
      <Button onClick={() => reset()} className="flex items-center gap-2">
        <RefreshCcw className="w-4 h-4" />
        Coba Lagi
      </Button>
    </div>
  )
}