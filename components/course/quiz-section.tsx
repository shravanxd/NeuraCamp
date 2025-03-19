"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowRight, CheckCircle, HelpCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function QuizSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)

  // Sample quiz questions
  const questions = [
    {
      id: 1,
      question: "Which of the following is NOT a kernel function commonly used with SVMs?",
      options: [
        { id: "a", text: "Linear Kernel" },
        { id: "b", text: "Polynomial Kernel" },
        { id: "c", text: "Gaussian Kernel" },
        { id: "d", text: "Exponential Decay Kernel" },
      ],
      correctAnswer: "d",
      hint: "Kernel functions transform data into higher dimensional spaces. Think about which functions are commonly used in SVM implementations.",
      explanation:
        "The Exponential Decay Kernel is not a standard kernel function used with SVMs. The common kernels are Linear, Polynomial, Gaussian (RBF), and Sigmoid.",
    },
    {
      id: 2,
      question: "What is the primary goal of the SVM algorithm?",
      options: [
        { id: "a", text: "Minimize the margin between classes" },
        { id: "b", text: "Maximize the margin between classes" },
        { id: "c", text: "Minimize the number of support vectors" },
        { id: "d", text: "Maximize the number of support vectors" },
      ],
      correctAnswer: "b",
      hint: "Think about what makes SVM robust to outliers and generalizes well to unseen data.",
      explanation:
        "SVMs aim to find a hyperplane that maximizes the margin between classes, which helps in better generalization to unseen data.",
    },
    {
      id: 3,
      question:
        "Which parameter in SVM controls the trade-off between maximizing the margin and minimizing the classification error?",
      options: [
        { id: "a", text: "Kernel parameter" },
        { id: "b", text: "C parameter (regularization)" },
        { id: "c", text: "Gamma parameter" },
        { id: "d", text: "Epsilon parameter" },
      ],
      correctAnswer: "b",
      hint: "This parameter determines how much you want to penalize misclassifications.",
      explanation:
        "The C parameter in SVM controls the trade-off between having a smooth decision boundary and classifying training points correctly. A lower C value creates a smoother decision boundary, while a higher C value aims to classify all training examples correctly.",
    },
  ]

  const currentQ = questions[currentQuestion]

  const handleSubmit = () => {
    if (!selectedOption) return

    setIsSubmitted(true)
    if (selectedOption === currentQ.correctAnswer) {
      setScore(score + (showHint ? 5 : 10)) // Less points if hint was used
    }
  }

  const handleNext = () => {
    setSelectedOption(null)
    setShowHint(false)
    setIsSubmitted(false)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Quiz completed
      alert(`Quiz completed! Your score: ${score}/${questions.length * 10}`)
    }
  }

  const useHint = () => {
    setShowHint(true)
    setHintsUsed(hintsUsed + 1)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Module Quiz</CardTitle>
            <CardDescription>Test your knowledge of Support Vector Machines</CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>{score} points</span>
          </Badge>
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-between text-sm">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mt-2 h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{currentQ.question}</h3>

          <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} disabled={isSubmitted}>
            {currentQ.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.id}
                  id={`option-${option.id}`}
                  className={
                    isSubmitted
                      ? option.id === currentQ.correctAnswer
                        ? "border-green-500 text-green-500"
                        : selectedOption === option.id
                          ? "border-red-500 text-red-500"
                          : ""
                      : ""
                  }
                />
                <Label
                  htmlFor={`option-${option.id}`}
                  className={
                    isSubmitted
                      ? option.id === currentQ.correctAnswer
                        ? "text-green-500"
                        : selectedOption === option.id
                          ? "text-red-500"
                          : ""
                      : ""
                  }
                >
                  {option.text}
                </Label>
                {isSubmitted && option.id === currentQ.correctAnswer && (
                  <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                )}
                {isSubmitted && selectedOption === option.id && option.id !== currentQ.correctAnswer && (
                  <XCircle className="ml-2 h-4 w-4 text-red-500" />
                )}
              </div>
            ))}
          </RadioGroup>

          {showHint && (
            <Alert>
              <HelpCircle className="h-4 w-4" />
              <AlertTitle>Hint</AlertTitle>
              <AlertDescription>{currentQ.hint}</AlertDescription>
            </Alert>
          )}

          {isSubmitted && (
            <Alert className={selectedOption === currentQ.correctAnswer ? "border-green-500" : "border-red-500"}>
              {selectedOption === currentQ.correctAnswer ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertTitle>{selectedOption === currentQ.correctAnswer ? "Correct!" : "Incorrect"}</AlertTitle>
              <AlertDescription>{currentQ.explanation}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={useHint} disabled={showHint || isSubmitted}>
          Use Hint (-5 points)
        </Button>

        {isSubmitted ? (
          <Button onClick={handleNext} className="gap-1">
            {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!selectedOption}>
            Submit Answer
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

