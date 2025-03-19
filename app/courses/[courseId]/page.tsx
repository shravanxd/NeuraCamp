"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { CourseHeader } from "@/components/course/course-header"
import { CourseContent } from "@/components/course/course-content"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CourseSidebar } from "@/components/course/course-sidebar"
import { auth, type User } from "@/lib/auth"
import coursesData from "@/data/courses.json"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Star, Users, Calendar, Globe, CheckCircle, BookOpen } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  // Get course details
  const courseDetails = coursesData.find((course) => course.id === courseId)

  // Check if user is enrolled
  const isEnrolled = user ? auth.isEnrolledInCourse(courseId) : false

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = auth.getCurrentUser()
    setUser(currentUser)
    setLoading(false)

    // If course doesn't exist, redirect to courses page
    if (!courseDetails) {
      router.push("/courses")
    }
  }, [courseDetails, router])

  const handleEnroll = () => {
    if (!user) {
      // Redirect to sign in page if not authenticated
      router.push("/auth/signin")
      return
    }

    setEnrolling(true)

    // Enroll in course
    const updatedUser = auth.enrollInCourse(courseId)
    setUser(updatedUser)
    setEnrolling(false)

    // Refresh the page to show enrolled view
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!courseDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <p className="text-muted-foreground">The course you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => router.push("/courses")}>
            Browse Courses
          </Button>
        </div>
      </div>
    )
  }

  // If user is enrolled, show the course content
  if (isEnrolled) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen flex-col">
          <DashboardHeader user={user} />
          <div className="flex flex-1">
            <CourseSidebar courseId={courseId} />
            <main className="flex-1 overflow-y-auto bg-muted/20">
              <CourseHeader course={courseDetails} />
              <CourseContent />
            </main>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  // If user is not enrolled, show course details and enrollment option
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader user={user} />
        <div className="flex flex-1">
          <main className="flex-1 overflow-y-auto bg-muted/20">
            {/* Course Hero Section */}
            <div className="border-b bg-background">
              <div className="container mx-auto px-4 py-6 md:px-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                        {courseDetails.category}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
                        {courseDetails.level}
                      </Badge>
                    </div>
                    <h1 className="mt-2 text-2xl font-bold md:text-3xl">{courseDetails.title}</h1>
                    <p className="mt-2 text-muted-foreground">{courseDetails.description}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{courseDetails.enrolledStudents} students enrolled</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>
                          {courseDetails.rating} ({courseDetails.ratingCount} ratings)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{courseDetails.duration} total</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Last updated: {courseDetails.lastUpdated}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <span>{courseDetails.language}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-80">
                    <Card>
                      <CardContent className="p-6">
                        <div className="aspect-video w-full overflow-hidden rounded-md mb-4">
                          <img
                            src={courseDetails.thumbnail || "/placeholder.svg"}
                            alt={courseDetails.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="mb-4">
                          <p className="text-3xl font-bold">${courseDetails.price}</p>
                        </div>

                        <Button className="w-full mb-4" onClick={handleEnroll} disabled={enrolling}>
                          {enrolling ? "Enrolling..." : "Enroll Now"}
                        </Button>

                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>Full lifetime access</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>Access on mobile and desktop</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>Certificate of completion</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="container mx-auto px-4 py-8 md:px-6">
              <Tabs defaultValue="overview">
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">What You'll Learn</h2>
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        "Master advanced machine learning algorithms",
                        "Build and deploy machine learning models",
                        "Understand the mathematics behind ML algorithms",
                        "Work with real-world datasets",
                        "Implement neural networks from scratch",
                        "Use popular ML frameworks and libraries",
                        "Apply ML to solve business problems",
                        "Optimize model performance",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 mt-0.5 text-green-500 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h2 className="text-xl font-bold mb-4">Course Description</h2>
                    <div className="space-y-4">
                      <p>
                        This comprehensive course will take you from the fundamentals of machine learning to advanced
                        techniques used in industry. Whether you're a beginner looking to break into the field or an
                        experienced practitioner wanting to deepen your knowledge, this course has something for you.
                      </p>
                      <p>
                        You'll learn through a combination of theory and hands-on practice, working with real-world
                        datasets and implementing algorithms from scratch. By the end of the course, you'll have a
                        portfolio of projects to showcase your skills.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h2 className="text-xl font-bold mb-4">Requirements</h2>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Basic programming knowledge in Python</li>
                      <li>Familiarity with basic mathematics (algebra, calculus)</li>
                      <li>A computer with internet access</li>
                      <li>Enthusiasm to learn and practice</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="curriculum">
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold">Course Curriculum</h2>
                    <p className="text-muted-foreground">
                      This course includes {courseDetails.modules?.length || 0} modules with over{" "}
                      {courseDetails.duration} of content.
                    </p>

                    <div className="space-y-4">
                      {courseDetails.modules?.map((module, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <div className="bg-muted/30 p-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">
                                Module {index + 1}: {module.title}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{module.lessons.length} lessons</span>
                                <span>•</span>
                                <span>{module.duration}</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <ul className="space-y-3">
                              {module.lessons.slice(0, 3).map((lesson, lessonIndex) => (
                                <li key={lessonIndex} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {lesson.type === "video" ? (
                                      <BookOpen className="h-4 w-4 text-blue-500" />
                                    ) : lesson.type === "quiz" ? (
                                      <BookOpen className="h-4 w-4 text-orange-500" />
                                    ) : (
                                      <BookOpen className="h-4 w-4 text-purple-500" />
                                    )}
                                    <span className="text-sm">{lesson.title}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                                </li>
                              ))}
                              {module.lessons.length > 3 && (
                                <li className="text-sm text-muted-foreground">
                                  + {module.lessons.length - 3} more lessons
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="instructor">
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold">About the Instructor</h2>

                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/4">
                        <Avatar className="h-32 w-32">
                          <AvatarImage src={courseDetails.instructorAvatar} alt={courseDetails.instructor} />
                          <AvatarFallback>{courseDetails.instructor.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="md:w-3/4">
                        <h3 className="text-lg font-medium mb-2">{courseDetails.instructor}</h3>
                        <p className="text-muted-foreground mb-4">{courseDetails.instructorRole}</p>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>4.8 Instructor Rating</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>20,000+ Students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>5 Courses</span>
                          </div>
                        </div>

                        <p className="mb-4">
                          Dr. Sarah Johnson is a leading expert in machine learning and artificial intelligence with
                          over 10 years of experience in both academia and industry. She holds a Ph.D. in Computer
                          Science from Stanford University and has published numerous research papers in top-tier
                          conferences.
                        </p>

                        <p>
                          Her teaching approach combines theoretical foundations with practical applications, ensuring
                          students not only understand the concepts but can also apply them to real-world problems. Dr.
                          Johnson has helped thousands of students transition into successful careers in data science
                          and machine learning.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold">Student Reviews</h2>

                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3 bg-muted/20 p-6 rounded-lg text-center">
                        <div className="text-5xl font-bold mb-2">{courseDetails.rating}</div>
                        <div className="flex justify-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${star <= Math.floor(courseDetails.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground">Course Rating</p>
                        <p className="text-sm mt-2">{courseDetails.ratingCount} reviews</p>
                      </div>

                      <div className="md:w-2/3 space-y-4">
                        {[
                          {
                            name: "Michael Rodriguez",
                            avatar: "/placeholder.svg?height=40&width=40",
                            rating: 5,
                            date: "2 months ago",
                            comment:
                              "This course exceeded my expectations. The instructor explains complex concepts in a way that's easy to understand, and the hands-on projects really helped solidify my understanding.",
                          },
                          {
                            name: "Jennifer Kim",
                            avatar: "/placeholder.svg?height=40&width=40",
                            rating: 4,
                            date: "3 months ago",
                            comment:
                              "Great course with lots of practical examples. I would have liked more advanced topics, but overall it was very valuable for my career development.",
                          },
                          {
                            name: "David Thompson",
                            avatar: "/placeholder.svg?height=40&width=40",
                            rating: 5,
                            date: "1 month ago",
                            comment:
                              "As someone transitioning from a non-technical background, this course was perfect. The step-by-step approach and clear explanations made learning machine learning approachable.",
                          },
                        ].map((review, index) => (
                          <div key={index} className="border-b pb-4 last:border-0">
                            <div className="flex items-center gap-4 mb-2">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={review.avatar} alt={review.name} />
                                <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{review.name}</div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-3 w-3 ${star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                                      />
                                    ))}
                                  </div>
                                  <span>{review.date}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

