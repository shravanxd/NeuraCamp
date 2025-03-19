"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, Globe, MapPin, Target, Users, Wallet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"

interface StartupDetailContentProps {
  startupId: string
}

export default function StartupDetailContent({ startupId }: StartupDetailContentProps) {
  const [startup, setStartup] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [connectionMessage, setConnectionMessage] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        setIsLoading(true)

        // Fetch startup data
        const startupsResponse = await import("@/data/startups.json")
        const startupData = startupsResponse.default.find((s: any) => s.id === startupId)

        if (!startupData) {
          router.push("/startup-connect")
          return
        }

        setStartup(startupData)

        // Check if current user is the owner
        const currentUser = getCurrentUser()
        if (currentUser && startupData.founder === currentUser.id) {
          setIsOwner(true)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching startup:", error)
        setIsLoading(false)
      }
    }

    fetchStartup()
  }, [startupId, router])

  const handleConnect = async () => {
    // In a real app, this would be an API call
    toast({
      title: "Connection request sent",
      description: "Your connection request has been sent to the startup founder.",
    })
    setIsDialogOpen(false)
  }

  const handleEdit = () => {
    router.push(`/startup-connect/edit/${startupId}`)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading startup details...</p>
      </div>
    )
  }

  if (!startup) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Startup not found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <div className="flex flex-1 items-center">
            <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.push("/startup-connect")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">Startup Details</h1>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-2/3 space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-md">
                        <Image
                          src={startup.logo || "/placeholder.svg"}
                          alt={startup.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{startup.name}</CardTitle>
                        <CardDescription className="flex items-center text-sm">
                          <MapPin className="mr-1 h-4 w-4" />
                          {startup.location}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">{startup.industry}</Badge>
                      <Badge variant="outline">{startup.stage}</Badge>
                      {startup.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground mb-4">{startup.description}</p>

                    <h3 className="text-lg font-semibold mb-2">Pitch</h3>
                    <p className="text-muted-foreground mb-4">{startup.pitch}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Funding Goal</p>
                          <p className="text-muted-foreground">${startup.fundingGoal.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Equity Offered</p>
                          <p className="text-muted-foreground">{startup.equityOffered}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Traction</p>
                          <p className="text-muted-foreground">{startup.traction}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Founded</p>
                          <p className="text-muted-foreground">{new Date(startup.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Website</p>
                          <a
                            href={startup.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {startup.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-3">Team</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {startup.team.map((member: any) => (
                        <Card key={member.name} className="bg-muted/50">
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-base">{member.name}</CardTitle>
                            <CardDescription>{member.role}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-sm">{member.bio}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="w-full md:w-1/3 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Funding Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Funding Goal</p>
                        <p className="text-2xl font-bold">${startup.fundingGoal.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Equity Offered</p>
                        <p className="text-2xl font-bold">{startup.equityOffered}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Stage</p>
                        <p className="text-lg">{startup.stage}</p>
                      </div>
                      <Separator />
                      {isOwner ? (
                        <Button className="w-full" onClick={handleEdit}>
                          Edit Startup
                        </Button>
                      ) : (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="w-full">Connect with Founder</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Connect with {startup.name}</DialogTitle>
                              <DialogDescription>
                                Send a message to the founder explaining why you're interested in their startup.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <Textarea
                                placeholder="Write your message here..."
                                value={connectionMessage}
                                onChange={(e) => setConnectionMessage(e.target.value)}
                                className="min-h-[120px]"
                              />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleConnect} disabled={!connectionMessage.trim()}>
                                Send Request
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Founder</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                        <Image
                          src="/placeholder.svg?height=40&width=40"
                          alt={startup.founderName}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{startup.founderName}</p>
                        <p className="text-sm text-muted-foreground">Founder & CEO</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  )
}

