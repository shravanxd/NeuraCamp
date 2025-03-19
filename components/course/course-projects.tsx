"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Github, Play, Upload } from "lucide-react"

export function CourseProjects() {
  // Sample projects data
  const projects = [
    {
      id: 1,
      title: "SVM Image Classifier",
      description: "Build an image classifier using Support Vector Machines to classify images of handwritten digits.",
      difficulty: "Intermediate",
      estimatedTime: "4 hours",
      progress: 0,
      status: "not-started",
      steps: [
        {
          id: 1,
          title: "Project Overview",
          description: "Learn about the project objectives and expected outcomes.",
          completed: false,
          type: "video",
        },
        {
          id: 2,
          title: "Dataset Exploration",
          description: "Explore the MNIST dataset and understand its structure.",
          completed: false,
          type: "notebook",
        },
        {
          id: 3,
          title: "Feature Extraction",
          description: "Extract relevant features from the images for classification.",
          completed: false,
          type: "notebook",
        },
        {
          id: 4,
          title: "SVM Implementation",
          description: "Implement and train an SVM classifier on the extracted features.",
          completed: false,
          type: "notebook",
        },
        {
          id: 5,
          title: "Model Evaluation",
          description: "Evaluate the performance of your SVM classifier.",
          completed: false,
          type: "notebook",
        },
        {
          id: 6,
          title: "Project Submission",
          description: "Submit your completed project for review.",
          completed: false,
          type: "submission",
        },
      ],
    },
    {
      id: 2,
      title: "Customer Churn Prediction",
      description: "Develop a model to predict customer churn using SVM and other classification algorithms.",
      difficulty: "Advanced",
      estimatedTime: "6 hours",
      progress: 0,
      status: "not-started",
      steps: [],
    },
    {
      id: 3,
      title: "Text Classification with SVMs",
      description: "Build a text classifier using SVMs to categorize news articles into different topics.",
      difficulty: "Advanced",
      estimatedTime: "5 hours",
      progress: 0,
      status: "not-started",
      steps: [],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Projects</CardTitle>
        <CardDescription>Apply what you've learned with hands-on projects</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="project-1">
          <TabsList className="w-full">
            <TabsTrigger value="project-1">SVM Image Classifier</TabsTrigger>
            <TabsTrigger value="project-2">Customer Churn Prediction</TabsTrigger>
            <TabsTrigger value="project-3">Text Classification</TabsTrigger>
          </TabsList>

          <TabsContent value="project-1" className="mt-4">
            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-medium">SVM Image Classifier</h3>
                  <p className="text-sm text-muted-foreground">
                    Build an image classifier using Support Vector Machines to classify images of handwritten digits.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                    Intermediate
                  </Badge>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
                    4 hours
                  </Badge>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Project Progress</h4>
                  <span className="text-sm font-medium">0%</span>
                </div>
                <Progress value={0} className="mt-2 h-2" />
              </div>

              <div className="space-y-4">
                {projects[0].steps.map((step, index) => (
                  <div key={step.id} className="rounded-md border p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-muted text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{step.title}</h4>
                          <Badge variant="outline">
                            {step.type === "video" ? "Video" : step.type === "notebook" ? "Notebook" : "Submission"}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                        <div className="mt-3">
                          {step.type === "video" && (
                            <Button size="sm" className="gap-1">
                              <Play className="h-4 w-4" />
                              Watch Video
                            </Button>
                          )}
                          {step.type === "notebook" && (
                            <Button size="sm" className="gap-1">
                              <FileText className="h-4 w-4" />
                              Open Notebook
                            </Button>
                          )}
                          {step.type === "submission" && (
                            <Button size="sm" className="gap-1">
                              <Upload className="h-4 w-4" />
                              Submit Project
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="project-2" className="mt-4">
            <div className="flex h-40 items-center justify-center rounded-md border">
              <div className="text-center">
                <h3 className="text-lg font-medium">Customer Churn Prediction</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This project will be unlocked after completing the SVM Image Classifier project.
                </p>
                <Button className="mt-4" disabled>
                  Locked
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="project-3" className="mt-4">
            <div className="flex h-40 items-center justify-center rounded-md border">
              <div className="text-center">
                <h3 className="text-lg font-medium">Text Classification with SVMs</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This project will be unlocked after completing the Customer Churn Prediction project.
                </p>
                <Button className="mt-4" disabled>
                  Locked
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t">
        <Button variant="outline" className="gap-1">
          <Github className="h-4 w-4" />
          View on GitHub
        </Button>
        <Button disabled>Generate Certificate</Button>
      </CardFooter>
    </Card>
  )
}

