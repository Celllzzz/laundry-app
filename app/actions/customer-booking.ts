"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Fungsi User Update Status Sendiri
export async function updateSelfServiceWash(bookingId: string, nextStage: string) {
  const session = await auth()
  if (!session) return { error: "Unauthorized" }

  // 1. Cek kepemilikan booking (Security)
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { machine: true }
  })

  if (!booking || booking.userId !== session.user.id) {
    return { error: "Bukan pesanan Anda" }
  }

  try {
    // 2. Jika User klik 'FINISHED', bebaskan mesin
    if (nextStage === "FINISHED") {
      await prisma.$transaction([
        prisma.booking.update({
          where: { id: bookingId },
          data: { washStage: "FINISHED", status: "COMPLETED" }
        }),
        prisma.machine.update({
          where: { id: booking.machineId },
          data: { status: "AVAILABLE" } // Mesin jadi hijau lagi
        })
      ])
    } else {
      // 3. Update tahap biasa (Cuci -> Bilas -> Kering)
      await prisma.booking.update({
        where: { id: bookingId },
        data: { washStage: nextStage }
      })
    }

    revalidatePath("/dashboard")
    return { success: "Status diperbarui" }

  } catch (e) {
    return { error: "Gagal update status" }
  }
}