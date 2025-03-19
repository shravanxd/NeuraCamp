"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { auth, type User } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, Star } from "lucide-react"

import tracksData from "@/data/tracks.json"
import coursesData from "@/data/courses.json"

export default function TracksPage() {
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

  // Get instructors for each track
  const tracksWithInstructors = tracksData.map((track) => {
    const trackCourses = track.courses
      .map((trackCourse) => coursesData.find((course) => course.id === trackCourse.id))
      .filter(Boolean)

    // Get unique instructors
    const instructors = Array.from(new Set(trackCourses.map((course) => course?.instructor))).map((instructorName) => {
      const course = trackCourses.find((course) => course?.instructor === instructorName)
      return {
        name: instructorName,
        avatar: course?.instructorAvatar || "/placeholder.svg?height=40&width=40",
        role: course?.instructorRole || "",
      }
    })

    return {
      ...track,
      instructors,
    }
  })

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
          <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
            <div className="container mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Learning Tracks</h1>
                <p className="text-muted-foreground">Structured paths to master skills and advance your career</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tracksWithInstructors.map((track) => (
                  <Link href={`/tracks/${track.id}`} key={track.id}>
                    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={track.thumbnail || "/placeholder.svg"}
                          alt={track.title}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-center gap-2">
                          <Badge className="bg-primary/10 text-primary">{track.level}</Badge>
                          <Badge variant="outline">{track.courses.length} Courses</Badge>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">{track.title}</h3>
                        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{track.description}</p>

                        <div className="mb-4 flex -space-x-2 overflow-hidden">
                          {track.instructors.slice(0, 3).map((instructor, i) => (
                            <Avatar key={i} className="h-8 w-8 border-2 border-background">
                              <AvatarImage src={instructor.avatar} alt={instructor.name} />
                              <AvatarFallback>{instructor.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                          {track.instructors.length > 3 && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                              +{track.instructors.length - 3}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{track.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{track.enrolledStudents.toLocaleString()} students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span>
                              {track.rating} ({track.ratingCount})
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

