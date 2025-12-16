import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AddMachineDialog from "@/components/admin/AddMachineDialog"
import DeleteMachineButton from "@/components/admin/DeleteMachineButton"
import EditMachineDialog from "@/components/admin/EditMachineDialog"
import { WashingMachine, CheckCircle2, PlayCircle, AlertTriangle } from "lucide-react"

function StatCard({ title, value, icon, color }: any) {
  return (
    <Card className="border shadow-sm bg-white">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 leading-none mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function AdminDashboardPage() {
  const machines = await prisma.machine.findMany({ orderBy: { name: 'asc' }})
  const totalMachines = machines.length
  const availableMachines = machines.filter(m => m.status === 'AVAILABLE').length
  const busyMachines = machines.filter(m => m.status === 'BUSY').length
  const maintenanceMachines = machines.filter(m => m.status === 'MAINTENANCE').length

  return (
    <div className="min-h-screen bg-gray-50/50">
      
      {/* WRAPPER UTAMA: Mengikuti lebar Navbar */}
      <div className="container mx-auto px-4 md:px-8 py-8 space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Pengelola</h1>
            <p className="text-gray-500 text-sm">Ringkasan operasional laundry hari ini.</p>
          </div>
          <AddMachineDialog />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Unit" value={totalMachines} icon={<WashingMachine className="text-blue-600" />} color="bg-blue-50" />
          <StatCard title="Tersedia" value={availableMachines} icon={<CheckCircle2 className="text-green-600" />} color="bg-green-50" />
          <StatCard title="Dipakai" value={busyMachines} icon={<PlayCircle className="text-indigo-600" />} color="bg-indigo-50" />
          <StatCard title="Maintenance" value={maintenanceMachines} icon={<AlertTriangle className="text-orange-600" />} color="bg-orange-50" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-bold text-gray-900">Status Mesin Real-time</h2>
             <Badge variant="outline" className="text-gray-500">{totalMachines} Unit Terdaftar</Badge>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {machines.map((machine) => (
              <div key={machine.id} className="relative group border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors bg-white hover:shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                      <WashingMachine className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{machine.name}</h3>
                      <p className="text-[10px] text-gray-500 uppercase font-medium">{machine.type}</p>
                    </div>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    machine.status === 'AVAILABLE' ? 'bg-green-500' : 
                    machine.status === 'BUSY' ? 'bg-indigo-500' : 'bg-orange-500'
                  }`} />
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                  <Badge variant="secondary" className="text-[10px] h-6 bg-gray-100 text-gray-600 font-medium">
                    {machine.status}
                  </Badge>
                  <div className="flex gap-1">
                    <EditMachineDialog machine={machine} />
                    <DeleteMachineButton id={machine.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}