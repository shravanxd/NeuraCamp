"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
} from "reactflow"
import "reactflow/dist/style.css"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { auth, type User } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, Star, CheckCircle, BookOpen, Briefcase } from "lucide-react"

import tracksData from "@/data/tracks.json"
import coursesData from "@/data/courses.json"

// Custom node component for courses
const CourseNode = ({ data }) => {
  const router = useRouter()

  const handleNodeClick = () => {
    if (data.id) {
      router.push(`/courses/${data.id}`)
    }
  }

  return (
    <div
      className={`px-4 py-3 rounded-md shadow-md w-64 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
        data.completed
          ? "bg-green-500/20 border-2 border-green-500"
          : data.inProgress
            ? "bg-blue-500/20 border-2 border-blue-500"
            : data.required
              ? "bg-background border-2 border-primary"
              : "bg-background border border-muted"
      }`}
      onClick={handleNodeClick}
    >
      <div className="flex items-center gap-2">
        {data.completed ? (
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
        ) : data.inProgress ? (
          <BookOpen className="h-5 w-5 text-blue-500 shrink-0" />
        ) : (
          <BookOpen className="h-5 w-5 text-muted-foreground shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{data.title}</p>
          <p className="text-xs text-muted-foreground">{data.duration}</p>
        </div>
      </div>
      {(data.completed || data.inProgress) && (
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>{data.progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${data.completed ? "bg-green-500" : "bg-blue-500"}`}
              style={{ width: `${data.progress}%` }}
            ></div>
          </div>
        </div>
      )}
      <div className="mt-2 flex flex-wrap gap-1">
        {data.skills?.slice(0, 2).map((skill, i) => (
          <Badge key={i} variant="outline" className="text-xs px-1 py-0">
            {skill}
          </Badge>
        ))}
      </div>
      <div className="mt-2 text-xs text-center text-muted-foreground">Click to view course</div>
    </div>
  )
}

// Node types
const nodeTypes = {
  courseNode: CourseNode,
}

export default function TrackPage() {
  const params = useParams()
  const router = useRouter()
  const trackId = params.trackId as string
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [nodes, setNodes] = useNodesState([])
  const [edges, setEdges] = useEdgesState([])
  const [trackDetails, setTrackDetails] = useState(null)
  const [trackCourses, setTrackCourses] = useState([])
  const [instructors, setInstructors] = useState([])
  const [trackProgress, setTrackProgress] = useState(0)

  // Load user data
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

  // Load track data
  useEffect(() => {
    if (loading) return

    // Get track details
    const details = tracksData.find((track) => track.id === trackId)

    if (!details) {
      router.push("/tracks")
      return
    }

    setTrackDetails(details)

    // Get courses for this track
    const courses = details.courses
      .map((trackCourse) => {
        const courseDetails = coursesData.find((course) => course.id === trackCourse.id)

        if (!courseDetails) return null

        // Check if user is enrolled in this course
        const enrolledCourse = user?.enrolledCourses.find((course) => course.courseId === trackCourse.id)

        return {
          ...courseDetails,
          id: courseDetails.id,
          position: trackCourse.position,
          required: trackCourse.required,
          enrolled: !!enrolledCourse,
          progress: enrolledCourse?.progress || 0,
          completed: (enrolledCourse?.progress || 0) === 100,
          inProgress: enrolledCourse && enrolledCourse.progress > 0 && enrolledCourse.progress < 100,
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.position - b.position)

    setTrackCourses(courses)

    // Get instructors for this track
    const trackInstructors = Array.from(new Set(courses.map((course) => course?.instructor))).map((instructorName) => {
      const course = courses.find((course) => course?.instructor === instructorName)
      return {
        name: instructorName,
        avatar: course?.instructorAvatar || "/placeholder.svg?height=40&width=40",
        role: course?.instructorRole || "",
      }
    })

    setInstructors(trackInstructors)

    // Calculate track progress
    const enrolledCoursesInTrack = courses.filter((course) => course.enrolled)
    const progress =
      enrolledCoursesInTrack.length > 0
        ? Math.round(
            enrolledCoursesInTrack.reduce((sum, course) => sum + course.progress, 0) / enrolledCoursesInTrack.length,
          )
        : 0

    setTrackProgress(progress)
  }, [loading, trackId, user, router])

  // Create flow chart nodes and edges
  useEffect(() => {
    if (trackCourses.length === 0) return

    // Create nodes with a more visually appealing layout
    const flowNodes = trackCourses.map((course, index) => {
      // Create a zigzag pattern for better visualization
      const xPos = index % 2 === 0 ? 100 : 400
      const yPos = index * 250

      return {
        id: course.id,
        type: "courseNode",
        data: {
          ...course,
          label: course.title,
          id: course.id,
        },
        position: { x: xPos, y: yPos },
        sourcePosition: index % 2 === 0 ? Position.Right : Position.Left,
        targetPosition: index % 2 === 0 ? Position.Left : Position.Right,
      }
    })

    // Create edges between nodes with enhanced styling
    const flowEdges = []

    for (let i = 0; i < trackCourses.length - 1; i++) {
      const source = trackCourses[i].id
      const target = trackCourses[i + 1].id

      // Determine if this is a completed path
      const isCompleted = trackCourses[i].completed

      flowEdges.push({
        id: `e${source}-${target}`,
        source,
        target,
        type: "smoothstep",
        animated: isCompleted,
        style: {
          strokeWidth: 3,
          stroke: isCompleted ? "#22c55e" : "#64748b",
        },
        labelStyle: { fill: isCompleted ? "#22c55e" : "#64748b", fontWeight: 700 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: isCompleted ? "#22c55e" : "#64748b",
        },
      })
    }

    setNodes(flowNodes)
    setEdges(flowEdges)
  }, [trackCourses, setNodes, setEdges])

  // Handle node click (now handled in the node component)
  const onNodeClick = useCallback((event, node) => {
    // Navigation is now handled in the CourseNode component
  }, [])

  if (loading || !trackDetails) {
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
          <main className="flex-1 overflow-y-auto bg-muted/20">
            {/* Track Header */}
            <div className="border-b bg-background">
              <div className="container mx-auto px-4 py-6 md:px-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        Learning Track
                      </Badge>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
                        {trackDetails.level}
                      </Badge>
                    </div>
                    <h1 className="mt-2 text-2xl font-bold md:text-3xl">{trackDetails.title}</h1>
                    <p className="mt-2 text-muted-foreground">{trackDetails.description}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{trackDetails.enrolledStudents.toLocaleString()} students enrolled</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>
                          {trackDetails.rating} ({trackDetails.ratingCount} ratings)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{trackDetails.duration} estimated</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{trackCourses.length} courses</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-80">
                    <Card>
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <h3 className="font-medium">Your Progress</h3>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Track Completion</span>
                              <span className="font-medium">{trackProgress}%</span>
                            </div>
                            <Progress value={trackProgress} className="h-2 mt-1" />
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>
                              {trackCourses.filter((c) => c.completed).length} of {trackCourses.length} courses
                              completed
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-500" />
                            <span>{trackCourses.filter((c) => c.inProgress).length} courses in progress</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <span>Estimated time remaining: {trackDetails.duration}</span>
                          </div>
                        </div>

                        <Button className="w-full mt-4">Continue Learning</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Instructors */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Track Instructors</h3>
                  <div className="flex flex-wrap gap-4">
                    {instructors.map((instructor, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={instructor.avatar} alt={instructor.name} />
                          <AvatarFallback>{instructor.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{instructor.name}</p>
                          <p className="text-xs text-muted-foreground">{instructor.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Track Content */}
            <div className="container mx-auto px-4 py-8 md:px-6">
              <Tabs defaultValue="overview">
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="careers">Career Paths</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Track Overview</CardTitle>
                      <CardDescription>What you'll learn in this track</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Skills You'll Gain</h3>
                          <div className="flex flex-wrap gap-2">
                            {trackDetails.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="bg-primary/5">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium mb-3">Learning Path Visualization</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            This diagram shows the recommended course sequence and your current progress.
                            <strong className="ml-2 text-primary">Click on any course to view its details.</strong>
                          </p>
                          <div className="h-[600px] border rounded-md bg-background">
                            <ReactFlow
                              nodes={nodes}
                              edges={edges}
                              nodeTypes={nodeTypes}
                              onNodeClick={onNodeClick}
                              fitView
                              attributionPosition="bottom-right"
                              connectionLineType={ConnectionLineType.SmoothStep}
                              defaultZoom={0.8}
                            >
                              <Controls />
                              <MiniMap
                                nodeStrokeColor={(n) => {
                                  if (n.data?.completed) return "#22c55e"
                                  if (n.data?.inProgress) return "#3b82f6"
                                  return "#64748b"
                                }}
                                nodeColor={(n) => {
                                  if (n.data?.completed) return "rgba(34, 197, 94, 0.2)"
                                  if (n.data?.inProgress) return "rgba(59, 130, 246, 0.2)"
                                  return "rgba(100, 116, 139, 0.1)"
                                }}
                              />
                              <Background color="#aaa" gap={16} />
                            </ReactFlow>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium mb-3">Prerequisites</h3>
                          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            <li>Basic programming knowledge in Python</li>
                            <li>Familiarity with basic mathematics (algebra, calculus)</li>
                            <li>A computer with internet access</li>
                            <li>Enthusiasm to learn and practice</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="curriculum" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Track Curriculum</CardTitle>
                      <CardDescription>Courses included in this learning track</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {trackCourses.map((course, index) => (
                          <div key={course.id} className="border rounded-lg overflow-hidden">
                            <div className="bg-muted/30 p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    {index + 1}
                                  </div>
                                  <h3 className="font-medium">{course.title}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                  {course.required && (
                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                                      Required
                                    </Badge>
                                  )}
                                  {course.completed ? (
                                    <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                      Completed
                                    </Badge>
                                  ) : course.inProgress ? (
                                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                                      In Progress
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline">Not Started</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                                <div>
                                  <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                                  <div className="flex flex-wrap gap-2">
                                    {course.skills?.slice(0, 3).map((skill, i) => (
                                      <Badge key={i} variant="outline" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                    {course.skills?.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{course.skills.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      <span>{course.duration}</span>
                                    </div>
                                  </div>
                                  <Button asChild>
                                    <a href={`/courses/${course.id}`}>
                                      {course.enrolled ? "Continue" : "Start Course"}
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Student Reviews</CardTitle>
                      <CardDescription>What our students say about this track</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3 bg-muted/20 p-6 rounded-lg text-center">
                          <div className="text-5xl font-bold mb-2">{trackDetails.rating}</div>
                          <div className="flex justify-center mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${star <= Math.floor(trackDetails.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                              />
                            ))}
                          </div>
                          <p className="text-muted-foreground">Track Rating</p>
                          <p className="text-sm mt-2">{trackDetails.ratingCount} reviews</p>
                        </div>

                        <div className="md:w-2/3 space-y-4">
                          {trackDetails.reviews.map((review) => (
                            <div key={review.id} className="border-b pb-4 last:border-0">
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
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="careers" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Career Paths</CardTitle>
                      <CardDescription>Potential career opportunities after completing this track</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-3">
                        {trackDetails.careers.map((career, index) => (
                          <div key={index} className="border rounded-lg p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                              <Briefcase className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">{career}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Complete this track to gain the skills needed for a career as a {career}.
                            </p>
                            <Button variant="outline" className="w-full">
                              View Job Opportunities
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

