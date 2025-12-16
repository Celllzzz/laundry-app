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
import { createMachine } from "@/app/actions/machine" // Pastikan import ini benar
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner" // Import Toast

export default function AddMachineDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      await createMachine(formData)
      setOpen(false)
      toast.success("Mesin berhasil ditambahkan! 🎉") // Pop-up Sukses
    } catch (error) {
      toast.error("Gagal menambahkan mesin")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Tambah Mesin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Mesin Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama Mesin</Label>
            <Input id="name" name="name" placeholder="Contoh: Washer 01" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipe</Label>
              <Select name="type" defaultValue="Washer">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Washer">Washer (Cuci)</SelectItem>
                  <SelectItem value="Dryer">Dryer (Kering)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Kapasitas (Kg)</Label>
              <Input id="capacity" name="capacity" type="number" defaultValue="7" required />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Simpan Mesin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}