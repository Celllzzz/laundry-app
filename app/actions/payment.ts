"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function payBooking(bookingId: string, method: string) {
  // Update status jadi PAID
  await prisma.booking.update({
    where: { id: bookingId },
    data: { 
      status: "PAID",
      paymentMethod: method,
      washStage: "QUEUED" // Siap antri
    }
  })
  revalidatePath("/dashboard")
}