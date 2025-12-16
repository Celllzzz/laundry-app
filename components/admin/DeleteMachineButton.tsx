"use client"

import { useState } from "react"
import { deleteMachine } from "@/app/actions/machine" 
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
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function DeleteMachineButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteMachine(id) 
      toast.success("Mesin berhasil dihapus")
      setOpen(false)
    } catch (error) {
      toast.error("Gagal menghapus mesin")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <div className="bg-red-100 p-2 rounded-full">
               <AlertTriangle className="h-5 w-5" />
            </div>
            Hapus Mesin?
          </DialogTitle>
          <DialogDescription className="pt-2 text-gray-600">
            Apakah Anda yakin ingin menghapus mesin ini?
            <br />
            <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded mt-2 inline-block">
              Tindakan ini permanen.
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* PERBAIKAN: sm:gap-2 untuk memberi jarak antar tombol */}
        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)} 
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={loading}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghapus...</>
            ) : (
              "Ya, Hapus Permanen"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}