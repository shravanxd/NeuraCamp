"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CodeEditor() {
  const [language, setLanguage] = useState("python")
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // Sample code for the exercise
  const initialCode = `# Implement a Support Vector Machine classifier using scikit-learn
# Complete the code below

import numpy as np
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Load the data (already provided)
X = np.array([
    [2.5, 2.4], [2.3, 1.9], [2.1, 2.7], [2.0, 1.6], [2.9, 2.9],
    [2.6, 3.2], [3.0, 2.5], [2.2, 2.3], [2.8, 2.8], [2.5, 2.8],
    [1.2, 0.7], [1.3, 1.4], [1.3, 0.5], [1.0, 0.7], [1.4, 1.5],
    [1.7, 0.8], [1.5, 1.0], [1.0, 1.0], [1.1, 0.8], [0.9, 1.0]
])
y = np.array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# TODO: Scale the features using StandardScaler
scaler = StandardScaler()
# Your code here

# TODO: Create an SVM classifier with a linear kernel
# Your code here

# TODO: Train the classifier
# Your code here

# TODO: Make predictions on the test set
# Your code here

# TODO: Calculate and print the accuracy
# Your code here
`

  const [code, setCode] = useState(initialCode)

  const handleRun = () => {
    setIsRunning(true)

    // Simulate code execution
    setTimeout(() => {
      setIsRunning(false)

      // Check if the code contains the expected solutions
      const hasScaling =
        code.includes("X_train = scaler.fit_transform(X_train)") && code.includes("X_test = scaler.transform(X_test)")
      const hasSVMCreation = code.includes("clf = SVC(kernel='linear')")
      const hasTraining = code.includes("clf.fit(X_train, y_train)")
      const hasPrediction = code.includes("y_pred = clf.predict(X_test)")
      const hasAccuracy =
        code.includes("accuracy = accuracy_score(y_test, y_pred)") &&
        code.includes("print(f'Accuracy: {accuracy:.2f}')")

      const allCorrect = hasScaling && hasSVMCreation && hasTraining && hasPrediction && hasAccuracy

      setIsCorrect(allCorrect)

      if (allCorrect) {
        setOutput("Accuracy: 0.83\nGreat job! Your SVM classifier is working correctly.")
      } else {
        const missingParts = []
        if (!hasScaling) missingParts.push("feature scaling")
        if (!hasSVMCreation) missingParts.push("SVM classifier creation")
        if (!hasTraining) missingParts.push("model training")
        if (!hasPrediction) missingParts.push("prediction")
        if (!hasAccuracy) missingParts.push("accuracy calculation")

        setOutput(
          `Error: Your implementation is missing: ${missingParts.join(", ")}.\nPlease check the instructions and try again.`,
        )
      }
    }, 1500)
  }

  const resetCode = () => {
    setCode(initialCode)
    setOutput(null)
    setIsCorrect(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Coding Exercise</CardTitle>
            <CardDescription>Implement a Support Vector Machine classifier</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="r">R</SelectItem>
                <SelectItem value="sql">SQL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-y bg-muted/40 p-4">
          <h3 className="font-medium">Instructions</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete the code below to implement a Support Vector Machine classifier using scikit-learn. You need to:
          </p>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
            <li>Scale the features using StandardScaler</li>
            <li>Create an SVM classifier with a linear kernel</li>
            <li>Train the classifier on the training data</li>
            <li>Make predictions on the test set</li>
            <li>Calculate and print the accuracy</li>
          </ol>
        </div>

        <div className="relative">
          <div className="border-b bg-black p-4 font-mono text-sm text-white">
            <pre className="whitespace-pre-wrap">{code}</pre>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="absolute inset-0 h-full w-full resize-none bg-transparent p-4 font-mono text-sm text-transparent caret-white outline-none"
          />
        </div>

        {output && (
          <div className="border-t">
            <Tabs defaultValue="output">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4">
                <TabsTrigger value="output" className="rounded-t-md rounded-b-none">
                  Output
                </TabsTrigger>
              </TabsList>
              <TabsContent value="output" className="mt-0 p-0">
                <div className="bg-black p-4 font-mono text-sm text-white">
                  <pre className="whitespace-pre-wrap">{output}</pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetCode} className="gap-1">
          <RefreshCw className="h-4 w-4" />
          Reset Code
        </Button>
        <Button onClick={handleRun} disabled={isRunning} className="gap-1">
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Code
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

