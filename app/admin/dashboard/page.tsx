import { auth } from "@/auth"

export default async function AdminDashboardPage() {
  const session = await auth()

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-red-600">Admin Panel 🛡️</h1>
      <p className="text-gray-500 mb-8">Hanya user dengan role ADMIN yang bisa melihat ini.</p>
      
      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="font-bold text-lg">Statistik Laundry</h2>
        <p>Total Mesin: 3</p>
        <p>Mesin Dipakai: 1</p>
      </div>
    </div>
  )
}