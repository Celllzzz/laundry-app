"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { WashStage } from "@prisma/client"

// 1. UPDATE WASH STAGE (Kontrol Mesin oleh Customer)
export async function updateCustomerWashStage(bookingId: string, stage: WashStage, machineId: string) {
  const session = await auth()

  // FIX: Cek apakah session dan user ada
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  })

  // FIX: Gunakan optional chaining (?.) untuk keamanan
  if (!booking || booking.userId !== session.user.id) {
    return { error: "Bukan pesanan Anda" }
  }

  // Update status
  await prisma.booking.update({
    where: { id: bookingId },
    data: { washStage: stage }
  })

  // Logika status mesin (sama seperti admin)
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
    await prisma.machine.update({
      where: { id: machineId },
      data: { status: "BUSY" }
    })
  }

  revalidatePath("/dashboard")
  revalidatePath("/riwayat")
  return { success: true }
}

// 2. CANCEL BOOKING (Oleh Customer)
export async function cancelMyBooking(bookingId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { machine: true } // Include machine untuk ambil ID-nya
  })

  if (!booking || booking.userId !== session.user.id) {
    return { error: "Bukan pesanan Anda" }
  }

  if (booking.status !== "PENDING" && booking.status !== "PAID") {
    return { error: "Tidak dapat membatalkan pesanan yang sedang berjalan" }
  }

  // Update Booking
  await prisma.booking.update({
    where: { id: bookingId },
    data: { 
      status: "CANCELLED",
      washStage: "FINISHED"
    }
  })

  // Kembalikan Mesin jadi Available
  if (booking.machineId) {
    await prisma.machine.update({
      where: { id: booking.machineId },
      data: { status: "AVAILABLE" }
    })
  }

  revalidatePath("/dashboard")
  revalidatePath("/riwayat")
  return { success: true }
}