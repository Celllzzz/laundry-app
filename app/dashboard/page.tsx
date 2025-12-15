import { auth } from "@/auth"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Halo, {session?.user?.name} 👋</h1>
      <p className="text-gray-500 mb-8">Ini adalah halaman khusus Customer.</p>
      
      <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
        Status: <span className="font-bold text-blue-700">{session?.user?.role}</span>
      </div>
    </div>
  )
}