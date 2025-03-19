"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, ExternalLink, FileText, Link2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function CourseResources() {
  // Sample resources data
  const resources = {
    readings: [
      {
        id: 1,
        title: "Support Vector Machines: A Comprehensive Guide",
        type: "PDF",
        size: "2.4 MB",
        description: "A detailed guide covering the theory and applications of SVMs.",
      },
      {
        id: 2,
        title: "Kernel Methods for Pattern Analysis",
        type: "PDF",
        size: "3.1 MB",
        description: "Learn about different kernel functions and their applications in SVMs.",
      },
      {
        id: 3,
        title: "Practical SVM Implementation with scikit-learn",
        type: "PDF",
        size: "1.8 MB",
        description: "Step-by-step guide to implementing SVMs using scikit-learn.",
      },
    ],
    datasets: [
      {
        id: 4,
        title: "Iris Dataset",
        type: "CSV",
        size: "4 KB",
        description: "Classic dataset for classification tasks.",
      },
      {
        id: 5,
        title: "MNIST Digits",
        type: "ZIP",
        size: "15 MB",
        description: "Handwritten digits dataset for image classification.",
      },
      {
        id: 6,
        title: "Wine Quality Dataset",
        type: "CSV",
        size: "120 KB",
        description: "Dataset for predicting wine quality based on physicochemical tests.",
      },
    ],
    links: [
      {
        id: 7,
        title: "scikit-learn SVM Documentation",
        url: "https://scikit-learn.org/stable/modules/svm.html",
        description: "Official documentation for SVM implementation in scikit-learn.",
      },
      {
        id: 8,
        title: "SVM Tutorial by Andrew Ng",
        url: "https://www.youtube.com/watch?v=_PwhiWxHK8o",
        description: "Video tutorial explaining SVMs by Stanford professor Andrew Ng.",
      },
      {
        id: 9,
        title: "Kaggle SVM Competition",
        url: "https://www.kaggle.com/competitions",
        description: "Practice your SVM skills in this Kaggle competition.",
      },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Course Resources</CardTitle>
            <CardDescription>Supplementary materials for this lesson</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search resources..." className="pl-8" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="readings">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4">
            <TabsTrigger value="readings" className="rounded-t-md rounded-b-none">
              Readings
            </TabsTrigger>
            <TabsTrigger value="datasets" className="rounded-t-md rounded-b-none">
              Datasets
            </TabsTrigger>
            <TabsTrigger value="links" className="rounded-t-md rounded-b-none">
              External Links
            </TabsTrigger>
          </TabsList>

          <TabsContent value="readings" className="mt-0">
            <div className="divide-y">
              {resources.readings.map((resource) => (
                <div key={resource.id} className="flex items-start justify-between p-4">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline">{resource.type}</Badge>
                        <span className="text-xs text-muted-foreground">{resource.size}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="datasets" className="mt-0">
            <div className="divide-y">
              {resources.datasets.map((resource) => (
                <div key={resource.id} className="flex items-start justify-between p-4">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline">{resource.type}</Badge>
                        <span className="text-xs text-muted-foreground">{resource.size}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="links" className="mt-0">
            <div className="divide-y">
              {resources.links.map((resource) => (
                <div key={resource.id} className="flex items-start justify-between p-4">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      <Link2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                      <div className="mt-1">
                        <span className="text-xs text-muted-foreground">{resource.url}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1" asChild>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

