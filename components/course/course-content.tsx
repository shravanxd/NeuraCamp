"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoPlayer } from "@/components/course/video-player"
import { CodeEditor } from "@/components/course/code-editor"
import { QuizSection } from "@/components/course/quiz-section"
import { MatchingGame } from "@/components/course/matching-game"
import { CourseDiscussion } from "@/components/course/course-discussion"
import { CourseResources } from "@/components/course/course-resources"
import { CourseProjects } from "@/components/course/course-projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Brain } from "lucide-react"
import { AIAssistant } from "@/components/course/ai-assistant"

export function CourseContent() {
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  return (
    <div className="container mx-auto px-4 py-6 md:px-6">
      <Tabs defaultValue="lesson" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="lesson">Lesson</TabsTrigger>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="discussion">Discussion</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <Button variant="outline" className="gap-1" onClick={() => setShowAIAssistant(!showAIAssistant)}>
            <Brain className="h-4 w-4" />
            AI Assistant
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className={showAIAssistant ? "lg:col-span-2" : "lg:col-span-3"}>
            <TabsContent value="lesson" className="mt-0">
              <Card>
                <CardContent className="p-0">
                  <VideoPlayer />
                </CardContent>
              </Card>

              <div className="mt-6">
                <h2 className="text-xl font-bold">Support Vector Machines</h2>
                <p className="mt-2 text-muted-foreground">
                  Support Vector Machines (SVMs) are powerful supervised learning models used for classification and
                  regression tasks. In this lesson, we'll explore the theory behind SVMs and how they work.
                </p>

                <h3 className="mt-6 text-lg font-semibold">What You'll Learn</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>The mathematical foundations of Support Vector Machines</li>
                  <li>How to implement SVMs using scikit-learn</li>
                  <li>Kernel functions and their applications</li>
                  <li>Hyperparameter tuning for optimal performance</li>
                  <li>Real-world applications of SVMs</li>
                </ul>

                <div className="mt-8 flex items-center justify-between">
                  <Button variant="outline" className="gap-1">
                    <ArrowLeft className="h-4 w-4" />
                    Previous Lesson
                  </Button>
                  <Button className="gap-1">
                    Next Lesson
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="exercises" className="mt-0 space-y-6">
              <QuizSection />
              <CodeEditor />
              <MatchingGame />
            </TabsContent>

            <TabsContent value="resources" className="mt-0">
              <CourseResources />
            </TabsContent>

            <TabsContent value="discussion" className="mt-0">
              <CourseDiscussion />
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <CourseProjects />
            </TabsContent>
          </div>

          {showAIAssistant && (
            <div className="lg:col-span-1">
              <AIAssistant />
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}

