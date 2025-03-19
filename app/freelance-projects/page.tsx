"use client"

import { useEffect, useState } from "react"
import { FreelanceProjectsContent } from "@/components/freelance/freelance-projects-content"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { auth, type User } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function FreelanceProjectsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = auth.getCurrentUser()

    if (!currentUser) {
      // Redirect to sign in page if not authenticated
      router.push("/auth/signin")
      return
    }

    setUser(currentUser)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader user={user} />
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto bg-muted/20">
            <FreelanceProjectsContent />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

