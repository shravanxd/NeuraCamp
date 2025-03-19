"use client"

import { useEffect, useState } from "react"
import { CheckCircle, ChevronDown, Clock, Code, FileText, PlayCircle } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { auth, type User, type EnrolledCourse } from "@/lib/auth"
import coursesData from "@/data/courses.json"
import { useRouter } from "next/navigation"

interface CourseSidebarProps {
  courseId: string
}

export function CourseSidebar({ courseId }: CourseSidebarProps) {
  const [user, setUser] = useState<User | null>(null)
  const [enrolledCourse, setEnrolledCourse] = useState<EnrolledCourse | null>(null)
  const router = useRouter()

  // Get course details
  const courseDetails = coursesData.find((course) => course.id === courseId)

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = auth.getCurrentUser()

    if (!currentUser) {
      router.push("/auth/signin")
      return
    }

    setUser(currentUser)

    // Check if user is enrolled in this course
    const isEnrolled = auth.isEnrolledInCourse(courseId)

    if (!isEnrolled) {
      router.push(`/courses/${courseId}`)
      return
    }

    // Get enrolled course details
    const enrolledCourseDetails = currentUser.enrolledCourses.find((course) => course.courseId === courseId)

    if (enrolledCourseDetails) {
      setEnrolledCourse(enrolledCourseDetails)
    }
  }, [courseId, router])

  // Calculate overall course progress
  const overallProgress = enrolledCourse?.progress || 0

  if (!courseDetails) {
    return null
  }

  return (
    <>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r">
        <SidebarHeader className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1" asChild>
              <a href="/dashboard">
                <ChevronDown className="h-4 w-4 rotate-90" />
                <span>Back to Dashboard</span>
              </a>
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-4">
            <h2 className="text-lg font-semibold">{courseDetails.title}</h2>
            <div className="mt-2 flex items-center gap-2">
              <Progress value={overallProgress} className="h-2 flex-1" />
              <span className="text-xs font-medium">{overallProgress}% Complete</span>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            <Accordion type="multiple" defaultValue={["module-2"]} className="w-full">
              {courseDetails.modules && courseDetails.modules.length > 0 ? (
                courseDetails.modules.map((module, moduleIndex) => (
                  <AccordionItem key={moduleIndex} value={`module-${moduleIndex + 1}`} className="border-0">
                    <AccordionTrigger className="px-4 py-2 hover:bg-muted/50 hover:no-underline">
                      <div className="flex w-full flex-col items-start text-left">
                        <div className="flex w-full items-center justify-between">
                          <span className="font-medium">{module.title}</span>
                          {module.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <span className="text-xs text-muted-foreground">{module.duration}</span>
                          )}
                        </div>
                        <div className="mt-1 flex w-full items-center gap-2">
                          <Progress value={module.progress} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground">{module.progress}%</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0 pt-1">
                      <SidebarMenu>
                        {module.lessons.map((lesson, lessonIndex) => (
                          <SidebarMenuItem key={lessonIndex}>
                            <SidebarMenuButton asChild isActive={moduleIndex === 1 && lessonIndex === 3}>
                              <a
                                href={moduleIndex === 1 && lessonIndex === 3 ? `/courses/${courseId}` : "#"}
                                className="py-1.5"
                              >
                                <LessonIcon type={lesson.type} completed={lesson.completed} />
                                <span>{lesson.title}</span>
                                <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duration}
                                </span>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-muted-foreground">
                  <p>No modules available for this course yet.</p>
                </div>
              )}
            </Accordion>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <Button className="w-full">Continue Learning</Button>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  )
}

function LessonIcon({ type, completed }: { type: string; completed: boolean }) {
  if (completed) {
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  switch (type) {
    case "video":
      return <PlayCircle className="h-4 w-4 text-blue-500" />
    case "code":
      return <Code className="h-4 w-4 text-purple-500" />
    case "quiz":
      return <FileText className="h-4 w-4 text-orange-500" />
    case "project":
      return <FileText className="h-4 w-4 text-green-500" />
    default:
      return <PlayCircle className="h-4 w-4" />
  }
}

