import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

// Skema validasi input login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const validatedFields = loginSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          // 1. Cari user di database
          const user = await prisma.user.findUnique({
            where: { email }
          })

          if (!user || !user.password) return null

          // 2. Cek password (Hash match)
          const passwordMatch = await bcrypt.compare(password, user.password)

          if (passwordMatch) {
            // Return user object (tanpa password)
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role, 
            }
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/login', // Redirect ke sini kalau belum login
  },
  callbacks: {
    // Agar role user tersimpan di session
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
      }
      return session
    }
  }
})