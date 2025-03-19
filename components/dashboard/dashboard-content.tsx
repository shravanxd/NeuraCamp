"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Award,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Clock,
  Database,
  Flame,
  LineChart,
  MessageSquare,
  Play,
  Plus,
  Rocket,
  Star,
  Trophy,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StreakReminder } from "./streak-reminder"
import type { User } from "@/lib/auth"
import coursesData from "@/data/courses.json"

interface DashboardContentProps {
  user: User | null
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const [streakDays, setStreakDays] = useState(7)

  // Get user's enrolled courses
  const enrolledCourses = user?.enrolledCourses
    ? user.enrolledCourses.map((enrolledCourse) => {
        const courseDetails = coursesData.find((course) => course.id === enrolledCourse.courseId)
        return {
          ...enrolledCourse,
          details: courseDetails,
        }
      })
    : []

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-6">
        {/* Welcome Section with CTA */}
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Welcome back, {user?.name || "Student"}!</h1>
            <p className="text-muted-foreground">Continue your learning journey where you left off.</p>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2" asChild>
              <Link href={enrolledCourses.length > 0 ? `/courses/${enrolledCourses[0].courseId}` : "/courses"}>
                <Play className="h-4 w-4" />
                Resume Learning
              </Link>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/courses">
                <Plus className="h-4 w-4" />
                Explore Courses
              </Link>
            </Button>
          </div>
        </section>

        {/* Streak Reminder */}
        <StreakReminder days={streakDays} />

        {/* Current Progress Section */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="col-span-full md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Current Course</CardTitle>
                <CardDescription>Continue where you left off</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link href="/my-courses">
                  View All Courses <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {enrolledCourses.length > 0 ? (
                  <>
                    <div className="flex flex-col gap-2 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{enrolledCourses[0].details?.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{enrolledCourses[0].details?.duration} total</span>
                              <span>•</span>
                              <span>{enrolledCourses[0].details?.level}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/courses/${enrolledCourses[0].courseId}`}>Continue</Link>
                        </Button>
                      </div>
                      <div className="mt-2">
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{enrolledCourses[0].progress}%</span>
                        </div>
                        <Progress value={enrolledCourses[0].progress} className="h-2" />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {enrolledCourses.slice(1, 3).map((course) => (
                        <div key={course.courseId} className="flex flex-col gap-2 rounded-lg border p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                              <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{course.details?.title}</h3>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <span>Progress</span>
                                  <span className="font-medium">{course.progress}%</span>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/courses/${course.courseId}`}>Resume</Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
                    <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-medium">No courses enrolled yet</h3>
                    <p className="mb-4 text-center text-sm text-muted-foreground">
                      Explore our catalog and enroll in courses to start your learning journey.
                    </p>
                    <Button asChild>
                      <Link href="/courses">Browse Courses</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:row-span-2">
            <CardHeader>
              <CardTitle>Practice Arena</CardTitle>
              <CardDescription>Daily coding challenges</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-500/10">
                    <Flame className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Daily Streak</h3>
                    <p className="text-sm text-muted-foreground">{streakDays} days</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setStreakDays(streakDays + 1)}>
                  Practice
                </Button>
              </div>

              <div className="rounded-lg border">
                <div className="p-4">
                  <h3 className="font-semibold">Today's Challenge</h3>
                  <p className="text-sm text-muted-foreground">Implement a function to find the k-nearest neighbors</p>
                </div>
                <Separator />
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Difficulty</span>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                      Medium
                    </Badge>
                  </div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Category</span>
                    <span className="text-sm">Machine Learning</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Time Limit</span>
                    <span className="text-sm">30 minutes</span>
                  </div>
                </div>
                <Separator />
                <div className="p-4">
                  <Button className="w-full">Start Challenge</Button>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Leaderboard</h3>
                <div className="space-y-2">
                  {[
                    { name: "Alex Kim", points: 1250, rank: 1 },
                    { name: "Maria Garcia", points: 1120, rank: 2 },
                    { name: user?.name || "You", points: 980, rank: 3, isUser: true },
                  ].map((leaderboardUser, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between rounded-md p-2 ${
                        leaderboardUser.isUser ? "bg-primary/10" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{leaderboardUser.rank}</span>
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`/placeholder.svg?height=24&width=24`} />
                          <AvatarFallback>{leaderboardUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{leaderboardUser.name}</span>
                      </div>
                      <span className="text-sm font-medium">{leaderboardUser.points}</span>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="mt-2 w-full">
                  View Full Leaderboard
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full md:col-span-2">
            <CardHeader>
              <CardTitle>Learning Tracks</CardTitle>
              <CardDescription>Structured paths to master skills</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="ml-engineer">
                <TabsList className="mb-4">
                  <TabsTrigger value="ml-engineer">ML Engineer</TabsTrigger>
                  <TabsTrigger value="data-scientist">Data Scientist</TabsTrigger>
                  <TabsTrigger value="data-engineer">Data Engineer</TabsTrigger>
                </TabsList>
                <TabsContent value="ml-engineer" className="space-y-4">
                  <div className="rounded-lg border">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                          <Rocket className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Machine Learning Engineer</h3>
                          <p className="text-sm text-muted-foreground">8 courses • Estimated 6 months</p>
                        </div>
                      </div>
                      <Button>Enroll</Button>
                    </div>
                    <Separator />
                    <div className="p-4">
                      <h4 className="mb-2 font-medium">Track Progress</h4>
                      <div className="space-y-3">
                        {[
                          { name: "Python Programming", completed: true },
                          { name: "Mathematics for ML", completed: true },
                          { name: "ML Fundamentals", completed: false, current: true },
                          { name: "Deep Learning", completed: false },
                          { name: "ML in Production", completed: false },
                        ].map((course, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-3 rounded-md p-2 ${
                              course.current ? "bg-primary/10" : ""
                            }`}
                          >
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                                course.completed
                                  ? "border-green-500 bg-green-500 text-white"
                                  : "border-muted-foreground"
                              }`}
                            >
                              {course.completed ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-3 w-3"
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              ) : (
                                <span className="text-xs">{i + 1}</span>
                              )}
                            </div>
                            <span
                              className={`text-sm ${
                                course.completed ? "text-muted-foreground line-through" : ""
                              } ${course.current ? "font-medium" : ""}`}
                            >
                              {course.name}
                            </span>
                            {course.current && (
                              <Badge variant="outline" className="ml-auto">
                                Current
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="data-scientist" className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                        <LineChart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Data Scientist</h3>
                        <p className="text-sm text-muted-foreground">7 courses • Estimated 5 months</p>
                      </div>
                    </div>
                    <Button className="mt-4 w-full">View Track</Button>
                  </div>
                </TabsContent>
                <TabsContent value="data-engineer" className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                        <Database className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Data Engineer</h3>
                        <p className="text-sm text-muted-foreground">6 courses • Estimated 4 months</p>
                      </div>
                    </div>
                    <Button className="mt-4 w-full">View Track</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Competitions and Recommendations */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Competitions Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Competitions</CardTitle>
                <CardDescription>Participate and win prizes</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "NLP Challenge: Text Classification",
                    deadline: "3 days left",
                    participants: 245,
                    prize: "$1,000",
                  },
                  {
                    title: "Computer Vision: Object Detection",
                    deadline: "1 week left",
                    participants: 189,
                    prize: "$750",
                  },
                ].map((competition, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">{competition.title}</h3>
                      <Badge variant="outline" className="bg-red-500/10 text-red-500">
                        {competition.deadline}
                      </Badge>
                    </div>
                    <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{competition.participants} participants</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        <span>{competition.prize}</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
                      Join Competition
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Based on your interests</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    <SelectItem value="ml">Machine Learning</SelectItem>
                    <SelectItem value="dl">Deep Learning</SelectItem>
                    <SelectItem value="ds">Data Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Natural Language Processing",
                    level: "Intermediate",
                    duration: "4 weeks",
                    rating: 4.8,
                    students: 1245,
                  },
                  {
                    title: "Computer Vision with PyTorch",
                    level: "Advanced",
                    duration: "6 weeks",
                    rating: 4.9,
                    students: 987,
                  },
                  {
                    title: "Reinforcement Learning",
                    level: "Advanced",
                    duration: "8 weeks",
                    rating: 4.7,
                    students: 756,
                  },
                ].map((course, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <h3 className="font-semibold">{course.title}</h3>
                    <div className="mb-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          {course.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>
                          {course.rating} ({course.students})
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      View Course
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Track your learning milestones</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {[
                {
                  name: "First Course",
                  icon: <BookOpen className="h-6 w-6" />,
                  unlocked: enrolledCourses.length > 0,
                },
                {
                  name: "7-Day Streak",
                  icon: <Flame className="h-6 w-6" />,
                  unlocked: streakDays >= 7,
                },
                {
                  name: "Quiz Master",
                  icon: <Award className="h-6 w-6" />,
                  unlocked: false,
                },
                {
                  name: "Community Helper",
                  icon: <MessageSquare className="h-6 w-6" />,
                  unlocked: false,
                },
                {
                  name: "Competition Winner",
                  icon: <Trophy className="h-6 w-6" />,
                  unlocked: false,
                },
                {
                  name: "Track Completer",
                  icon: <CheckCircle className="h-6 w-6" />,
                  unlocked: false,
                },
              ].map((achievement, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center justify-center rounded-lg border p-4 text-center ${
                    !achievement.unlocked ? "opacity-50" : ""
                  }`}
                >
                  <div
                    className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full ${
                      achievement.unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <span className="text-sm font-medium">{achievement.name}</span>
                  <span className="text-xs text-muted-foreground">{achievement.unlocked ? "Unlocked" : "Locked"}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

