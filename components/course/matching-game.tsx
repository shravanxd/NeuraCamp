"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type MatchItem = {
  id: string
  text: string
  category: "algorithm" | "application"
  matched: boolean
}

export function MatchingGame() {
  const [items, setItems] = useState<MatchItem[]>([
    { id: "1", text: "Support Vector Machines", category: "algorithm", matched: false },
    { id: "2", text: "Random Forests", category: "algorithm", matched: false },
    { id: "3", text: "K-Means Clustering", category: "algorithm", matched: false },
    { id: "4", text: "Neural Networks", category: "algorithm", matched: false },
    { id: "5", text: "Gradient Boosting", category: "algorithm", matched: false },
    { id: "6", text: "Image Classification", category: "application", matched: false },
    { id: "7", text: "Fraud Detection", category: "application", matched: false },
    { id: "8", text: "Customer Segmentation", category: "application", matched: false },
    { id: "9", text: "Sentiment Analysis", category: "application", matched: false },
    { id: "10", text: "Recommendation Systems", category: "application", matched: false },
  ])

  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    // Shuffle the items
    const shuffledItems = [...items].sort(() => Math.random() - 0.5)
    setItems(shuffledItems)
  }, [])

  useEffect(() => {
    // Check if all items are matched
    if (items.every((item) => item.matched) && items.length > 0) {
      setIsCompleted(true)
    }
  }, [items])

  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleDrop = (category: "algorithm" | "application") => {
    if (!draggedItem) return

    const item = items.find((i) => i.id === draggedItem)
    if (!item) return

    if (item.category === category) {
      // Correct match
      setItems(items.map((i) => (i.id === draggedItem ? { ...i, matched: true } : i)))
      setScore(score + 10)
    } else {
      // Incorrect match
      setScore(Math.max(0, score - 5))
    }

    setDraggedItem(null)
  }

  const resetGame = () => {
    const shuffledItems = [...items].map((item) => ({ ...item, matched: false })).sort(() => Math.random() - 0.5)
    setItems(shuffledItems)
    setScore(0)
    setIsCompleted(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Matching Exercise</CardTitle>
            <CardDescription>Match algorithms with their applications</CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>{score} points</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isCompleted && (
          <Alert className="mb-4 border-green-500">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Great job!</AlertTitle>
            <AlertDescription>
              You've successfully matched all items. Your final score is {score} points.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div
            className="rounded-md border border-dashed border-primary/50 p-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop("algorithm")}
          >
            <h3 className="mb-4 text-center font-medium">Machine Learning Algorithms</h3>
            <div className="space-y-2">
              {items
                .filter((item) => item.category === "algorithm" && item.matched)
                .map((item) => (
                  <div key={item.id} className="rounded-md bg-primary/10 p-2 text-sm">
                    {item.text}
                  </div>
                ))}
            </div>
          </div>

          <div
            className="rounded-md border border-dashed border-primary/50 p-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop("application")}
          >
            <h3 className="mb-4 text-center font-medium">Real-World Applications</h3>
            <div className="space-y-2">
              {items
                .filter((item) => item.category === "application" && item.matched)
                .map((item) => (
                  <div key={item.id} className="rounded-md bg-primary/10 p-2 text-sm">
                    {item.text}
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-4 text-center font-medium">Drag items to their correct category</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {items
              .filter((item) => !item.matched)
              .map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  onDragEnd={handleDragEnd}
                  className="cursor-grab rounded-md border bg-card p-2 text-sm shadow-sm transition-colors hover:bg-muted"
                >
                  {item.text}
                </div>
              ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetGame} className="gap-1">
          <RefreshCw className="h-4 w-4" />
          Reset Game
        </Button>

        <Button disabled={!isCompleted}>Continue to Next Exercise</Button>
      </CardFooter>
    </Card>
  )
}

