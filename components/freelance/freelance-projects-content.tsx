"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Calendar,
  Check,
  CheckCircle,
  DollarSign,
  FileText,
  Filter,
  MessageSquare,
  Search,
  Building,
  MapPin,
  Users,
  Clock,
  Briefcase,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { auth, type User } from "@/lib/auth"
import { useRouter } from "next/navigation"

// Define project types
type ProjectStatus = "open" | "applied" | "interview" | "accepted" | "completed" | "rejected"

type TimelineEvent = {
  id: string
  date: string
  title: string
  description: string
  type: "application" | "message" | "interview" | "document" | "acceptance" | "payment"
  completed: boolean
}

type Project = {
  id: string
  title: string
  company: string
  companyLogo: string
  description: string
  budget: string
  duration: string
  skills: string[]
  status: ProjectStatus
  postedDate: string
  location: string
  applicants?: number
  timeline?: TimelineEvent[]
  employerId?: string
}

type ProjectApplication = {
  id: string
  projectId: string
  userId: string
  coverLetter: string
  proposedRate: string
  estimatedDuration: string
  status: "pending" | "accepted" | "rejected" | "interview"
  submittedDate: string
}

export function FreelanceProjectsContent() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [showNdaDialog, setShowNdaDialog] = useState(false)
  const [showInterviewDialog, setShowInterviewDialog] = useState(false)
  const [showApplicationDialog, setShowApplicationDialog] = useState(false)
  const [applicationData, setApplicationData] = useState<Partial<ProjectApplication>>({
    coverLetter: "",
    proposedRate: "",
    estimatedDuration: "",
  })
  const [user, setUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSkills, setFilterSkills] = useState<string[]>([])
  const router = useRouter()

  const [showViewApplicationDialog, setShowViewApplicationDialog] = useState(false)
  const [viewedApplication, setViewedApplication] = useState<ProjectApplication | null>(null)

  const [userApplications, setUserApplications] = useState<Project[]>([])

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = auth.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  // Dummy data for projects
  const projects: Project[] = [
    {
      id: "proj-1",
      title: "Machine Learning Model for Customer Churn Prediction",
      company: "TechCorp Inc.",
      companyLogo: "/placeholder.svg?height=40&width=40",
      description:
        "Develop a machine learning model to predict customer churn based on historical data. The model should identify customers at risk of leaving and provide actionable insights.",
      budget: "$2,000 - $3,000",
      duration: "4 weeks",
      skills: ["Python", "Machine Learning", "Data Analysis", "scikit-learn"],
      status: "open",
      postedDate: "Posted 3 days ago",
      location: "Remote",
      applicants: 12,
      employerId: "emp-1",
    },
    {
      id: "proj-2",
      title: "Natural Language Processing for Sentiment Analysis",
      company: "DataInsight",
      companyLogo: "/placeholder.svg?height=40&width=40",
      description:
        "Create a sentiment analysis tool that can analyze customer reviews and social media mentions to determine sentiment towards our brand and products.",
      budget: "$3,500 - $5,000",
      duration: "6 weeks",
      skills: ["NLP", "Python", "Deep Learning", "BERT"],
      status: "applied",
      postedDate: "Applied on May 15, 2025",
      location: "Remote",
      applicants: 8,
      employerId: "emp-2",
      timeline: [
        {
          id: "event-1",
          date: "May 15, 2025",
          title: "Application Submitted",
          description: "You submitted your application for this project.",
          type: "application",
          completed: true,
        },
        {
          id: "event-2",
          date: "May 16, 2025",
          title: "Application Reviewed",
          description: "Your application was reviewed by the client.",
          type: "application",
          completed: true,
        },
        {
          id: "event-3",
          date: "May 18, 2025",
          title: "Interview Scheduled",
          description: "The client has scheduled an interview with you.",
          type: "interview",
          completed: false,
        },
      ],
    },
    {
      id: "proj-3",
      title: "Computer Vision for Retail Analytics",
      company: "RetailTech Solutions",
      companyLogo: "/placeholder.svg?height=40&width=40",
      description:
        "Implement a computer vision system that can analyze in-store customer behavior, track foot traffic, and provide insights for store layout optimization.",
      budget: "$4,000 - $6,000",
      duration: "8 weeks",
      skills: ["Computer Vision", "Python", "TensorFlow", "OpenCV"],
      status: "interview",
      postedDate: "Interview on May 20, 2025",
      location: "San Francisco, CA (Hybrid)",
      applicants: 15,
      employerId: "emp-3",
      timeline: [
        {
          id: "event-1",
          date: "May 10, 2025",
          title: "Application Submitted",
          description: "You submitted your application for this project.",
          type: "application",
          completed: true,
        },
        {
          id: "event-2",
          date: "May 12, 2025",
          title: "Application Reviewed",
          description: "Your application was reviewed by the client.",
          type: "application",
          completed: true,
        },
        {
          id: "event-3",
          date: "May 15, 2025",
          title: "Initial Message",
          description: "The client sent you a message to discuss your experience.",
          type: "message",
          completed: true,
        },
        {
          id: "event-4",
          date: "May 20, 2025 - 2:00 PM",
          title: "Interview Scheduled",
          description: "Technical interview to discuss project approach and timeline.",
          type: "interview",
          completed: false,
        },
      ],
    },
    {
      id: "proj-4",
      title: "Data Pipeline for E-commerce Analytics",
      company: "ShopSmart",
      companyLogo: "/placeholder.svg?height=40&width=40",
      description:
        "Design and implement a data pipeline that collects, processes, and analyzes e-commerce data to provide actionable insights for marketing and product teams.",
      budget: "$5,000 - $7,000",
      duration: "10 weeks",
      skills: ["Data Engineering", "Python", "SQL", "Apache Airflow", "AWS"],
      status: "accepted",
      postedDate: "Accepted on May 5, 2025",
      location: "Remote",
      applicants: 20,
      employerId: "emp-4",
      timeline: [
        {
          id: "event-1",
          date: "April 25, 2025",
          title: "Application Submitted",
          description: "You submitted your application for this project.",
          type: "application",
          completed: true,
        },
        {
          id: "event-2",
          date: "April 27, 2025",
          title: "Application Reviewed",
          description: "Your application was reviewed by the client.",
          type: "application",
          completed: true,
        },
        {
          id: "event-3",
          date: "April 30, 2025",
          title: "Interview Completed",
          description: "You completed a technical interview with the client.",
          type: "interview",
          completed: true,
        },
        {
          id: "event-4",
          date: "May 2, 2025",
          title: "NDA Signed",
          description: "You signed the Non-Disclosure Agreement.",
          type: "document",
          completed: true,
        },
        {
          id: "event-5",
          date: "May 5, 2025",
          title: "Project Accepted",
          description: "You were selected for this project. Congratulations!",
          type: "acceptance",
          completed: true,
        },
        {
          id: "event-6",
          date: "May 10, 2025",
          title: "Project Kickoff",
          description: "Project kickoff meeting scheduled.",
          type: "interview",
          completed: false,
        },
      ],
    },
    {
      id: "proj-5",
      title: "Recommendation System for Streaming Platform",
      company: "StreamFlix",
      companyLogo: "/placeholder.svg?height=40&width=40",
      description:
        "Develop a recommendation system that suggests content to users based on their viewing history, preferences, and similar user behavior.",
      budget: "$6,000 - $8,000",
      duration: "12 weeks",
      skills: ["Recommendation Systems", "Python", "Machine Learning", "Collaborative Filtering"],
      status: "completed",
      postedDate: "Completed on April 15, 2025",
      location: "Remote",
      applicants: 18,
      employerId: "emp-5",
      timeline: [
        {
          id: "event-1",
          date: "January 10, 2025",
          title: "Application Submitted",
          description: "You submitted your application for this project.",
          type: "application",
          completed: true,
        },
        {
          id: "event-2",
          date: "January 12, 2025",
          title: "Application Reviewed",
          description: "Your application was reviewed by the client.",
          type: "application",
          completed: true,
        },
        {
          id: "event-3",
          date: "January 15, 2025",
          title: "Interview Completed",
          description: "You completed a technical interview with the client.",
          type: "interview",
          completed: true,
        },
        {
          id: "event-4",
          date: "January 18, 2025",
          title: "NDA Signed",
          description: "You signed the Non-Disclosure Agreement.",
          type: "document",
          completed: true,
        },
        {
          id: "event-5",
          date: "January 20, 2025",
          title: "Project Accepted",
          description: "You were selected for this project.",
          type: "acceptance",
          completed: true,
        },
        {
          id: "event-6",
          date: "April 10, 2025",
          title: "Project Completed",
          description: "You successfully completed the project.",
          type: "acceptance",
          completed: true,
        },
        {
          id: "event-7",
          date: "April 15, 2025",
          title: "Payment Received",
          description: "Final payment for the project was processed.",
          type: "payment",
          completed: true,
        },
      ],
    },
    {
      id: "proj-6",
      title: "AI-Powered Chatbot for Customer Support",
      company: "ServiceNow Inc.",
      companyLogo: "/placeholder.svg?height=40&width=40",
      description:
        "Build an AI-powered chatbot that can handle customer inquiries, troubleshoot common issues, and escalate complex problems to human agents when necessary.",
      budget: "$4,500 - $6,500",
      duration: "8 weeks",
      skills: ["NLP", "Python", "Machine Learning", "Chatbot Development", "API Integration"],
      status: "open",
      postedDate: "Posted 1 week ago",
      location: "Remote",
      applicants: 9,
      employerId: "emp-6",
    },
  ]

  // Handle withdraw application
  const handleWithdrawApplication = (projectId: string) => {
    // Show confirmation dialog
    if (confirm("Are you sure you want to withdraw your application?")) {
      // Remove the project from userApplications
      setUserApplications(userApplications.filter((project) => project.id !== projectId))

      // Show success message
      alert("Application withdrawn successfully!")
    }
  }

  // Handle view application
  const handleViewApplication = (project: Project) => {
    // In a real app, we would fetch the application details from the server
    // For now, we'll create a dummy application
    const application: ProjectApplication = {
      id: `app-${project.id}`,
      projectId: project.id,
      userId: user?.id || "",
      coverLetter: `I am writing to express my interest in the ${project.title} position. With my background in ${project.skills.join(", ")}, I believe I am well-qualified for this role.`,
      proposedRate: project.budget.split(" - ")[0].replace("$", ""),
      estimatedDuration: project.duration,
      status: "pending",
      submittedDate: project.postedDate.replace("Applied on ", ""),
    }

    setViewedApplication(application)
    setShowViewApplicationDialog(true)
  }

  // Filter projects based on search query and skills
  const filteredProjects = projects
    .filter((p) => p.status === "open")
    .filter((p) => {
      if (!searchQuery) return true

      const query = searchQuery.toLowerCase()
      return (
        p.title.toLowerCase().includes(query) ||
        p.company.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.skills.some((skill) => skill.toLowerCase().includes(query))
      )
    })
    .filter((p) => {
      if (filterSkills.length === 0) return true
      return filterSkills.every((skill) => p.skills.includes(skill))
    })

  // Check if a project is in userApplications
  const isProjectApplied = (projectId: string) => {
    return userApplications.some((app) => app.id === projectId)
  }

  const interviewProjects = projects.filter((p) => p.status === "interview")
  const activeProjects = projects.filter((p) => p.status === "accepted")
  const completedProjects = projects.filter((p) => p.status === "completed")

  const appliedProjects = userApplications

  // Function to get status badge
  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500">Open</Badge>
      case "applied":
        return <Badge className="bg-yellow-500">Applied</Badge>
      case "interview":
        return <Badge className="bg-purple-500">Interview</Badge>
      case "accepted":
        return <Badge className="bg-green-500">Active</Badge>
      case "completed":
        return <Badge className="bg-gray-500">Completed</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
    }
  }

  // Function to get timeline icon
  const getTimelineIcon = (type: TimelineEvent["type"], completed: boolean) => {
    if (completed) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-500">
          <CheckCircle className="h-5 w-5" />
        </div>
      )
    }

    switch (type) {
      case "application":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
            <FileText className="h-5 w-5" />
          </div>
        )
      case "message":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
            <MessageSquare className="h-5 w-5" />
          </div>
        )
      case "interview":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-500">
            <Calendar className="h-5 w-5" />
          </div>
        )
      case "document":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-orange-500">
            <FileText className="h-5 w-5" />
          </div>
        )
      case "acceptance":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-500">
            <Check className="h-5 w-5" />
          </div>
        )
      case "payment":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-500">
            <DollarSign className="h-5 w-5" />
          </div>
        )
    }
  }

  // Handle apply to project
  const handleApplyToProject = (project: Project) => {
    setActiveProject(project)

    // Pre-fill application data from user profile
    setApplicationData({
      projectId: project.id,
      userId: user?.id || "",
      coverLetter: `I am writing to express my interest in the ${project.title} position. With my background in ${project.skills.join(", ")}, I believe I am well-qualified for this role.`,
      proposedRate: project.budget.split(" - ")[0].replace("$", ""),
      estimatedDuration: project.duration,
      status: "pending",
      submittedDate: new Date().toISOString().split("T")[0],
    })

    setShowApplicationDialog(true)
  }

  // Handle submit application
  const handleSubmitApplication = () => {
    if (!activeProject) return

    // Create a copy of the active project with status changed to "applied"
    const appliedProject = {
      ...activeProject,
      status: "applied" as ProjectStatus,
      postedDate: `Applied on ${new Date().toISOString().split("T")[0]}`,
    }

    // Add to userApplications
    setUserApplications([...userApplications, appliedProject])

    // Close the dialog
    setShowApplicationDialog(false)

    // Show success message
    alert("Your application has been submitted successfully!")

    // Redirect to the applied tab
    document.querySelector('[data-value="applied"]')?.click()
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Freelance Projects</h1>
            <p className="text-muted-foreground">Find and manage AI and data science freelance projects</p>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2" asChild>
              <a href="/profile">
                <FileText className="h-4 w-4" />
                View Profile
              </a>
            </Button>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects by title, skills, or company..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Projects</DialogTitle>
                <DialogDescription>Filter projects by skills, budget, and more</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Python",
                      "Machine Learning",
                      "Data Analysis",
                      "NLP",
                      "Deep Learning",
                      "Computer Vision",
                      "Data Engineering",
                      "SQL",
                      "AWS",
                    ].map((skill) => (
                      <Badge
                        key={skill}
                        variant={filterSkills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          if (filterSkills.includes(skill)) {
                            setFilterSkills(filterSkills.filter((s) => s !== skill))
                          } else {
                            setFilterSkills([...filterSkills, skill])
                          }
                        }}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="all">All Locations</option>
                    <option value="remote">Remote Only</option>
                    <option value="onsite">Onsite Only</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Budget Range</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" placeholder="Min" />
                    <Input type="number" placeholder="Max" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Duration</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="all">Any Duration</option>
                    <option value="short">Less than 1 month</option>
                    <option value="medium">1-3 months</option>
                    <option value="long">3+ months</option>
                  </select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setFilterSkills([])}>
                  Reset Filters
                </Button>
                <Button>Apply Filters</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        {/* Main Content */}
        <Tabs defaultValue="browse">
          <TabsList className="mb-4">
            <TabsTrigger value="browse">Browse Projects</TabsTrigger>
            <TabsTrigger value="applied">Applied ({appliedProjects.length})</TabsTrigger>
            <TabsTrigger value="interview">Interviews ({interviewProjects.length})</TabsTrigger>
            <TabsTrigger value="active" className="relative">
              Active ({activeProjects.length})
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                NDA
              </span>
            </TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedProjects.length})</TabsTrigger>
          </TabsList>

          {/* Browse Projects Tab */}
          <TabsContent value="browse" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => {
                const isApplied = isProjectApplied(project.id)
                return (
                  <Card key={project.id} className="flex flex-col h-full">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={project.companyLogo} alt={project.company} />
                            <AvatarFallback>{project.company.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{project.title}</CardTitle>
                            <CardDescription className="text-xs">
                              {project.company} • {project.postedDate}
                            </CardDescription>
                          </div>
                        </div>
                        {isApplied ? <Badge className="bg-yellow-500">Applied</Badge> : getStatusBadge(project.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {project.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {project.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="font-medium">Budget</p>
                          <p className="text-muted-foreground">{project.budget}</p>
                        </div>
                        <div>
                          <p className="font-medium">Duration</p>
                          <p className="text-muted-foreground">{project.duration}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{project.location}</span>
                        <span className="mx-1">•</span>
                        <Users className="h-3 w-3" />
                        <span>{project.applicants} applicants</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      {isApplied ? (
                        <Button
                          className="w-full"
                          size="sm"
                          variant="destructive"
                          onClick={() => handleWithdrawApplication(project.id)}
                        >
                          Withdraw Application
                        </Button>
                      ) : (
                        <Button className="w-full" size="sm" onClick={() => handleApplyToProject(project)}>
                          Apply Now
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
            {filteredProjects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No projects found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </TabsContent>

          {/* Applied Projects Tab */}
          <TabsContent value="applied" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appliedProjects.map((project) => (
                <Card key={project.id} className="flex flex-col h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={project.companyLogo} alt={project.company} />
                          <AvatarFallback>{project.company.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{project.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {project.company} • {project.postedDate}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                    {/* Timeline Preview */}
                    {project.timeline && (
                      <div className="mt-3">
                        <h3 className="text-xs font-medium mb-2">Application Status</h3>
                        <div className="flex items-center gap-2">
                          {project.timeline.slice(-1).map((event) => (
                            <div key={event.id} className="flex items-center gap-2 text-xs">
                              {getTimelineIcon(event.type, event.completed)}
                              <div>
                                <p className="font-medium">{event.title}</p>
                                <p className="text-muted-foreground">{event.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewApplication(project)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleWithdrawApplication(project.id)}
                    >
                      Withdraw
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {appliedProjects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No applications yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Browse projects and submit applications to see them here
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => document.querySelector('[data-value="browse"]')?.click()}
                >
                  Browse Projects
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Interview Projects Tab */}
          <TabsContent value="interview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interviewProjects.map((project) => (
                <Card key={project.id} className="flex flex-col h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={project.companyLogo} alt={project.company} />
                          <AvatarFallback>{project.company.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{project.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {project.company} • {project.postedDate}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                    {/* Interview Details */}
                    {project.timeline && project.timeline.find((e) => e.type === "interview" && !e.completed) && (
                      <div className="mt-3 p-2 bg-purple-500/10 rounded-md">
                        <h3 className="text-xs font-medium text-purple-700 dark:text-purple-300">Upcoming Interview</h3>
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          <Calendar className="h-3 w-3 text-purple-500" />
                          <span>{project.timeline.find((e) => e.type === "interview" && !e.completed)?.date}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewApplication(project)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setActiveProject(project)
                        setShowInterviewDialog(true)
                      }}
                    >
                      Manage Interview
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {interviewProjects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No interviews scheduled</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  When clients schedule interviews with you, they'll appear here
                </p>
              </div>
            )}
          </TabsContent>

          {/* Active Projects Tab */}
          <TabsContent value="active" className="space-y-4">
            <Card className="border-2 border-orange-500 mb-4">
              <CardHeader className="bg-orange-500/10 pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-5 w-5" />
                  NDA Signing Required
                </CardTitle>
                <CardDescription>You need to sign an NDA to proceed with your active projects</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 pb-2">
                <div className="mb-4">
                  <h3 className="text-sm font-medium">NDA Signing Progress</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex flex-1 items-center">
                      <div className="h-2 w-1/3 rounded-l-full bg-green-500"></div>
                      <div className="h-2 w-1/3 bg-green-500"></div>
                      <div className="h-2 w-1/3 rounded-r-full bg-muted"></div>
                    </div>
                    <span className="text-xs font-medium">2/3 Steps</span>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>Review</span>
                    <span>Fill Details</span>
                    <span>Sign</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    setActiveProject(activeProjects[0])
                    setShowNdaDialog(true)
                    // Auto-navigate to the sign tab
                    setTimeout(() => {
                      document.querySelector('[data-value="sign"]')?.click()
                    }, 100)
                  }}
                >
                  Complete NDA Now
                </Button>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeProjects.map((project) => (
                <Card key={project.id} className="flex flex-col h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={project.companyLogo} alt={project.company} />
                          <AvatarFallback>{project.company.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{project.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {project.company} • {project.postedDate}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow pb-2">
                    {/* Project Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <h3 className="font-medium">Project Progress</h3>
                        <span className="font-medium">40%</span>
                      </div>
                      <Progress value={40} className="mt-1 h-2" />
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                    {/* Next Milestone */}
                    {project.timeline && project.timeline.find((e) => !e.completed) && (
                      <div className="mt-3 p-2 bg-blue-500/10 rounded-md">
                        <h3 className="text-xs font-medium text-blue-700 dark:text-blue-300">Next Milestone</h3>
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          <Clock className="h-3 w-3 text-blue-500" />
                          <span>
                            {project.timeline.find((e) => !e.completed)?.title} -{" "}
                            {project.timeline.find((e) => !e.completed)?.date}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Project Dashboard
                    </Button>
                    <Button size="sm" className="flex-1">
                      Submit Deliverable
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {activeProjects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No active projects</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  When your applications are accepted, active projects will appear here
                </p>
              </div>
            )}
          </TabsContent>

          {/* Completed Projects Tab */}
          <TabsContent value="completed" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedProjects.map((project) => (
                <Card key={project.id} className="flex flex-col h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={project.companyLogo} alt={project.company} />
                          <AvatarFallback>{project.company.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{project.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {project.company} • {project.postedDate}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow pb-2">
                    {/* Project Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <h3 className="font-medium">Project Progress</h3>
                        <span className="font-medium">100%</span>
                      </div>
                      <Progress value={100} className="mt-1 h-2" />
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                    {/* Completion Info */}
                    {project.timeline && project.timeline.find((e) => e.type === "payment" && e.completed) && (
                      <div className="mt-3 p-2 bg-green-500/10 rounded-md">
                        <h3 className="text-xs font-medium text-green-700 dark:text-green-300">Project Completed</h3>
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          <DollarSign className="h-3 w-3 text-green-500" />
                          <span>
                            Payment received on{" "}
                            {project.timeline.find((e) => e.type === "payment" && e.completed)?.date}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewApplication(project)}
                    >
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Add to Portfolio
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {completedProjects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No completed projects</h3>
                <p className="mt-2 text-sm text-muted-foreground">Your completed projects will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* NDA Dialog */}
      <Dialog open={showNdaDialog} onOpenChange={setShowNdaDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Non-Disclosure Agreement</DialogTitle>
            <DialogDescription>Please review and complete the NDA form to proceed with the project.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="sign" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="review">1. Review</TabsTrigger>
              <TabsTrigger value="fill">2. Fill Details</TabsTrigger>
              <TabsTrigger value="sign">3. Sign</TabsTrigger>
            </TabsList>

            <TabsContent value="review" className="mt-4">
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold">NON-DISCLOSURE AGREEMENT</h3>
                  <p>This Non-Disclosure Agreement (the "Agreement") is entered into by and between:</p>
                  <p>
                    <strong>Company:</strong> {activeProject?.company} ("Disclosing Party")
                  </p>
                  <p>
                    <strong>Freelancer:</strong> {user?.name} ("Receiving Party")
                  </p>

                  <h4 className="text-md font-bold">1. Purpose</h4>
                  <p>
                    The Receiving Party acknowledges that in connection with the project "{activeProject?.title}" (the
                    "Project"), the Receiving Party will have access to certain confidential and proprietary information
                    of the Disclosing Party.
                  </p>

                  <h4 className="text-md font-bold">2. Confidential Information</h4>
                  <p>
                    For purposes of this Agreement, "Confidential Information" means any data or information that is
                    proprietary to the Disclosing Party and not generally known to the public, whether in tangible or
                    intangible form, including, but not limited to:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>Business strategies, plans, and practices</li>
                    <li>Research, development, and technical information</li>
                    <li>Software, algorithms, and data models</li>
                    <li>Customer lists and information</li>
                    <li>Financial information and projections</li>
                    <li>Marketing strategies and plans</li>
                    <li>Personnel information</li>
                  </ul>

                  <h4 className="text-md font-bold">3. Obligations of Receiving Party</h4>
                  <p>The Receiving Party agrees to:</p>
                  <ul className="list-disc pl-6">
                    <li>Maintain the confidentiality of all Confidential Information</li>
                    <li>Use the Confidential Information solely for the purpose of the Project</li>
                    <li>Not disclose any Confidential Information to any third party</li>
                    <li>Take all reasonable measures to protect the secrecy of the Confidential Information</li>
                  </ul>

                  <h4 className="text-md font-bold">4. Term</h4>
                  <p>
                    The obligations of the Receiving Party under this Agreement shall survive the completion of the
                    Project and shall remain in effect for a period of three (3) years from the date of this Agreement.
                  </p>

                  <h4 className="text-md font-bold">5. Governing Law</h4>
                  <p>
                    This Agreement shall be governed by and construed in accordance with the laws of the State of New
                    York.
                  </p>
                </div>
              </ScrollArea>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => document.querySelector('[data-value="fill"]')?.click()}>
                  Continue to Fill Details
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="fill" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Legal Name</Label>
                    <Input id="full-name" placeholder="Your full legal name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name (if applicable)</Label>
                    <Input id="company-name" placeholder="Your company name" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Legal Address</Label>
                    <Input id="address" placeholder="Your legal address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Your email address" defaultValue={user?.email} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Your phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="effective-date">Effective Date</Label>
                    <Input id="effective-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-description">Project Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="Brief description of the project scope"
                    defaultValue={activeProject?.description}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Confidentiality Period</Label>
                  <div className="flex items-center gap-4">
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="1">1 year</option>
                      <option value="2">2 years</option>
                      <option value="3" selected>
                        3 years
                      </option>
                      <option value="5">5 years</option>
                      <option value="perpetual">Perpetual</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Additional Terms</Label>
                  <Textarea placeholder="Any additional terms or conditions" />
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <Button variant="outline" onClick={() => document.querySelector('[data-value="review"]')?.click()}>
                  Back to Review
                </Button>
                <Button onClick={() => document.querySelector('[data-value="sign"]')?.click()}>Continue to Sign</Button>
              </div>
            </TabsContent>

            <TabsContent value="sign" className="mt-4">
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium">Agreement Confirmation</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    By signing this Non-Disclosure Agreement, I acknowledge that I have read, understand, and agree to
                    be bound by all the terms and conditions outlined in this agreement.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signature">Digital Signature</Label>
                  <div className="h-40 rounded-md border border-dashed p-2">
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Draw your signature below</p>
                        <canvas
                          id="signature-pad"
                          className="mt-2 h-24 w-full cursor-crosshair rounded border"
                        ></canvas>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            const canvas = document.getElementById("signature-pad") as HTMLCanvasElement
                            if (canvas) {
                              const ctx = canvas.getContext("2d")
                              if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
                            }
                          }}
                        >
                          Clear Signature
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sign-name">Type Your Full Name</Label>
                    <Input id="sign-name" placeholder="Your full legal name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sign-date">Date of Signing</Label>
                    <Input id="sign-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="agree-terms" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="agree-terms" className="text-sm">
                    I confirm that I am authorized to enter into this agreement and that the information provided is
                    accurate.
                  </Label>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <Button variant="outline" onClick={() => document.querySelector('[data-value="fill"]')?.click()}>
                  Back to Fill Details
                </Button>
                <Button
                  onClick={() => {
                    // In a real app, this would submit the NDA
                    setShowNdaDialog(false)
                    // Show success notification
                    alert("NDA successfully signed and submitted!")
                  }}
                >
                  Submit Signed NDA
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Interview Dialog */}
      <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Interview</DialogTitle>
            <DialogDescription>Schedule or reschedule your interview for {activeProject?.title}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interview-date">Interview Date</Label>
              <Input id="interview-date" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interview-time">Interview Time</Label>
              <Input id="interview-time" type="time" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interview-method">Interview Method</Label>
              <select
                id="interview-method"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="video">Video Call</option>
                <option value="audio">Audio Call</option>
                <option value="in-person">In-Person</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interview-notes">Notes or Questions</Label>
              <Textarea id="interview-notes" placeholder="Add any notes or questions for the interviewer" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterviewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowInterviewDialog(false)}>Confirm Interview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Application Dialog */}
      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Apply for Project</DialogTitle>
            <DialogDescription>Submit your application for {activeProject?.title}</DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-180px)]">
            <div className="space-y-6 p-1">
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={activeProject?.companyLogo} alt={activeProject?.company} />
                    <AvatarFallback>{activeProject?.company?.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{activeProject?.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-3 w-3" />
                      <span>{activeProject?.company}</span>
                      <span>•</span>
                      <MapPin className="h-3 w-3" />
                      <span>{activeProject?.location}</span>
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Budget</p>
                    <p className="text-muted-foreground">{activeProject?.budget}</p>
                  </div>
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-muted-foreground">{activeProject?.duration}</p>
                  </div>
                  <div>
                    <p className="font-medium">Skills Required</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {activeProject?.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cover-letter">Cover Letter</Label>
                  <Textarea
                    id="cover-letter"
                    placeholder="Introduce yourself and explain why you're a good fit for this project"
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                    className="min-h-[200px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="proposed-rate">Proposed Rate ($)</Label>
                    <Input
                      id="proposed-rate"
                      type="text"
                      placeholder="Your proposed rate"
                      value={applicationData.proposedRate}
                      onChange={(e) => setApplicationData({ ...applicationData, proposedRate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimated-duration">Estimated Duration</Label>
                    <Input
                      id="estimated-duration"
                      type="text"
                      placeholder="How long will it take you to complete this project"
                      value={applicationData.estimatedDuration}
                      onChange={(e) => setApplicationData({ ...applicationData, estimatedDuration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio-link">Portfolio Link (Optional)</Label>
                  <Input id="portfolio-link" type="url" placeholder="Link to your portfolio or relevant work" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional-info">Additional Information (Optional)</Label>
                  <Textarea id="additional-info" placeholder="Any additional information you'd like to share" />
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowApplicationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitApplication}>Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Application Dialog */}
      <Dialog open={showViewApplicationDialog} onOpenChange={setShowViewApplicationDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Your application for {projects.find((p) => p.id === viewedApplication?.projectId)?.title}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6 p-1">
              <div className="rounded-md border p-4">
                <div className="flex items-center gap-4">
                  {(() => {
                    const project = projects.find((p) => p.id === viewedApplication?.projectId)
                    return (
                      <>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={project?.companyLogo} alt={project?.company} />
                          <AvatarFallback>{project?.company?.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{project?.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building className="h-3 w-3" />
                            <span>{project?.company}</span>
                            <span>•</span>
                            <MapPin className="h-3 w-3" />
                            <span>{project?.location}</span>
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Application Status</h3>
                  <Badge>{viewedApplication?.status}</Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Submitted Date</h3>
                  <p className="text-sm text-muted-foreground">{viewedApplication?.submittedDate}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-1">Cover Letter</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{viewedApplication?.coverLetter}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Proposed Rate</h3>
                    <p className="text-sm text-muted-foreground">${viewedApplication?.proposedRate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Estimated Duration</h3>
                    <p className="text-sm text-muted-foreground">{viewedApplication?.estimatedDuration}</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowViewApplicationDialog(false)}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleWithdrawApplication(viewedApplication?.projectId || "")
                setShowViewApplicationDialog(false)
              }}
            >
              Withdraw Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

