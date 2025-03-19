"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, MapPin, TrendingUp, Users } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Startup {
  id: string
  name: string
  description: string
  fundingGoal: number
  equityOffered: number
  industry: string
  stage: string
  location: string
  logo: string
  tags: string[]
  traction: string
}

interface StartupsListProps {
  searchQuery: string
}

export default function StartupsList({ searchQuery }: StartupsListProps) {
  const [startups, setStartups] = useState<Startup[]>([])
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([])
  const router = useRouter()

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchStartups = async () => {
      try {
        // Simulating API call by importing JSON
        const response = await import("@/data/startups.json")
        setStartups(response.default)
      } catch (error) {
        console.error("Error fetching startups:", error)
      }
    }

    fetchStartups()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStartups(startups)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = startups.filter(
        (startup) =>
          startup.name.toLowerCase().includes(query) ||
          startup.description.toLowerCase().includes(query) ||
          startup.industry.toLowerCase().includes(query) ||
          startup.location.toLowerCase().includes(query) ||
          startup.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
      setFilteredStartups(filtered)
    }
  }, [searchQuery, startups])

  const handleViewDetails = (startupId: string) => {
    router.push(`/startup-connect/startup/${startupId}`)
  }

  if (startups.length === 0) {
    return <div className="text-center py-10">Loading startups...</div>
  }

  if (filteredStartups.length === 0) {
    return <div className="text-center py-10">No startups found matching your search criteria.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredStartups.map((startup) => (
        <Card key={startup.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
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
                  <CardDescription className="flex items-center text-xs">
                    <MapPin className="mr-1 h-3 w-3" />
                    {startup.location}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline">{startup.stage}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{startup.description}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <Briefcase className="mr-1 h-3 w-3" />
                <span>{startup.industry}</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-1 h-3 w-3" />
                <span>{startup.equityOffered}% equity</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span>{formatCurrency(startup.fundingGoal)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {startup.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {startup.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{startup.tags.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button variant="default" className="w-full" onClick={() => handleViewDetails(startup.id)}>
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

