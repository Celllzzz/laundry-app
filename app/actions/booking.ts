"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { BookingStatus, WashStage, MachineStatus } from "@prisma/client" // <--- Import Enum

export async function createBooking(formData: FormData) {
  const session = await auth()
  
  // FIX: Safety Check dengan optional chaining
  if (!session?.user?.id) {
    return { error: "Anda harus login terlebih dahulu" }
  }

  const machineId = formData.get("machineId") as string
  const duration = parseInt(formData.get("duration") as string)
  const paymentMethod = formData.get("paymentMethod") as string
  
  const pricePerMinute = 1000
  const totalPrice = duration * pricePerMinute

  const startTime = new Date()
  const endTime = new Date(startTime.getTime() + duration * 60000)

  try {
    await prisma.$transaction([
      // 1. Buat Booking
      prisma.booking.create({
        data: {
          userId: session.user.id,
          machineId: machineId,
          startTime: startTime,
          endTime: endTime,
          totalPrice: totalPrice,
          status: BookingStatus.PAID,     // <--- FIX: Gunakan Enum
          paymentMethod: paymentMethod,
          washStage: WashStage.QUEUED     // <--- FIX: Gunakan Enum
        }
      }),

      // 2. Update Status Mesin
      prisma.machine.update({
        where: { id: machineId },
        data: { status: MachineStatus.BUSY } // <--- FIX: Gunakan Enum
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