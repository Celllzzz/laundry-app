"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { MachineStatus } from "@prisma/client" // <--- 1. Import Enum

// 1. CREATE (Tambah Mesin)
export async function createMachine(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const type = formData.get("type") as string
    const capacity = parseInt(formData.get("capacity") as string)

    await prisma.machine.create({
      data: {
        name,
        type,
        capacity,
        status: "AVAILABLE", // Default status
      },
    })

    revalidatePath("/admin/dashboard") 
    return { success: true }
  } catch (error) {
    console.error("Gagal create machine:", error)
    throw new Error("Gagal menambahkan mesin")
  }
}

// 2. UPDATE (Edit Mesin)
export async function updateMachine(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const type = formData.get("type") as string
    const capacity = parseInt(formData.get("capacity") as string)
    
    // <--- 2. Casting string ke tipe MachineStatus agar Type-Safe
    const status = formData.get("status") as MachineStatus 

    await prisma.machine.update({
      where: { id },
      data: {
        name,
        type,
        capacity,
        status, // Sekarang tipe datanya sudah sesuai (Enum)
      },
    })

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Gagal update machine:", error)
    throw new Error("Gagal mengupdate data mesin")
  }
}

// 3. DELETE (Hapus Mesin)
export async function deleteMachine(id: string) {
  try {
    await prisma.machine.delete({
      where: { id },
    })

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Gagal delete machine:", error)
    throw new Error("Gagal menghapus mesin")
  }
}