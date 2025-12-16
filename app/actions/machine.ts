"use server" // Wajib! Memberitahu Next.js ini kode backend

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// 1. Fungsi Tambah Mesin
export async function createMachine(formData: FormData) {
  // Ambil data dari input form
  const name = formData.get("name") as string
  const type = formData.get("type") as string
  const capacity = formData.get("capacity") as string
  
  // Simpan ke DB
  await prisma.machine.create({
    data: {
      name,
      type,
      capacity: parseInt(capacity),
      status: "AVAILABLE", // Default status
    },
  })

  // Refresh halaman admin dashboard (mirip redirect()->back() di Laravel)
  revalidatePath("/admin/dashboard") 
}

// 2. Fungsi Hapus Mesin
export async function deleteMachine(id: string) {
  await prisma.machine.delete({
    where: { id }
  })
  revalidatePath("/admin/dashboard")
}

// 3. Fungsi Update Mesin
// 2. UPDATE (Edit Mesin)
export async function updateMachine(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const name = formData.get("name") as string
    const type = formData.get("type") as string
    const capacity = parseInt(formData.get("capacity") as string)
    const status = formData.get("status") as string

    await prisma.machine.update({
      where: { id },
      data: {
        name,
        type,
        capacity,
        status,
      },
    })

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Gagal update machine:", error)
    throw new Error("Gagal mengupdate data mesin")
  }
}