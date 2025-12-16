"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createBooking(formData: FormData) {
  const session = await auth()
  if (!session || !session.user?.id) {
    return { error: "Anda harus login terlebih dahulu" }
  }

  const machineId = formData.get("machineId") as string
  const duration = parseInt(formData.get("duration") as string)
  const paymentMethod = formData.get("paymentMethod") as string // Tambahan: Tangkap metode bayar
  
  const pricePerMinute = 1000
  const totalPrice = duration * pricePerMinute

  const startTime = new Date()
  const endTime = new Date(startTime.getTime() + duration * 60000)

  try {
    await prisma.$transaction([
      // 1. Buat Booking dengan status PAID dan metode pembayaran tercatat
      prisma.booking.create({
        data: {
          userId: session.user.id,
          machineId: machineId,
          startTime: startTime,
          endTime: endTime,
          totalPrice: totalPrice,
          status: "PAID",         // Langsung Lunas
          paymentMethod: paymentMethod, // Simpan metode bayar (QRIS/TRANSFER)
          washStage: "QUEUED"     // Masuk antrian
        }
      }),

      // 2. Update Status Mesin jadi BUSY
      prisma.machine.update({
        where: { id: machineId },
        data: { status: "BUSY" }
      })
    ])

    revalidatePath("/dashboard")
    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/bookings")
    
    return { success: "Pembayaran berhasil! Mesin mulai bekerja." }

  } catch (error) {
    console.error("Booking Failed:", error)
    return { error: "Gagal memproses transaksi." }
  }
}