"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group" // Kita pakai Radio untuk Payment
import { createBooking } from "@/app/actions/booking"
import { toast } from "sonner"
import { CreditCard, QrCode } from "lucide-react" // Icon pemanis

interface MachineProps {
  id: string
  name: string
  type: string
}

export default function BookingDialog({ machine }: { machine: MachineProps }) {
  const [open, setOpen] = useState(false)
  const [duration, setDuration] = useState("30")
  const [paymentMethod, setPaymentMethod] = useState("QRIS") // Default QRIS
  const [loading, setLoading] = useState(false)

  const price = parseInt(duration) * 1000 

  const handleBooking = async () => {
    setLoading(true)
    
    const formData = new FormData()
    formData.append("machineId", machine.id)
    formData.append("duration", duration)
    formData.append("paymentMethod", paymentMethod) // Kirim metode bayar

    const result = await createBooking(formData)

    setLoading(false)
    setOpen(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result.success)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm">
          Pilih & Bayar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Checkout {machine.name}</DialogTitle>
          <DialogDescription>
            Atur durasi dan pilih metode pembayaran untuk menyalakan mesin.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          
          {/* 1. Pilih Durasi */}
          <div className="grid gap-2">
            <Label className="font-semibold">Durasi Pencucian</Label>
            <Select onValueChange={setDuration} defaultValue={duration}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih durasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 Menit (Express) - Rp 30.000</SelectItem>
                <SelectItem value="45">45 Menit (Regular) - Rp 45.000</SelectItem>
                <SelectItem value="60">60 Menit (Deep Clean) - Rp 60.000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 2. Pilih Pembayaran (Radio Button) */}
          <div className="grid gap-3">
            <Label className="font-semibold">Metode Pembayaran</Label>
            <RadioGroup defaultValue="QRIS" onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4">
              
              {/* Opsi QRIS */}
              <div>
                <RadioGroupItem value="QRIS" id="qris" className="peer sr-only" />
                <Label
                  htmlFor="qris"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 cursor-pointer transition-all"
                >
                  <QrCode className="mb-2 h-6 w-6" />
                  QRIS
                </Label>
              </div>

              {/* Opsi Transfer */}
              <div>
                <RadioGroupItem value="TRANSFER" id="transfer" className="peer sr-only" />
                <Label
                  htmlFor="transfer"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 cursor-pointer transition-all"
                >
                  <CreditCard className="mb-2 h-6 w-6" />
                  Transfer
                </Label>
              </div>
              
            </RadioGroup>
          </div>

          {/* 3. Ringkasan Total */}
          <div className="bg-slate-50 p-4 rounded-lg border flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Tagihan</p>
              <p className="font-bold text-lg text-blue-700">Rp {price.toLocaleString('id-ID')}</p>
            </div>
            <div className="text-right text-xs text-gray-400">
              via {paymentMethod}
            </div>
          </div>

        </div>

        <DialogFooter>
          <Button onClick={handleBooking} disabled={loading} className="w-full h-11 text-base">
            {loading ? "Memproses Pembayaran..." : `Bayar Rp ${price.toLocaleString('id-ID')} & Mulai`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}