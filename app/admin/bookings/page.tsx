import { prisma } from "@/lib/prisma"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { updateBookingStatus, updateWashStage, cancelBooking } from "@/app/actions/admin-booking"
import { 
  ClipboardList, Banknote, Loader2, CheckCircle2, 
  XCircle, Shirt, Wind, Droplets, ArrowRight 
} from "lucide-react"

function ActionButtons({ booking }: { booking: any }) {
  const isFinished = booking.washStage === "FINISHED" || booking.status === "COMPLETED" || booking.status === "CANCELLED"
  
  if (isFinished) return (
    <span className="text-xs font-medium text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
      <CheckCircle2 className="w-3 h-3" /> Arsip
    </span>
  )

  return (
    <div className="flex flex-col gap-2">
      {booking.status === "PENDING" && (
        <div className="flex items-center gap-2">
          <form action={updateBookingStatus.bind(null, booking.id, "PAID")}>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 h-7 text-xs shadow-sm">
              <Banknote className="w-3 h-3 mr-1" /> Verifikasi
            </Button>
          </form>
          <form action={cancelBooking.bind(null, booking.id, booking.machineId)}>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-50">
              <XCircle className="w-3 h-3 mr-1" /> Batal
            </Button>
          </form>
        </div>
      )}

      {booking.status === "PAID" && (
        <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          <form action={updateWashStage.bind(null, booking.id, "WASHING", booking.machineId)}>
            <Button size="icon" variant={booking.washStage === "WASHING" ? "default" : "ghost"} className={`h-6 w-6 rounded ${booking.washStage === "WASHING" ? "bg-blue-600" : "text-gray-400 hover:text-blue-600"}`} title="Cuci">
              <Shirt className="w-3 h-3" />
            </Button>
          </form>
          <ArrowRight className="w-3 h-3 text-gray-300" />
          <form action={updateWashStage.bind(null, booking.id, "RINSING", booking.machineId)}>
            <Button size="icon" variant={booking.washStage === "RINSING" ? "default" : "ghost"} className={`h-6 w-6 rounded ${booking.washStage === "RINSING" ? "bg-cyan-500 hover:bg-cyan-600" : "text-gray-400 hover:text-cyan-500"}`} title="Bilas">
              <Droplets className="w-3 h-3" />
            </Button>
          </form>
          <ArrowRight className="w-3 h-3 text-gray-300" />
          <form action={updateWashStage.bind(null, booking.id, "DRYING", booking.machineId)}>
            <Button size="icon" variant={booking.washStage === "DRYING" ? "default" : "ghost"} className={`h-6 w-6 rounded ${booking.washStage === "DRYING" ? "bg-orange-500 hover:bg-orange-600" : "text-gray-400 hover:text-orange-500"}`} title="Kering">
              <Wind className="w-3 h-3" />
            </Button>
          </form>
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <form action={updateWashStage.bind(null, booking.id, "FINISHED", booking.machineId)}>
            <Button size="sm" variant="outline" className="h-6 text-[10px] border-green-600 text-green-700 hover:bg-green-50 px-2 h-6">
              Selesai
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true, machine: true } 
  })

  const activeCount = bookings.filter(b => b.status === "PAID" && b.washStage !== "FINISHED").length
  const completedCount = bookings.filter(b => b.status === "COMPLETED" || b.washStage === "FINISHED").length

  return (
    <div className="min-h-screen bg-gray-50/50">
      
      {/* WRAPPER UTAMA: Mengikuti lebar Navbar */}
      <div className="container mx-auto px-4 md:px-8 py-8 space-y-8">
      
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              Kelola Pesanan
            </h1>
            <p className="text-gray-500 mt-1">Pantau antrian dan riwayat pencucian.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-lg border border-blue-100 shadow-sm flex items-center gap-3">
              <div className="p-1.5 bg-blue-50 rounded-md text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Sedang Proses</p>
                <p className="text-lg font-bold text-gray-900 leading-none">{activeCount}</p>
              </div>
            </div>

            <div className="bg-white px-4 py-2 rounded-lg border border-green-100 shadow-sm flex items-center gap-3">
              <div className="p-1.5 bg-green-50 rounded-md text-green-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Selesai</p>
                <p className="text-lg font-bold text-gray-900 leading-none">{completedCount}</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="border border-gray-200 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-[220px] pl-6 text-xs font-bold uppercase tracking-wider text-gray-500">Pelanggan</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">Mesin</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-gray-500">Progress</TableHead>
                  <TableHead className="w-[280px] text-xs font-bold uppercase tracking-wider text-gray-500">Kontrol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="pl-6">
                      <div className="font-bold text-gray-900 text-sm">{item.user.name}</div>
                      <div className="text-xs text-gray-500">{item.user.email}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                        #{item.id.slice(-6).toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900 text-sm">{item.machine.name}</div>
                      <Badge variant="outline" className="text-[10px] font-normal bg-gray-50 text-gray-600 mt-1 border-gray-200">
                        {item.machine.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`
                        text-[10px] font-bold border-0 px-2 py-0.5
                        ${item.status === 'PAID' ? 'bg-green-100 text-green-700' : ''}
                        ${item.status === 'PENDING' ? 'bg-orange-100 text-orange-700 animate-pulse' : ''}
                        ${item.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : ''}
                        ${item.status === 'COMPLETED' ? 'bg-gray-100 text-gray-500' : ''}
                      `}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.status === 'PAID' && item.washStage !== 'FINISHED' ? (
                        <div className="w-full max-w-[120px]">
                          <div className="flex justify-between text-[10px] uppercase font-bold text-blue-600 mb-1">
                            <span>{item.washStage}</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full bg-blue-500 rounded-full transition-all duration-500 ${
                              item.washStage === 'QUEUED' ? 'w-1/4' :
                              item.washStage === 'WASHING' ? 'w-2/4' :
                              item.washStage === 'RINSING' ? 'w-3/4' :
                              item.washStage === 'DRYING' ? 'w-full' : 'w-0'
                            }`} />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <ActionButtons booking={item} />
                    </TableCell>
                  </TableRow>
                ))}
                {bookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-gray-500 text-sm">
                      Tidak ada data pesanan saat ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}