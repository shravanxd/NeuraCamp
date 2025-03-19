"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

type Comment = {
  id: number
  user: {
    name: string
    avatar: string
    role: "student" | "instructor" | "ta"
  }
  content: string
  timestamp: string
  likes: number
  replies: Comment[]
}

export function CourseDiscussion() {
  const [newComment, setNewComment] = useState("")

  // Sample discussion data
  const discussions: Comment[] = [
    {
      id: 1,
      user: {
        name: "Dr. Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "instructor",
      },
      content:
        "Welcome to the discussion thread for Support Vector Machines! Feel free to ask any questions you have about the concepts covered in this lesson.",
      timestamp: "2 days ago",
      likes: 15,
      replies: [],
    },
    {
      id: 2,
      user: {
        name: "Alex Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "student",
      },
      content:
        "I'm having trouble understanding the difference between hard margin and soft margin SVMs. Could someone explain this in simpler terms?",
      timestamp: "1 day ago",
      likes: 3,
      replies: [
        {
          id: 3,
          user: {
            name: "Maya Patel",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "ta",
          },
          content:
            "Great question, Alex! Hard margin SVM assumes that the data is perfectly separable by a hyperplane, with no misclassifications allowed. Soft margin SVM, on the other hand, allows for some misclassifications by introducing a penalty parameter C that controls the trade-off between having a smooth decision boundary and classifying training points correctly. This makes soft margin SVMs more robust to noise and outliers in real-world data.",
          timestamp: "1 day ago",
          likes: 8,
          replies: [],
        },
        {
          id: 4,
          user: {
            name: "Alex Chen",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "student",
          },
          content:
            "Thanks Maya! That makes much more sense now. So in practice, we almost always use soft margin SVMs because real data is rarely perfectly separable, right?",
          timestamp: "23 hours ago",
          likes: 2,
          replies: [],
        },
        {
          id: 5,
          user: {
            name: "Maya Patel",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "ta",
          },
          content:
            "Exactly! You've got it. Most real-world datasets have some noise or outliers, so soft margin SVMs are generally more practical.",
          timestamp: "22 hours ago",
          likes: 3,
          replies: [],
        },
      ],
    },
    {
      id: 6,
      user: {
        name: "Jordan Lee",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "student",
      },
      content:
        "In the coding exercise, I'm getting an accuracy of only 0.75. Is this expected or am I doing something wrong?",
      timestamp: "10 hours ago",
      likes: 0,
      replies: [
        {
          id: 7,
          user: {
            name: "Dr. Sarah Johnson",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "instructor",
          },
          content:
            "Hi Jordan, the expected accuracy should be around 0.83. Make sure you're scaling your features before training the SVM. Without proper scaling, SVM performance can degrade significantly.",
          timestamp: "8 hours ago",
          likes: 4,
          replies: [],
        },
        {
          id: 8,
          user: {
            name: "Jordan Lee",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "student",
          },
          content:
            "You're right! I forgot to scale the test data. After fixing that, I'm getting 0.83 accuracy. Thank you!",
          timestamp: "7 hours ago",
          likes: 2,
          replies: [],
        },
      ],
    },
  ]

  const handleSubmitComment = () => {
    if (!newComment.trim()) return
    // In a real app, this would send the comment to the server
    alert(`Comment submitted: ${newComment}`)
    setNewComment("")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Discussion</CardTitle>
            <CardDescription>Join the conversation about this lesson</CardDescription>
          </div>
          <Button className="gap-1">
            <MessageSquare className="h-4 w-4" />
            Join Discord
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="discussion">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4">
            <TabsTrigger value="discussion" className="rounded-t-md rounded-b-none">
              Discussion
            </TabsTrigger>
            <TabsTrigger value="questions" className="rounded-t-md rounded-b-none">
              My Questions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discussion" className="mt-0">
            <ScrollArea className="h-[400px]">
              <div className="space-y-6 p-4">
                {discussions.map((comment) => (
                  <div key={comment.id} className="space-y-4">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                        <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.user.name}</span>
                          {comment.user.role === "instructor" && (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                              Instructor
                            </Badge>
                          )}
                          {comment.user.role === "ta" && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              Teaching Assistant
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="mt-1 text-sm">{comment.content}</p>
                        <div className="mt-2 flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                            <ThumbsUp className="h-3 w-3" />
                            Like ({comment.likes})
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                            <MessageSquare className="h-3 w-3" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>

                    {comment.replies.length > 0 && (
                      <div className="ml-12 space-y-4 border-l pl-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.user.avatar} alt={reply.user.name} />
                              <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{reply.user.name}</span>
                                {reply.user.role === "instructor" && (
                                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                                    Instructor
                                  </Badge>
                                )}
                                {reply.user.role === "ta" && (
                                  <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                    Teaching Assistant
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                              </div>
                              <p className="mt-1 text-sm">{reply.content}</p>
                              <div className="mt-2 flex items-center gap-4">
                                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                                  <ThumbsUp className="h-3 w-3" />
                                  Like ({reply.likes})
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                                  <MessageSquare className="h-3 w-3" />
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="questions" className="mt-0 p-4">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <User className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Questions Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You haven't asked any questions in this course yet.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t p-4">
        <Textarea
          placeholder="Ask a question or join the discussion..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

