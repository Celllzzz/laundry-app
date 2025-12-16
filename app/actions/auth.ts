"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const phone = formData.get("phone") as string

    // 1. Validasi Input (Sekarang Phone Wajib)
    if (!name || !email || !password || !phone) {
      return { error: "Semua kolom data diri wajib diisi." }
    }

    if (password.length < 6) {
      return { error: "Password minimal 6 karakter." }
    }

    // 2. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { error: "Email sudah digunakan. Silakan login." }
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Simpan ke Database
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone, // Wajib disimpan
        role: Role.CUSTOMER
      }
    })

    return { success: "Pendaftaran berhasil. Silakan login." }

  } catch (error) {
    console.error("Register Error:", error)
    return { error: "Terjadi kesalahan pada server." }
  }
}