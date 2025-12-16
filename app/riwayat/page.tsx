import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import TransactionDetailDialog from "@/components/customer/TransactionDetailDialog"
import { 
  History, 
  Receipt, 
  CalendarDays, 
  Clock, 
  WashingMachine, 
  CreditCard 
} from "lucide-react"

export default async function HistoryPage() {
  const session = await auth()
  
  const bookings = await prisma.booking.findMany({
    where: { userId: session?.user?.id },
    include: { machine: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center text-blue-600">
              <History size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Riwayat Transaksi</h1>
              <p className="text-sm text-gray-500">Arsip lengkap penggunaan layanan laundry Anda.</p>
            </div>
          </div>
          
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-600 font-medium">
            Total Transaksi: <span className="text-gray-900 font-bold">{bookings.length}</span>
          </div>
        </div>

        {/* Tabel Data */}
        <Card className="border border-gray-200 shadow-sm bg-white overflow-hidden rounded-xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50/80">
                  <TableRow className="hover:bg-gray-50/80">
                    <TableHead className="pl-6 w-[250px] text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu & Tanggal</TableHead>
                    <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Detail Mesin</TableHead>
                    <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total Biaya</TableHead>
                    <TableHead className="text-center w-[100px] pr-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="hover:bg-blue-50/30 transition-colors border-gray-100">
                      
                      {/* Kolom Waktu */}
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 text-gray-400">
                            <CalendarDays size={16} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {new Date(booking.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'long', year: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                              <Clock size={12} />
                              {new Date(booking.startTime).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} WIB
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Kolom Mesin */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500">
                            <WashingMachine size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{booking.machine.name}</div>
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-1">
                              {booking.machine.type}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Kolom Status */}
                      <TableCell>
                        <Badge variant="outline" className={`
                          py-1 px-3 rounded-full text-[11px] font-bold border-0
                          ${booking.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' : ''}
                          ${booking.status === 'PAID' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20' : ''}
                          ${booking.status === 'PENDING' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 animate-pulse' : ''}
                          ${booking.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20' : ''}
                        `}>
                          {booking.status === 'PAID' ? 'SEDANG PROSES' : booking.status}
                        </Badge>
                      </TableCell>

                      {/* Kolom Harga */}
                      <TableCell className="text-right">
                        <div className="font-bold text-gray-900 text-base">
                          Rp {booking.totalPrice.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-end gap-1">
                          <CreditCard size={10} />
                          {booking.paymentMethod || 'QRIS'}
                        </div>
                      </TableCell>

                      {/* Kolom Aksi */}
                      <TableCell className="text-center pr-6">
                        <TransactionDetailDialog booking={booking} />
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Empty State */}
                  {bookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                            <Receipt className="w-8 h-8 text-gray-300" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">Belum ada transaksi</h3>
                          <p className="text-gray-500 text-sm max-w-xs mx-auto">
                            Anda belum pernah melakukan pemesanan layanan laundry.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}