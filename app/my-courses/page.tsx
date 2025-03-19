"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Star } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { auth, type User } from "@/lib/auth"
import coursesData from "@/data/courses.json"

export default function MyCoursesPage() {
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

  // Get enrolled courses data
  const enrolledCoursesData =
    user?.enrolledCourses.map((enrolledCourse) => {
      const courseDetails = coursesData.find((course) => course.id === enrolledCourse.courseId)
      return {
        ...enrolledCourse,
        details: courseDetails,
      }
    }) || []

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
                <h1 className="text-2xl font-bold">My Courses</h1>
                <p className="text-muted-foreground">Continue learning where you left off</p>
              </div>

              {enrolledCoursesData.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
                  <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">No courses enrolled yet</h3>
                  <p className="mb-4 text-center text-sm text-muted-foreground">
                    Explore our catalog and enroll in courses to start your learning journey.
                  </p>
                  <Button asChild>
                    <Link href="/courses">Browse Courses</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {enrolledCoursesData.map((course) => (
                    <Link href={`/courses/${course.courseId}`} key={course.courseId}>
                      <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={course.details?.thumbnail || "/placeholder.svg"}
                            alt={course.details?.title}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <CardContent className="p-6">
                          <div className="mb-3 flex items-center gap-2">
                            <Badge className="bg-primary/10 text-primary">{course.details?.category}</Badge>
                            <Badge variant="outline">{course.details?.level}</Badge>
                          </div>
                          <h3 className="mb-2 text-xl font-bold">{course.details?.title}</h3>

                          <div className="mb-4 flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={course.details?.instructorAvatar} alt={course.details?.instructor} />
                              <AvatarFallback>{course.details?.instructor?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{course.details?.instructor}</p>
                              <p className="text-xs text-muted-foreground">{course.details?.instructorRole}</p>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span>Progress</span>
                              <span className="font-medium">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>Last accessed: {new Date(course.lastAccessedDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              <span>{course.details?.rating}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

