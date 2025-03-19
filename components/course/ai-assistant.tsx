"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Brain, Send, Sparkles } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: number
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hi there! I'm your AI learning assistant. How can I help you with Support Vector Machines today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponses: Record<string, string> = {
        "what is a support vector machine":
          "A Support Vector Machine (SVM) is a supervised machine learning algorithm that can be used for both classification and regression tasks. The main idea behind SVM is to find a hyperplane that best divides a dataset into classes. SVMs are particularly effective in high-dimensional spaces and cases where the number of dimensions exceeds the number of samples.",
        "explain kernel trick":
          "The kernel trick is a mathematical technique used in SVMs to transform data from a lower-dimensional space to a higher-dimensional space without explicitly computing the coordinates in that space. This allows SVMs to find non-linear decision boundaries by implicitly mapping the input features into high-dimensional feature spaces. Common kernels include linear, polynomial, radial basis function (RBF), and sigmoid.",
        "how do i tune svm hyperparameters":
          "To tune SVM hyperparameters, you can use techniques like grid search or random search with cross-validation. The key parameters to tune are:\n\n1. C (regularization parameter): Controls the trade-off between having a smooth decision boundary and classifying training points correctly.\n2. Kernel: Choose between linear, polynomial, RBF, or sigmoid based on your data.\n3. Gamma (for RBF, polynomial and sigmoid kernels): Defines how far the influence of a single training example reaches.\n4. Degree (for polynomial kernel): The degree of the polynomial function.\n\nScikit-learn's GridSearchCV or RandomizedSearchCV can help automate this process.",
      }

      // Default response if no specific match
      let responseText =
        "I'm not sure about that specific topic related to SVMs. Would you like me to explain the basic concepts of Support Vector Machines or help with a specific aspect of the algorithm?"

      // Check for keyword matches in the user's input
      const lowercaseInput = input.toLowerCase()
      for (const [keyword, response] of Object.entries(aiResponses)) {
        if (lowercaseInput.includes(keyword)) {
          responseText = response
          break
        }
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        content: responseText,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Brain className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle>AI Learning Assistant</CardTitle>
            <CardDescription>Ask questions about the course material</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[500px]">
          <div className="flex flex-col gap-4 p-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                {message.sender === "ai" ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "ai" ? "bg-muted" : "bg-primary text-primary-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{message.sender === "ai" ? "AI Assistant" : "You"}</span>
                    {message.sender === "ai" && (
                      <Badge variant="outline" className="gap-1 bg-primary/10 text-primary">
                        <Sparkles className="h-3 w-3" />
                        AI
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">AI Assistant</span>
                    <Badge variant="outline" className="gap-1 bg-primary/10 text-primary">
                      <Sparkles className="h-3 w-3" />
                      AI
                    </Badge>
                  </div>
                  <div className="mt-1 flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.2s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        <form
          className="flex w-full gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
        >
          <Input
            placeholder="Ask a question about SVMs..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

