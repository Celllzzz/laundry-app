"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// PERBAIKAN: Menambahkan 'WashingMachine' ke dalam import
import { Calendar, Clock, CreditCard, CheckCircle2, WashingMachine } from "lucide-react"

export default function TransactionDetailDialog({ booking }: { booking: any }) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Detail</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600" />
            Detail Transaksi
          </DialogTitle>
          <DialogDescription>ID Pesanan: #{booking.id.slice(-6).toUpperCase()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Status Banner */}
          <div className="bg-slate-50 p-4 rounded-lg border flex justify-between items-center">
            <span className="text-sm font-medium text-slate-500">Status</span>
            <Badge className={booking.status === 'COMPLETED' ? 'bg-green-600' : 'bg-gray-600'}>
              {booking.status}
            </Badge>
          </div>

          {/* Detail Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <WashingMachine size={12}/> Mesin
              </span>
              <p className="font-semibold">{booking.machine.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <CreditCard size={12}/> Pembayaran
              </span>
              <p className="font-semibold">{booking.paymentMethod || "-"}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar size={14}/> Waktu Mulai
              </span>
              <span className="text-sm font-medium">{formatDate(booking.startTime)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Clock size={14}/> Waktu Selesai
              </span>
              <span className="text-sm font-medium">{formatDate(booking.endTime)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex justify-between items-center mt-4">
            <span className="font-medium text-blue-900">Total Biaya</span>
            <span className="font-bold text-xl text-blue-700">Rp {booking.totalPrice.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}