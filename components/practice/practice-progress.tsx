"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Code, Award } from "lucide-react"

type UserProgress = {
  userId: string
  completedQuestions: string[]
  inProgressQuestions: string[]
  submissions: {
    questionId: string
    submissionDate: string
    status: string
    runtime: string
    memory: string
    language: string
    code: string
  }[]
  stats: {
    totalSolved: number
    easy: number
    medium: number
    hard: number
    streak: number
  }
}

export function PracticeProgress() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([])

  useEffect(() => {
    // Fetch user progress
    fetch("/api/practice/user-progress")
      .then((res) => res.json())
      .then((data) => {
        setUserProgress(data)
        setRecentSubmissions(data.submissions || [])
      })
      .catch((err) => console.error("Error fetching user progress:", err))
  }, [])

  // For demo purposes, we'll use hardcoded data if the fetch fails
  useEffect(() => {
    if (!userProgress) {
      const demoProgress = {
        userId: "user1",
        completedQuestions: ["q1", "q3"],
        inProgressQuestions: ["q2"],
        submissions: [
          {
            questionId: "q1",
            submissionDate: "2023-06-15T10:30:00Z",
            status: "Accepted",
            runtime: "76 ms",
            memory: "42.1 MB",
            language: "javascript",
            code: "var twoSum = function(nums, target) { const map = new Map(); for (let i = 0; i < nums.length; i++) { const complement = target - nums[i]; if (map.has(complement)) { return [map.get(complement), i]; } map.set(nums[i], i); } return []; };",
          },
          {
            questionId: "q3",
            submissionDate: "2023-06-16T14:45:00Z",
            status: "Accepted",
            runtime: "84 ms",
            memory: "44.3 MB",
            language: "javascript",
            code: "var mergeTwoLists = function(l1, l2) { const dummy = new ListNode(-1); let current = dummy; while (l1 !== null && l2 !== null) { if (l1.val <= l2.val) { current.next = l1; l1 = l1.next; } else { current.next = l2; l2 = l2.next; } current = current.next; } current.next = l1 !== null ? l1 : l2; return dummy.next; };",
          },
        ],
        stats: {
          totalSolved: 2,
          easy: 2,
          medium: 0,
          hard: 0,
          streak: 2,
        },
      }
      setUserProgress(demoProgress)
      setRecentSubmissions(demoProgress.submissions)
    }
  }, [userProgress])

  if (!userProgress) {
    return <div>Loading...</div>
  }

  const totalQuestions = 100 // Assuming there are 100 questions total
  const progressPercentage = (userProgress.stats.totalSolved / totalQuestions) * 100

  const questionMap: Record<string, any> = {
    q1: { title: "Two Sum", difficulty: "Easy" },
    q2: { title: "Valid Parentheses", difficulty: "Easy" },
    q3: { title: "Merge Two Sorted Lists", difficulty: "Easy" },
    q4: { title: "Maximum Subarray", difficulty: "Medium" },
    q5: { title: "Reverse Linked List", difficulty: "Easy" },
  }

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress.stats.totalSolved}</div>
            <Progress value={progressPercentage} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{progressPercentage.toFixed(1)}% of all questions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="text-2xl font-bold">{userProgress.stats.streak} days</div>
            <Award className="h-5 w-5 ml-2 text-yellow-500" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">By Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-green-600">Easy</span>
                <span className="text-xs">{userProgress.stats.easy}</span>
              </div>
              <Progress value={(userProgress.stats.easy / 50) * 100} className="h-1 bg-green-100" />

              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-yellow-600">Medium</span>
                <span className="text-xs">{userProgress.stats.medium}</span>
              </div>
              <Progress value={(userProgress.stats.medium / 30) * 100} className="h-1 bg-yellow-100" />

              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-red-600">Hard</span>
                <span className="text-xs">{userProgress.stats.hard}</span>
              </div>
              <Progress value={(userProgress.stats.hard / 20) * 100} className="h-1 bg-red-100" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProgress.inProgressQuestions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Questions you've started but not completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent Submissions</TabsTrigger>
          <TabsTrigger value="completed">Completed Questions</TabsTrigger>
          <TabsTrigger value="inprogress">In Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Your most recent question submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSubmissions.map((submission, index) => (
                  <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-0">
                    <div
                      className={`p-2 rounded-full ${submission.status === "Accepted" ? "bg-green-100" : "bg-red-100"}`}
                    >
                      {submission.status === "Accepted" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Code className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">
                        {questionMap[submission.questionId]?.title || submission.questionId}
                      </h4>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="mr-2">
                          {submission.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Runtime: {submission.runtime}</span>
                        <span className="text-xs text-muted-foreground ml-2">Memory: {submission.memory}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(submission.submissionDate)}
                    </div>
                  </div>
                ))}

                {recentSubmissions.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No submissions yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Questions</CardTitle>
              <CardDescription>Questions you've successfully solved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProgress.completedQuestions.map((questionId) => (
                  <div key={questionId} className="flex items-center p-3 border rounded-md">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium">{questionMap[questionId]?.title || questionId}</h4>
                      <Badge variant="outline" className="mt-1">
                        {questionMap[questionId]?.difficulty || "Unknown"}
                      </Badge>
                    </div>
                  </div>
                ))}

                {userProgress.completedQuestions.length === 0 && (
                  <div className="text-center py-6 col-span-2">
                    <p className="text-muted-foreground">No completed questions yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inprogress" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>In Progress Questions</CardTitle>
              <CardDescription>Questions you've started but not completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProgress.inProgressQuestions.map((questionId) => (
                  <div key={questionId} className="flex items-center p-3 border rounded-md">
                    <Clock className="h-5 w-5 text-yellow-500 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium">{questionMap[questionId]?.title || questionId}</h4>
                      <Badge variant="outline" className="mt-1">
                        {questionMap[questionId]?.difficulty || "Unknown"}
                      </Badge>
                    </div>
                  </div>
                ))}

                {userProgress.inProgressQuestions.length === 0 && (
                  <div className="text-center py-6 col-span-2">
                    <p className="text-muted-foreground">No in-progress questions</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

