"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { auth, type User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<User | null>
  signUp: (userData: any) => Promise<User>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize auth state
  useEffect(() => {
    // Initialize localStorage with dummy users if running in browser
    if (typeof window !== "undefined") {
      // This will initialize localStorage with dummy users if not already set
      auth.getUsers()

      // Check if user is already logged in
      const currentUser = auth.getCurrentUser()
      setUser(currentUser)
      setLoading(false)

      // Redirect if needed
      if (!currentUser && pathname?.startsWith("/dashboard")) {
        router.push("/auth/signin")
      }
    }
  }, [pathname, router])

  const signIn = async (email: string, password: string) => {
    const user = auth.signIn(email, password)
    setUser(user)
    return user
  }

  const signUp = async (userData: any) => {
    const newUser = auth.signUp(userData)
    return newUser
  }

  const signOut = () => {
    auth.signOut()
    setUser(null)
    router.push("/auth/signin")
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

