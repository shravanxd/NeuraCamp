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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Building, Calendar, Globe, MapPin, Wallet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"

interface InvestorDetailContentProps {
  investorId: string
}

export default function InvestorDetailContent({ investorId }: InvestorDetailContentProps) {
  const [investor, setInvestor] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStartup, setSelectedStartup] = useState<string>("")
  const [myStartups, setMyStartups] = useState<any[]>([])
  const [connectionMessage, setConnectionMessage] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch investor data
        const investorsResponse = await import("@/data/investors.json")
        const investorData = investorsResponse.default.find((i: any) => i.id === investorId)

        if (!investorData) {
          router.push("/startup-connect")
          return
        }

        setInvestor(investorData)

        // Fetch user's startups
        const currentUser = getCurrentUser()
        if (currentUser) {
          const startupsResponse = await import("@/data/startups.json")
          const userStartups = startupsResponse.default.filter((startup: any) => startup.founder === currentUser.id)
          setMyStartups(userStartups)

          if (userStartups.length > 0) {
            setSelectedStartup(userStartups[0].id)
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching investor:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [investorId, router])

  const handleConnect = async () => {
    // In a real app, this would be an API call
    toast({
      title: "Connection request sent",
      description: "Your connection request has been sent to the investor.",
    })
    setIsDialogOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading investor details...</p>
      </div>
    )
  }

  if (!investor) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Investor not found</p>
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
            <h1 className="text-xl font-semibold">Investor Details</h1>
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
                          src={investor.logo || "/placeholder.svg"}
                          alt={investor.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{investor.name}</CardTitle>
                        <CardDescription className="flex items-center text-sm">
                          <Building className="mr-1 h-4 w-4" />
                          {investor.type}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">{investor.location}</Badge>
                      {investor.investmentStages.map((stage: string) => (
                        <Badge key={stage} variant="outline">
                          {stage}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-muted-foreground mb-4">{investor.description}</p>

                    <h3 className="text-lg font-semibold mb-2">Bio</h3>
                    <p className="text-muted-foreground mb-4">{investor.bio}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Investment Range</p>
                          <p className="text-muted-foreground">
                            ${investor.investmentRange.min.toLocaleString()} - $
                            {investor.investmentRange.max.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Portfolio Companies</p>
                          <p className="text-muted-foreground">{investor.portfolio}</p>
                        </div>
                      </div>
                      {investor.foundedYear && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Founded</p>
                            <p className="text-muted-foreground">{investor.foundedYear}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-muted-foreground">{investor.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Website</p>
                          <a
                            href={investor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {investor.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-3">Investment Interests</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {investor.interests.map((interest: string) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>

                    {investor.notableInvestments && investor.notableInvestments.length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold mb-3">Notable Investments</h3>
                        <ul className="list-disc pl-5 text-muted-foreground">
                          {investor.notableInvestments.map((investment: string) => (
                            <li key={investment}>{investment}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="w-full md:w-1/3 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {investor.contactPerson && (
                        <div>
                          <p className="text-sm font-medium">Contact Person</p>
                          <p className="text-muted-foreground">{investor.contactPerson}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-muted-foreground">{investor.contactEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        <a
                          href={investor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {investor.website}
                        </a>
                      </div>
                      <Separator />
                      {myStartups.length > 0 ? (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="w-full">Connect with Investor</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Connect with {investor.name}</DialogTitle>
                              <DialogDescription>
                                Send a connection request to this investor for one of your startups.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Select your startup</p>
                                <Select value={selectedStartup} onValueChange={setSelectedStartup}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a startup" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {myStartups.map((startup) => (
                                      <SelectItem key={startup.id} value={startup.id}>
                                        {startup.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Your message</p>
                                <Textarea
                                  placeholder="Explain why you're interested in connecting with this investor..."
                                  value={connectionMessage}
                                  onChange={(e) => setConnectionMessage(e.target.value)}
                                  className="min-h-[120px]"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleConnect} disabled={!selectedStartup || !connectionMessage.trim()}>
                                Send Request
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Button className="w-full" onClick={() => router.push("/startup-connect/create")}>
                          Create a Startup to Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Investment Criteria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Investment Range</p>
                        <p className="text-lg font-bold">
                          ${investor.investmentRange.min.toLocaleString()} - $
                          {investor.investmentRange.max.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Investment Stages</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {investor.investmentStages.map((stage: string) => (
                            <Badge key={stage} variant="outline">
                              {stage}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Interests</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {investor.interests.map((interest: string) => (
                            <Badge key={interest} variant="secondary">
                              {interest}
                            </Badge>
                          ))}
                        </div>
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

