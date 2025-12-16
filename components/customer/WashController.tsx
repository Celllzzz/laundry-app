"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { updateCustomerWashStage } from "@/app/actions/customer-booking"
import { toast } from "sonner"
import { 
  Play, Waves, Wind, CheckCircle2, Loader2, ArrowRight, 
  Droplets, Timer, PartyPopper 
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

// Definisi Tahapan & Style-nya
const STAGES = [
  { id: "QUEUED", label: "Antrian", icon: Timer, color: "bg-slate-500", ring: "ring-slate-200" },
  { id: "WASHING", label: "Pencucian", icon: Waves, color: "bg-blue-500", ring: "ring-blue-200" },
  { id: "RINSING", label: "Pembilasan", icon: Droplets, color: "bg-cyan-500", ring: "ring-cyan-200" },
  { id: "DRYING", label: "Pengeringan", icon: Wind, color: "bg-orange-500", ring: "ring-orange-200" },
  { id: "FINISHED", label: "Selesai", icon: CheckCircle2, color: "bg-green-500", ring: "ring-green-200" },
]

export default function WashController({ booking }: { booking: any }) {
  const [loading, setLoading] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [targetStage, setTargetStage] = useState("")

  const currentStage = booking.washStage
  const currentStageIdx = STAGES.findIndex(s => s.id === currentStage)
  const activeStepConfig = STAGES[currentStageIdx] || STAGES[0]

  // Logic: Tombol Selanjutnya
  const getNextAction = () => {
    switch (currentStage) {
      case "QUEUED": return { label: "Mulai Mencuci", stage: "WASHING", desc: "Pastikan pakaian sudah masuk & pintu tertutup." }
      case "WASHING": return { label: "Mulai Bilas", stage: "RINSING", desc: "Sabun akan dibilas bersih dari pakaian." }
      case "RINSING": return { label: "Mulai Pengeringan", stage: "DRYING", desc: "Pastikan tidak ada bahan yang mudah meleleh." }
      case "DRYING": return { label: "Selesai & Ambil", stage: "FINISHED", desc: "Jangan lupa cek barang tertinggal di mesin." }
      default: return null
    }
  }

  const nextAction = getNextAction()

  const handleUpdate = async () => {
    setLoading(true)
    await updateCustomerWashStage(booking.id, targetStage)
    setLoading(false)
    setOpenConfirm(false)
    toast.success("Status mesin berhasil diperbarui!")
  }

  const confirmAction = (stage: string) => {
    setTargetStage(stage)
    setOpenConfirm(true)
  }

  return (
    <div className="w-full space-y-6">
      
      {/* 1. VISUAL TIMELINE */}
      <div className="relative flex justify-between items-center px-2">
        {/* Garis Progress Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 rounded-full" />
        {/* Garis Progress Aktif */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-600 -z-10 rounded-full transition-all duration-700 ease-out" 
          style={{ width: `${(currentStageIdx / (STAGES.length - 1)) * 100}%` }} 
        />

        {STAGES.map((step, idx) => {
          const isActive = idx <= currentStageIdx
          const isCurrent = idx === currentStageIdx
          const Icon = step.icon

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative group">
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 z-10 border-2
                  ${isActive 
                    ? `${step.color} border-transparent text-white shadow-md scale-110` 
                    : 'bg-white border-slate-200 text-slate-300'
                  }
                  ${isCurrent ? `ring-4 ${step.ring}` : ''}
                `}
              >
                <Icon size={14} className={isCurrent ? "animate-pulse" : ""} />
              </div>
              
              {/* Tooltip Label (Hanya muncul di step aktif/sekarang) */}
              <span className={`
                absolute -bottom-6 text-[10px] font-bold uppercase tracking-wide whitespace-nowrap transition-colors duration-300
                ${isCurrent ? 'text-slate-800 opacity-100 translate-y-0' : 'text-slate-400 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}
              `}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* 2. STATUS CARD (The "Monitor") */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex items-center gap-4 relative overflow-hidden">
        {/* Background Blob Animation */}
        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl ${activeStepConfig.color}`} />
        
        <div className={`
          w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-colors duration-500
          ${activeStepConfig.color}
        `}>
          <activeStepConfig.icon size={28} className="animate-bounce" />
        </div>
        
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Status Saat Ini</p>
          <h3 className="text-lg font-bold text-slate-800">{activeStepConfig.label}</h3>
          <p className="text-xs text-slate-500">
             {currentStage === 'QUEUED' && "Menunggu instruksi Anda..."}
             {currentStage === 'WASHING' && "Sedang membersihkan noda..."}
             {currentStage === 'RINSING' && "Sedang membilas busa..."}
             {currentStage === 'DRYING' && "Sedang memanaskan udara..."}
          </p>
        </div>
      </div>

      {/* 3. ACTION BUTTON (The "Remote") */}
      {nextAction ? (
        <div className="pt-2">
          <Button 
            onClick={() => confirmAction(nextAction.stage)} 
            className="w-full h-14 rounded-xl bg-slate-900 hover:bg-black text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            <div className="flex items-center justify-between w-full px-2">
              <span className="flex flex-col items-start text-left">
                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Langkah Selanjutnya</span>
                <span className="text-base font-bold flex items-center gap-2">
                  {nextAction.label}
                </span>
              </span>
              <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                <ArrowRight size={20} />
              </div>
            </div>
          </Button>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center">
            <PartyPopper className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-green-700 font-bold">Cucian Selesai!</p>
            <p className="text-xs text-green-600">Terima kasih telah menggunakan layanan kami.</p>
        </div>
      )}

      {/* 4. CONFIRMATION DIALOG */}
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <Play size={16} className="text-blue-600 fill-blue-600" />
              </div>
              Konfirmasi Tindakan
            </DialogTitle>
            <DialogDescription className="pt-2">
              Anda akan mengubah status mesin ke tahap: <br/>
              <span className="font-bold text-slate-900 text-lg block mt-1">{nextAction?.label}</span>
              <span className="block mt-2 text-xs bg-slate-100 p-2 rounded border text-slate-600">
                ℹ️ {nextAction?.desc}
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setOpenConfirm(false)}>Batalkan</Button>
            <Button onClick={handleUpdate} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
              Ya, Lanjutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}