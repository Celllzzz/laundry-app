"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { BookingStatus, WashStage } from "@prisma/client" // <--- Import Enum

export async function payBooking(bookingId: string, method: string) {
  // Update status jadi PAID
  await prisma.booking.update({
    where: { id: bookingId },
    data: { 
      status: BookingStatus.PAID, // <--- FIX
      paymentMethod: method,
      washStage: WashStage.QUEUED // <--- FIX
    }
  })
  revalidatePath("/dashboard")
}