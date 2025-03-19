"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, XCircle, MessageSquare } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser } from "@/lib/auth"

interface Connection {
  id: string
  startupId: string
  investorId: string
  status: string
  message: string
  createdAt: string
  updatedAt: string
}

interface Startup {
  id: string
  name: string
  description: string
  logo: string
}

interface Investor {
  id: string
  name: string
  type: string
  logo: string
}

export default function MyConnections() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [startups, setStartups] = useState<Record<string, Startup>>({})
  const [investors, setInvestors] = useState<Record<string, Investor>>({})
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // Get current user
        const currentUser = getCurrentUser()

        if (!currentUser) {
          setConnections([])
          setIsLoading(false)
          return
        }

        // Fetch all connections
        const connectionsResponse = await import("@/data/startup-connections.json")
        const allConnections = connectionsResponse.default

        // Fetch all startups
        const startupsResponse = await import("@/data/startups.json")
        const allStartups = startupsResponse.default

        // Fetch all investors
        const investorsResponse = await import("@/data/investors.json")
        const allInvestors = investorsResponse.default

        // Create lookup maps
        const startupsMap: Record<string, Startup> = {}
        allStartups.forEach((startup: Startup) => {
          startupsMap[startup.id] = startup
        })

        const investorsMap: Record<string, Investor> = {}
        allInvestors.forEach((investor: Investor) => {
          investorsMap[investor.id] = investor
        })

        // Filter connections by current user's startups
        const userStartups = allStartups.filter((startup: Startup) => startup.founder === currentUser.id)

        const userStartupIds = userStartups.map((startup: Startup) => startup.id)

        const userConnections = allConnections.filter((connection: Connection) =>
          userStartupIds.includes(connection.startupId),
        )

        setConnections(userConnections)
        setStartups(startupsMap)
        setInvestors(investorsMap)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching connections:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
      case "connected":
        return (
          <Badge variant="success" className="flex items-center">
            <CheckCircle className="mr-1 h-3 w-3" /> Connected
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center">
            <XCircle className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleViewStartup = (startupId: string) => {
    router.push(`/startup-connect/startup/${startupId}`)
  }

  const handleViewInvestor = (investorId: string) => {
    router.push(`/startup-connect/investor/${investorId}`)
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading your connections...</div>
  }

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <p className="text-muted-foreground">You don't have any connections yet.</p>
        <Button onClick={() => router.push("/startup-connect?tab=investors")}>Browse Investors</Button>
      </div>
    )
  }

  const pendingConnections = connections.filter((c) => c.status === "pending")
  const connectedConnections = connections.filter((c) => c.status === "connected")
  const rejectedConnections = connections.filter((c) => c.status === "rejected")

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({connections.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingConnections.length})</TabsTrigger>
          <TabsTrigger value="connected">Connected ({connectedConnections.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedConnections.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ConnectionsList
            connections={connections}
            startups={startups}
            investors={investors}
            getStatusBadge={getStatusBadge}
            onViewStartup={handleViewStartup}
            onViewInvestor={handleViewInvestor}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <ConnectionsList
            connections={pendingConnections}
            startups={startups}
            investors={investors}
            getStatusBadge={getStatusBadge}
            onViewStartup={handleViewStartup}
            onViewInvestor={handleViewInvestor}
          />
        </TabsContent>

        <TabsContent value="connected" className="space-y-4">
          <ConnectionsList
            connections={connectedConnections}
            startups={startups}
            investors={investors}
            getStatusBadge={getStatusBadge}
            onViewStartup={handleViewStartup}
            onViewInvestor={handleViewInvestor}
          />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <ConnectionsList
            connections={rejectedConnections}
            startups={startups}
            investors={investors}
            getStatusBadge={getStatusBadge}
            onViewStartup={handleViewStartup}
            onViewInvestor={handleViewInvestor}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ConnectionsListProps {
  connections: any[]
  startups: Record<string, any>
  investors: Record<string, any>
  getStatusBadge: (status: string) => JSX.Element
  onViewStartup: (id: string) => void
  onViewInvestor: (id: string) => void
}

function ConnectionsList({
  connections,
  startups,
  investors,
  getStatusBadge,
  onViewStartup,
  onViewInvestor,
}: ConnectionsListProps) {
  if (connections.length === 0) {
    return <div className="text-center py-6">No connections in this category.</div>
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {connections.map((connection) => {
        const startup = startups[connection.startupId]
        const investor = investors[connection.investorId]

        if (!startup || !investor) return null

        return (
          <Card key={connection.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-background z-10">
                      <Image
                        src={startup.logo || "/placeholder.svg"}
                        alt={startup.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-background">
                      <Image
                        src={investor.logo || "/placeholder.svg"}
                        alt={investor.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {startup.name} → {investor.name}
                    </CardTitle>
                    <CardDescription>{new Date(connection.createdAt).toLocaleDateString()}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(connection.status)}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="bg-muted p-3 rounded-md text-sm">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p>{connection.message}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={() => onViewStartup(startup.id)}>
                View Startup
              </Button>
              <Button variant="default" size="sm" onClick={() => onViewInvestor(investor.id)}>
                View Investor
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

