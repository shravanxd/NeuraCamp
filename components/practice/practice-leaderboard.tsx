"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type LeaderboardEntry = {
  userId: string
  username: string
  rank: number
  score: number
  problemsSolved: number
  competitions: number
  badges: string[]
}

export function PracticeLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("rank")

  useEffect(() => {
    // Fetch leaderboard
    fetch("/api/practice/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data)
        setFilteredLeaderboard(data)
      })
      .catch((err) => console.error("Error fetching leaderboard:", err))
  }, [])

  // For demo purposes, we'll use hardcoded data if the fetch fails
  useEffect(() => {
    if (leaderboard.length === 0) {
      const demoLeaderboard = [
        {
          userId: "user2",
          username: "CodeMaster",
          rank: 1,
          score: 1250,
          problemsSolved: 78,
          competitions: 5,
          badges: ["Algorithm Expert", "Contest Winner", "100-Day Streak"],
        },
        {
          userId: "user3",
          username: "AlgoNinja",
          rank: 2,
          score: 1120,
          problemsSolved: 65,
          competitions: 4,
          badges: ["Dynamic Programming Guru", "50-Day Streak"],
        },
        {
          userId: "user4",
          username: "ByteWizard",
          rank: 3,
          score: 980,
          problemsSolved: 59,
          competitions: 3,
          badges: ["Graph Theory Master"],
        },
        {
          userId: "user5",
          username: "DataStructureQueen",
          rank: 4,
          score: 920,
          problemsSolved: 52,
          competitions: 4,
          badges: ["Tree Traversal Expert"],
        },
        {
          userId: "user1",
          username: "NeuraCoder",
          rank: 5,
          score: 850,
          problemsSolved: 48,
          competitions: 3,
          badges: ["Rising Star"],
        },
        {
          userId: "user6",
          username: "LogicLegend",
          rank: 6,
          score: 780,
          problemsSolved: 43,
          competitions: 2,
          badges: ["Consistent Contributor"],
        },
        {
          userId: "user7",
          username: "RecursionRanger",
          rank: 7,
          score: 720,
          problemsSolved: 40,
          competitions: 3,
          badges: ["Backtracking Specialist"],
        },
        {
          userId: "user8",
          username: "SyntaxSage",
          rank: 8,
          score: 680,
          problemsSolved: 38,
          competitions: 2,
          badges: ["Clean Coder"],
        },
        {
          userId: "user9",
          username: "BinaryBaron",
          rank: 9,
          score: 650,
          problemsSolved: 35,
          competitions: 2,
          badges: ["Bit Manipulation Expert"],
        },
        {
          userId: "user10",
          username: "HashMapHero",
          rank: 10,
          score: 620,
          problemsSolved: 33,
          competitions: 1,
          badges: ["Efficient Solutions"],
        },
      ]
      setLeaderboard(demoLeaderboard)
      setFilteredLeaderboard(demoLeaderboard)
    }
  }, [leaderboard])

  useEffect(() => {
    // Apply search filter
    let result = leaderboard

    if (searchQuery) {
      result = result.filter((entry) => entry.username.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "rank":
          return a.rank - b.rank
        case "score":
          return b.score - a.score
        case "problems":
          return b.problemsSolved - a.problemsSolved
        case "competitions":
          return b.competitions - a.competitions
        default:
          return a.rank - b.rank
      }
    })

    setFilteredLeaderboard(result)
  }, [searchQuery, sortBy, leaderboard])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />
      default:
        return <span className="text-sm font-medium">{rank}</span>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global Leaderboard</CardTitle>
          <CardDescription>Top performers in coding challenges and competitions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rank">Rank</SelectItem>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="problems">Problems Solved</SelectItem>
                <SelectItem value="competitions">Competitions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {/* Top 3 users with special styling */}
            {filteredLeaderboard.slice(0, 3).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {filteredLeaderboard.slice(0, 3).map((entry) => (
                  <Card
                    key={entry.userId}
                    className={`
                    ${entry.rank === 1 ? "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10" : ""}
                    ${entry.rank === 2 ? "border-gray-300 bg-gray-50 dark:bg-gray-800/30" : ""}
                    ${entry.rank === 3 ? "border-amber-700/30 bg-amber-50 dark:bg-amber-900/10" : ""}
                  `}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-2">{getRankIcon(entry.rank)}</div>
                        <Avatar className="h-16 w-16 mb-2">
                          <AvatarImage src={`/placeholder.svg?height=64&width=64`} alt={entry.username} />
                          <AvatarFallback>{getInitials(entry.username)}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-lg">{entry.username}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{entry.score} points</p>
                        <div className="flex flex-wrap justify-center gap-1 mt-2">
                          {entry.badges.slice(0, 2).map((badge, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                          {entry.badges.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{entry.badges.length - 2} more
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 w-full mt-4 text-center text-sm">
                          <div className="border rounded-md p-2">
                            <div className="font-medium">{entry.problemsSolved}</div>
                            <div className="text-xs text-muted-foreground">Problems</div>
                          </div>
                          <div className="border rounded-md p-2">
                            <div className="font-medium">{entry.competitions}</div>
                            <div className="text-xs text-muted-foreground">Competitions</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Rest of the leaderboard */}
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b text-sm">
                <div className="col-span-1">Rank</div>
                <div className="col-span-5">User</div>
                <div className="col-span-2 text-right">Score</div>
                <div className="col-span-2 text-right">Problems</div>
                <div className="col-span-2 text-right">Competitions</div>
              </div>

              {filteredLeaderboard.slice(3).map((entry) => (
                <div
                  key={entry.userId}
                  className="grid grid-cols-12 gap-4 p-4 border-b last:border-0 items-center hover:bg-muted/50"
                >
                  <div className="col-span-1 font-medium">{entry.rank}</div>
                  <div className="col-span-5 flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={entry.username} />
                      <AvatarFallback>{getInitials(entry.username)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{entry.username}</div>
                      {entry.badges.length > 0 && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {entry.badges[0]}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 text-right font-medium">{entry.score}</div>
                  <div className="col-span-2 text-right">{entry.problemsSolved}</div>
                  <div className="col-span-2 text-right">{entry.competitions}</div>
                </div>
              ))}

              {filteredLeaderboard.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No users found</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

