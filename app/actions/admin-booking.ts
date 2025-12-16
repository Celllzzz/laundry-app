"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 1. Verifikasi Pembayaran / Ubah Status Booking
export async function updateBookingStatus(bookingId: string, status: string) {
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status }
  })
  revalidatePath("/admin/bookings")
  revalidatePath("/dashboard")
}

// 2. Update Progress Cucian (Cuci -> Bilas -> Kering -> Selesai)
export async function updateWashStage(bookingId: string, stage: string, machineId: string) {
  
  // Gunakan transaksi agar data aman
  await prisma.$transaction(async (tx) => {
    // A. Update Stage Cucian
    await tx.booking.update({
      where: { id: bookingId },
      data: { washStage: stage }
    })

    // B. Logika Khusus: Jika stage == "FINISHED", mesin jadi AVAILABLE lagi
    if (stage === "FINISHED") {
      await tx.machine.update({
        where: { id: machineId },
        data: { status: "AVAILABLE" }
      })
      
      // Opsional: Tandai booking selesai juga
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: "COMPLETED" }
      })
    }
  })

  revalidatePath("/admin/bookings")
  revalidatePath("/admin/dashboard")
  revalidatePath("/dashboard")
}

// 3. Batalkan Pesanan (Cancel)
export async function cancelBooking(bookingId: string, machineId: string) {
  await prisma.$transaction([
    // Set Booking jadi CANCELLED
    prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" }
    }),
    // Bebaskan Mesin jadi AVAILABLE
    prisma.machine.update({
      where: { id: machineId },
      data: { status: "AVAILABLE" }
    })
  ])

  revalidatePath("/admin/bookings")
  revalidatePath("/admin/dashboard")
  revalidatePath("/dashboard")
}