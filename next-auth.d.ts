// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Memperluas tipe User default
   * Digunakan di auth.ts (saat login awal)
   */
  interface User {
    id: string
    role: string
  }

  /**
   * Memperluas tipe Session default
   * Digunakan di komponen client (useSession) dan server (auth())
   */
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  /**
   * Memperluas tipe JWT default
   * Digunakan di auth.ts (callback jwt)
   */
  interface JWT {
    id: string
    role: string
  }
}