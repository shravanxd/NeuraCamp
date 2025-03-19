"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Clock, Download, Globe, Linkedin, Share2, Star, Twitter, Users } from "lucide-react"
import { auth, type User, type EnrolledCourse } from "@/lib/auth"

interface CourseHeaderProps {
  course: any
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = auth.getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      // Get enrolled course details
      const enrolledCourseDetails = currentUser.enrolledCourses.find((c) => c.courseId === course.id)

      if (enrolledCourseDetails) {
        setEnrolledCourse(enrolledCourseDetails)
      }
    }
  }, [course.id])

  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                {course.category}
              </Badge>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
                {course.level}
              </Badge>
            </div>
            <h1 className="mt-2 text-2xl font-bold md:text-3xl">{course.title}</h1>
            <p className="mt-2 text-muted-foreground">{course.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.enrolledStudents} students enrolled</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>
                  {course.rating} ({course.ratingCount} ratings)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration} total</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {course.lastUpdated}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>{course.language}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium">{course.instructor}</p>
                <p className="text-sm text-muted-foreground">{course.instructorRole}</p>
              </div>
              <Avatar className="h-12 w-12">
                <AvatarImage src={course.instructorAvatar} alt={course.instructor} />
                <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Website</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-medium">Your Progress</span>
            </div>
            <span className="text-sm font-medium">{enrolledCourse?.progress || 0}% Complete</span>
          </div>
          <Progress value={enrolledCourse?.progress || 0} className="mt-2 h-2" />
        </div>
      </div>
    </div>
  )
}

