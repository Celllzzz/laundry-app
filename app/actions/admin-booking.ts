"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { BookingStatus, WashStage } from "@prisma/client" // <--- PENTING: Import Enum ini

// 1. UPDATE STATUS BOOKING
// Ubah tipe parameter 'status' menjadi 'BookingStatus' (bukan string)
export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status }
  })
  
  revalidatePath("/admin/bookings")
  revalidatePath("/dashboard")
  revalidatePath("/riwayat")
}

// 2. UPDATE WASH STAGE (TAHAP PENCUCIAN)
// Ubah tipe parameter 'stage' menjadi 'WashStage' (bukan string)
export async function updateWashStage(bookingId: string, stage: WashStage, machineId: string) {
  
  // Update status cucian
  await prisma.booking.update({
    where: { id: bookingId },
    data: { washStage: stage }
  })

  // Jika tahap selesai (FINISHED), set status mesin jadi AVAILABLE dan booking jadi COMPLETED
  if (stage === "FINISHED") {
    await prisma.machine.update({
      where: { id: machineId },
      data: { status: "AVAILABLE" }
    })

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "COMPLETED" }
    })
  } else {
    // Jika masih mencuci/bilas/kering, pastikan mesin statusnya BUSY
    await prisma.machine.update({
      where: { id: machineId },
      data: { status: "BUSY" }
    })
  }

  revalidatePath("/admin/bookings")
  revalidatePath("/dashboard")
  revalidatePath("/riwayat")
}

// 3. CANCEL BOOKING
export async function cancelBooking(bookingId: string, machineId: string) {
  await prisma.booking.update({
    where: { id: bookingId },
    data: { 
      status: "CANCELLED",
      washStage: "FINISHED" // Reset stage agar tidak menggantung
    }
  })

  // Kembalikan mesin jadi available
  await prisma.machine.update({
    where: { id: machineId },
    data: { status: "AVAILABLE" }
  })

  revalidatePath("/admin/bookings")
  revalidatePath("/dashboard")
}