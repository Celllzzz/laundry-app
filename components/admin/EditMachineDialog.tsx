"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateMachine } from "@/app/actions/machine" // Pastikan import server action update
import { Pencil, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function EditMachineDialog({ machine }: { machine: any }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append("id", machine.id) // Jangan lupa kirim ID
    
    try {
      await updateMachine(formData)
      setOpen(false)
      toast.success("Data mesin berhasil diperbarui!") // Pop-up Sukses
    } catch (error) {
      toast.error("Gagal mengupdate mesin")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Mesin</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama Mesin</Label>
            <Input id="name" name="name" defaultValue={machine.name} required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipe</Label>
              <Select name="type" defaultValue={machine.type}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Washer">Washer</SelectItem>
                  <SelectItem value="Dryer">Dryer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Kapasitas (Kg)</Label>
              <Input id="capacity" name="capacity" type="number" defaultValue={machine.capacity} required />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={machine.status}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Available (Hijau)</SelectItem>
                <SelectItem value="BUSY">Busy (Merah)</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance (Kuning)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}