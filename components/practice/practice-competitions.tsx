"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Calendar, Clock, Users } from "lucide-react"
import Link from "next/link"

type Competition = {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: string
  questions: string[]
  participants: {
    userId: string
    score: number
    rank: number
    completedQuestions: string[]
  }[]
  prizes: {
    rank: number
    description: string
  }[]
}

export function PracticeCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    // Fetch competitions
    fetch("/api/practice/competitions")
      .then((res) => res.json())
      .then((data) => {
        setCompetitions(data)
      })
      .catch((err) => console.error("Error fetching competitions:", err))
  }, [])

  // For demo purposes, we'll use hardcoded data if the fetch fails
  useEffect(() => {
    if (competitions.length === 0) {
      const demoCompetitions = [
        {
          id: "comp1",
          title: "Weekly Coding Challenge #42",
          description:
            "Solve three algorithmic problems in 90 minutes. Points are awarded based on correctness and efficiency.",
          startDate: "2023-07-01T18:00:00Z",
          endDate: "2023-07-01T19:30:00Z",
          status: "completed",
          questions: ["q1", "q4", "q5"],
          participants: [
            {
              userId: "user1",
              score: 200,
              rank: 2,
              completedQuestions: ["q1", "q4"],
            },
            {
              userId: "user2",
              score: 300,
              rank: 1,
              completedQuestions: ["q1", "q4", "q5"],
            },
          ],
          prizes: [
            {
              rank: 1,
              description: "500 NeuraCoin + Premium Badge",
            },
            {
              rank: 2,
              description: "300 NeuraCoin",
            },
            {
              rank: 3,
              description: "100 NeuraCoin",
            },
          ],
        },
        {
          id: "comp2",
          title: "AI Algorithm Challenge",
          description:
            "Implement machine learning algorithms to solve real-world problems. Judged on accuracy and innovation.",
          startDate: "2023-07-15T14:00:00Z",
          endDate: "2023-07-16T14:00:00Z",
          status: "upcoming",
          questions: [],
          participants: [],
          prizes: [
            {
              rank: 1,
              description: "1000 NeuraCoin + AI Specialist Certificate",
            },
            {
              rank: 2,
              description: "600 NeuraCoin",
            },
            {
              rank: 3,
              description: "300 NeuraCoin",
            },
          ],
        },
        {
          id: "comp3",
          title: "Hackathon: EdTech Solutions",
          description:
            "Build innovative educational technology solutions in 48 hours. Teams of up to 3 people allowed.",
          startDate: "2023-08-05T09:00:00Z",
          endDate: "2023-08-07T09:00:00Z",
          status: "upcoming",
          questions: [],
          participants: [],
          prizes: [
            {
              rank: 1,
              description: "5000 NeuraCoin + Mentorship with Industry Leaders",
            },
            {
              rank: 2,
              description: "2500 NeuraCoin",
            },
            {
              rank: 3,
              description: "1000 NeuraCoin",
            },
          ],
        },
      ]
      setCompetitions(demoCompetitions)
    }
  }, [competitions])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeRemaining = (dateString: string) => {
    const now = new Date()
    const target = new Date(dateString)
    const diff = target.getTime() - now.getTime()

    if (diff <= 0) return "Started"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h remaining`
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Upcoming</Badge>
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const upcomingCompetitions = competitions.filter((comp) => comp.status === "upcoming")
  const activeCompetitions = competitions.filter((comp) => comp.status === "active")
  const completedCompetitions = competitions.filter((comp) => comp.status === "completed")

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingCompetitions.map((competition) => (
              <Card key={competition.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>{competition.title}</CardTitle>
                  <CardDescription>{competition.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Starts: {formatDate(competition.startDate)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{getTimeRemaining(competition.startDate)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Participants: {competition.participants.length}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>Top Prize: {competition.prizes[0]?.description}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 pt-2">
                  <Button asChild className="w-full">
                    <Link href={`/practice/competition/${competition.id}`}>Register Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {upcomingCompetitions.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <h3 className="text-lg font-medium">No upcoming competitions</h3>
                <p className="text-muted-foreground">Check back later for new competitions</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCompetitions.map((competition) => (
              <Card key={competition.id} className="overflow-hidden border-green-200">
                <CardHeader className="pb-2 bg-green-50 dark:bg-green-900/20">
                  <div className="flex justify-between items-start">
                    <CardTitle>{competition.title}</CardTitle>
                    {getStatusBadge(competition.status)}
                  </div>
                  <CardDescription>{competition.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Ends: {formatDate(competition.endDate)}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Participants: {competition.participants.length}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 pt-2">
                  <Button asChild className="w-full" variant="default">
                    <Link href={`/practice/competition/${competition.id}`}>Enter Competition</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {activeCompetitions.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <h3 className="text-lg font-medium">No active competitions</h3>
                <p className="text-muted-foreground">Check the upcoming tab for future competitions</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedCompetitions.map((competition) => (
              <Card key={competition.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{competition.title}</CardTitle>
                    {getStatusBadge(competition.status)}
                  </div>
                  <CardDescription>{competition.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Ended: {formatDate(competition.endDate)}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Participants: {competition.participants.length}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Top Performers</h4>
                      <div className="space-y-2">
                        {competition.participants
                          .sort((a, b) => a.rank - b.rank)
                          .slice(0, 3)
                          .map((participant, index) => (
                            <div key={participant.userId} className="flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                <Badge variant="outline" className="mr-2 w-6 h-6 flex items-center justify-center p-0">
                                  {participant.rank}
                                </Badge>
                                <span>User {participant.userId}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="font-medium">{participant.score} pts</span>
                                {index === 0 && <Trophy className="h-4 w-4 ml-1 text-yellow-500" />}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 pt-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/practice/competition/${competition.id}`}>View Results</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {completedCompetitions.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <h3 className="text-lg font-medium">No completed competitions</h3>
                <p className="text-muted-foreground">Check back after competitions have ended</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

