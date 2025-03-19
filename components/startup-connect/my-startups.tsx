"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Plus, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"

interface Startup {
  id: string
  name: string
  founder: string
  description: string
  fundingGoal: number
  equityOffered: number
  industry: string
  stage: string
  logo: string
}

export default function MyStartups() {
  const [myStartups, setMyStartups] = useState<Startup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchMyStartups = async () => {
      try {
        setIsLoading(true)
        // Get current user
        const currentUser = getCurrentUser()

        if (!currentUser) {
          setMyStartups([])
          setIsLoading(false)
          return
        }

        // Fetch all startups
        const response = await import("@/data/startups.json")
        const allStartups = response.default

        // Filter startups by current user
        const userStartups = allStartups.filter((startup: Startup) => startup.founder === currentUser.id)

        setMyStartups(userStartups)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching startups:", error)
        setIsLoading(false)
      }
    }

    fetchMyStartups()
  }, [])

  const handleCreateStartup = () => {
    router.push("/startup-connect/create")
  }

  const handleEditStartup = (startupId: string) => {
    router.push(`/startup-connect/edit/${startupId}`)
  }

  const handleDeleteStartup = async (startupId: string) => {
    // In a real app, this would be an API call
    toast({
      title: "Not implemented",
      description: "Deleting startups is not implemented in this demo",
      variant: "destructive",
    })
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading your startups...</div>
  }

  if (myStartups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <p className="text-muted-foreground">You haven't created any startups yet.</p>
        <Button onClick={handleCreateStartup}>
          <Plus className="mr-2 h-4 w-4" />
          Create Your First Startup
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Startups</h2>
        <Button onClick={handleCreateStartup}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Startup
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myStartups.map((startup) => (
          <Card key={startup.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-md">
                  <Image
                    src={startup.logo || "/placeholder.svg"}
                    alt={startup.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="text-lg">{startup.name}</CardTitle>
                  <CardDescription>{startup.industry}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{startup.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span>Funding: ${startup.fundingGoal.toLocaleString()}</span>
                <Badge>{startup.stage}</Badge>
              </div>
              <div className="text-sm mt-1">
                <span>Equity offered: {startup.equityOffered}%</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={() => handleEditStartup(startup.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteStartup(startup.id)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

