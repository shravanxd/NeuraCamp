"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, Globe, MapPin, Wallet } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Investor {
  id: string
  name: string
  type: string
  description: string
  investmentRange: {
    min: number
    max: number
  }
  location: string
  website: string
  logo: string
  interests: string[]
  investmentStages: string[]
}

interface InvestorsListProps {
  searchQuery: string
}

export default function InvestorsList({ searchQuery }: InvestorsListProps) {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [filteredInvestors, setFilteredInvestors] = useState<Investor[]>([])
  const router = useRouter()

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchInvestors = async () => {
      try {
        // Simulating API call by importing JSON
        const response = await import("@/data/investors.json")
        setInvestors(response.default)
      } catch (error) {
        console.error("Error fetching investors:", error)
      }
    }

    fetchInvestors()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredInvestors(investors)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = investors.filter(
        (investor) =>
          investor.name.toLowerCase().includes(query) ||
          investor.description.toLowerCase().includes(query) ||
          investor.type.toLowerCase().includes(query) ||
          investor.location.toLowerCase().includes(query) ||
          investor.interests.some((interest) => interest.toLowerCase().includes(query)),
      )
      setFilteredInvestors(filtered)
    }
  }, [searchQuery, investors])

  const handleViewDetails = (investorId: string) => {
    router.push(`/startup-connect/investor/${investorId}`)
  }

  if (investors.length === 0) {
    return <div className="text-center py-10">Loading investors...</div>
  }

  if (filteredInvestors.length === 0) {
    return <div className="text-center py-10">No investors found matching your search criteria.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredInvestors.map((investor) => (
        <Card key={investor.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-md">
                  <Image
                    src={investor.logo || "/placeholder.svg"}
                    alt={investor.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div>
                  <CardTitle className="text-lg">{investor.name}</CardTitle>
                  <CardDescription className="flex items-center text-xs">
                    <Building className="mr-1 h-3 w-3" />
                    {investor.type}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{investor.description}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                <span>{investor.location}</span>
              </div>
              <div className="flex items-center">
                <Wallet className="mr-1 h-3 w-3" />
                <span>
                  {formatCurrency(investor.investmentRange.min)} - {formatCurrency(investor.investmentRange.max)}
                </span>
              </div>
              <div className="flex items-center col-span-2">
                <Globe className="mr-1 h-3 w-3" />
                <a
                  href={investor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                >
                  {investor.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-medium mb-1">Investment Stages:</p>
              <div className="flex flex-wrap gap-1">
                {investor.investmentStages.map((stage) => (
                  <Badge key={stage} variant="outline" className="text-xs">
                    {stage}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs font-medium mb-1">Interests:</p>
              <div className="flex flex-wrap gap-1">
                {investor.interests.slice(0, 3).map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {investor.interests.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{investor.interests.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button variant="default" className="w-full" onClick={() => handleViewDetails(investor.id)}>
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

