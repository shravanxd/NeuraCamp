"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Briefcase, Calendar, Clock, FileText, Filter, MapPin, Search, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { auth, type User } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  hasApplied,
  removeApplication,
  saveApplication,
  getUserApplications,
  type JobApplication,
} from "@/lib/job-applications"

// Define job types
type Job = {
  id: string
  title: string
  company: string
  companyLogo: string
  location: string
  employmentType: string
  salary: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  skills: string[]
  postedDate: string
  applicationDeadline: string
  companyDescription: string
  companySize: string
  companyIndustry: string
  companyWebsite: string
}

// Sample job data
const jobsData = [
  {
    id: "job-1",
    title: "Machine Learning Engineer",
    company: "TechCorp AI",
    companyLogo: "/placeholder.svg?height=40&width=40",
    location: "San Francisco, CA (Remote)",
    employmentType: "Full-time",
    salary: "$120,000 - $160,000",
    description:
      "We're looking for a Machine Learning Engineer to join our AI team. You'll work on developing and deploying machine learning models for our products.",
    requirements: [
      "Bachelor's degree in Computer Science, Engineering, or related field",
      "3+ years of experience in machine learning or related field",
      "Proficiency in Python and machine learning frameworks (TensorFlow, PyTorch)",
      "Experience with deep learning and neural networks",
      "Strong understanding of mathematics and statistics",
    ],
    responsibilities: [
      "Develop and implement machine learning algorithms",
      "Train and optimize machine learning models",
      "Collaborate with cross-functional teams to integrate ML solutions",
      "Stay up-to-date with the latest ML research and technologies",
      "Contribute to the improvement of our ML infrastructure",
    ],
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "Flexible work schedule",
      "Remote work options",
      "Professional development budget",
    ],
    skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "Neural Networks"],
    postedDate: "2023-03-10",
    applicationDeadline: "2023-04-10",
    companyDescription:
      "TechCorp AI is a leading AI research and development company focused on building cutting-edge machine learning solutions.",
    companySize: "50-200 employees",
    companyIndustry: "Artificial Intelligence",
    companyWebsite: "https://techcorpai.example.com",
  },
  {
    id: "job-2",
    title: "Data Scientist",
    company: "DataViz Analytics",
    companyLogo: "/placeholder.svg?height=40&width=40",
    location: "New York, NY (Hybrid)",
    employmentType: "Full-time",
    salary: "$110,000 - $140,000",
    description:
      "Join our data science team to analyze complex datasets and extract valuable insights for our clients in the finance industry.",
    requirements: [
      "Master's degree in Statistics, Mathematics, Computer Science, or related field",
      "2+ years of experience in data science or related field",
      "Proficiency in Python, R, and SQL",
      "Experience with data visualization tools (Tableau, Power BI)",
      "Strong analytical and problem-solving skills",
    ],
    responsibilities: [
      "Analyze large datasets to identify patterns and trends",
      "Develop predictive models and algorithms",
      "Create data visualizations and reports",
      "Collaborate with stakeholders to understand business requirements",
      "Present findings and recommendations to non-technical audiences",
    ],
    benefits: [
      "Competitive salary and bonus",
      "Comprehensive health benefits",
      "401(k) matching",
      "Flexible work arrangements",
      "Professional development opportunities",
    ],
    skills: ["Python", "R", "SQL", "Data Analysis", "Statistics", "Machine Learning", "Data Visualization"],
    postedDate: "2023-03-15",
    applicationDeadline: "2023-04-15",
    companyDescription:
      "DataViz Analytics specializes in data analysis and visualization solutions for the finance industry.",
    companySize: "100-500 employees",
    companyIndustry: "Data Analytics",
    companyWebsite: "https://datavizanalytics.example.com",
  },
  {
    id: "job-3",
    title: "AI Research Scientist",
    company: "NeuraTech",
    companyLogo: "/placeholder.svg?height=40&width=40",
    location: "Boston, MA (On-site)",
    employmentType: "Full-time",
    salary: "$130,000 - $180,000",
    description:
      "We're seeking an AI Research Scientist to push the boundaries of artificial intelligence and develop novel algorithms for our cutting-edge products.",
    requirements: [
      "Ph.D. in Computer Science, AI, or related field",
      "Strong publication record in top AI conferences (NeurIPS, ICML, ICLR)",
      "Experience with reinforcement learning, natural language processing, or computer vision",
      "Proficiency in Python and deep learning frameworks",
      "Ability to implement and extend state-of-the-art AI algorithms",
    ],
    responsibilities: [
      "Conduct original research in artificial intelligence",
      "Publish papers in top-tier conferences and journals",
      "Develop prototypes and proof-of-concepts",
      "Collaborate with engineering teams to implement research findings",
      "Stay current with the latest advancements in AI research",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health benefits",
      "Flexible work hours",
      "Conference attendance budget",
      "Research lab resources",
    ],
    skills: [
      "Artificial Intelligence",
      "Machine Learning",
      "Deep Learning",
      "Reinforcement Learning",
      "Natural Language Processing",
      "Computer Vision",
      "Python",
    ],
    postedDate: "2023-03-05",
    applicationDeadline: "2023-04-05",
    companyDescription:
      "NeuraTech is a research-driven AI company focused on developing next-generation artificial intelligence technologies.",
    companySize: "20-50 employees",
    companyIndustry: "Artificial Intelligence Research",
    companyWebsite: "https://neuratech.example.com",
  },
  {
    id: "job-4",
    title: "Data Engineer",
    company: "CloudScale Systems",
    companyLogo: "/placeholder.svg?height=40&width=40",
    location: "Seattle, WA (Remote)",
    employmentType: "Full-time",
    salary: "$115,000 - $145,000",
    description:
      "We're looking for a Data Engineer to design and build data pipelines and infrastructure for our cloud-based analytics platform.",
    requirements: [
      "Bachelor's degree in Computer Science, Engineering, or related field",
      "3+ years of experience in data engineering",
      "Proficiency in Python, SQL, and big data technologies (Spark, Hadoop)",
      "Experience with cloud platforms (AWS, GCP, Azure)",
      "Knowledge of data warehousing and ETL processes",
    ],
    responsibilities: [
      "Design and implement data pipelines",
      "Build and maintain data infrastructure",
      "Optimize data storage and retrieval systems",
      "Ensure data quality and reliability",
      "Collaborate with data scientists and analysts",
    ],
    benefits: [
      "Competitive salary",
      "Health, dental, and vision insurance",
      "401(k) with company match",
      "Remote work flexibility",
      "Professional development budget",
    ],
    skills: ["Python", "SQL", "Apache Spark", "Hadoop", "AWS", "ETL", "Data Warehousing"],
    postedDate: "2023-03-12",
    applicationDeadline: "2023-04-12",
    companyDescription:
      "CloudScale Systems provides cloud-based data infrastructure and analytics solutions for enterprises.",
    companySize: "100-500 employees",
    companyIndustry: "Cloud Computing",
    companyWebsite: "https://cloudscalesystems.example.com",
  },
  {
    id: "job-5",
    title: "Computer Vision Engineer",
    company: "VisualAI",
    companyLogo: "/placeholder.svg?height=40&width=40",
    location: "Austin, TX (Hybrid)",
    employmentType: "Full-time",
    salary: "$125,000 - $155,000",
    description:
      "Join our team to develop state-of-the-art computer vision algorithms for autonomous systems and image recognition applications.",
    requirements: [
      "Master's or Ph.D. in Computer Science, Computer Vision, or related field",
      "2+ years of experience in computer vision",
      "Proficiency in Python and C++",
      "Experience with OpenCV, TensorFlow, or PyTorch",
      "Strong understanding of image processing and deep learning",
    ],
    responsibilities: [
      "Develop and implement computer vision algorithms",
      "Train and optimize deep learning models for image recognition",
      "Evaluate and benchmark vision systems",
      "Collaborate with hardware teams for deployment",
      "Stay current with the latest computer vision research",
    ],
    benefits: [
      "Competitive salary and equity",
      "Comprehensive health benefits",
      "Flexible work arrangements",
      "Professional development opportunities",
      "Modern office with state-of-the-art equipment",
    ],
    skills: ["Computer Vision", "Python", "C++", "OpenCV", "TensorFlow", "PyTorch", "Deep Learning"],
    postedDate: "2023-03-08",
    applicationDeadline: "2023-04-08",
    companyDescription:
      "VisualAI develops computer vision solutions for autonomous systems, security, and consumer applications.",
    companySize: "50-200 employees",
    companyIndustry: "Computer Vision",
    companyWebsite: "https://visualai.example.com",
  },
  {
    id: "job-6",
    title: "NLP Engineer",
    company: "LanguageTech",
    companyLogo: "/placeholder.svg?height=40&width=40",
    location: "Remote (US)",
    employmentType: "Full-time",
    salary: "$120,000 - $150,000",
    description:
      "We're seeking an NLP Engineer to develop natural language processing solutions for our conversational AI platform.",
    requirements: [
      "Master's degree in Computer Science, Computational Linguistics, or related field",
      "3+ years of experience in NLP",
      "Proficiency in Python and NLP libraries (NLTK, spaCy, Hugging Face)",
      "Experience with transformer models (BERT, GPT)",
      "Strong understanding of linguistics and language models",
    ],
    responsibilities: [
      "Develop and implement NLP algorithms",
      "Train and fine-tune language models",
      "Build and improve text classification and generation systems",
      "Evaluate and benchmark NLP models",
      "Collaborate with product teams to integrate NLP solutions",
    ],
    benefits: [
      "Competitive salary",
      "Health, dental, and vision insurance",
      "Fully remote work environment",
      "Flexible work hours",
      "Professional development budget",
    ],
    skills: [
      "Natural Language Processing",
      "Python",
      "NLTK",
      "spaCy",
      "Hugging Face",
      "BERT",
      "GPT",
      "Machine Learning",
    ],
    postedDate: "2023-03-14",
    applicationDeadline: "2023-04-14",
    companyDescription:
      "LanguageTech builds conversational AI and natural language processing solutions for businesses.",
    companySize: "20-100 employees",
    companyIndustry: "Natural Language Processing",
    companyWebsite: "https://languagetech.example.com",
  },
]

export function JobsContent() {
  const [user, setUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSkills, setFilterSkills] = useState<string[]>([])
  const [filterLocation, setFilterLocation] = useState<string>("all")
  const [userApplications, setUserApplications] = useState<JobApplication[]>([])
  const [selectedJobForApplication, setSelectedJobForApplication] = useState<Job | null>(null)
  const [showApplicationDialog, setShowApplicationDialog] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const router = useRouter()

  // Get all unique skills from jobs
  const allSkills = Array.from(new Set(jobsData.flatMap((job) => job.skills)))

  // Get all unique locations from jobs
  const allLocations = Array.from(
    new Set(
      jobsData.map((job) => {
        if (job.location.includes("Remote")) return "Remote"
        if (job.location.includes("Hybrid")) return "Hybrid"
        return "On-site"
      }),
    ),
  )

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = auth.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      // Load user applications from localStorage
      const applications = getUserApplications(currentUser.id)
      setUserApplications(applications)
    }
  }, [])

  // Filter jobs based on search query, skills, and location
  const filteredJobs = jobsData.filter((job) => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesQuery =
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skills.some((skill) => skill.toLowerCase().includes(query))

      if (!matchesQuery) return false
    }

    // Skills filter
    if (filterSkills.length > 0) {
      const hasAllSkills = filterSkills.every((skill) => job.skills.includes(skill))
      if (!hasAllSkills) return false
    }

    // Location filter
    if (filterLocation !== "all") {
      if (filterLocation === "Remote" && !job.location.includes("Remote")) return false
      if (filterLocation === "Hybrid" && !job.location.includes("Hybrid")) return false
      if (filterLocation === "On-site" && !job.location.includes("On-site")) return false
    }

    return true
  })

  // Check if a job has been applied to
  const isJobApplied = (jobId: string) => {
    if (!user) return false
    return hasApplied(jobId, user.id)
  }

  // Get applied jobs
  const appliedJobs = jobsData.filter((job) => isJobApplied(job.id))

  // Get recommended jobs based on user skills (for demo, we'll just show jobs that match at least 2 skills)
  const userSkills = ["Python", "Machine Learning", "Data Analysis"] // In a real app, this would come from the user profile
  const recommendedJobs = jobsData
    .filter((job) => !isJobApplied(job.id)) // Don't recommend jobs the user has already applied to
    .filter((job) => {
      const matchingSkills = job.skills.filter((skill) => userSkills.includes(skill))
      return matchingSkills.length >= 2
    })
    .slice(0, 3) // Limit to 3 recommendations

  // Open application dialog
  const openApplicationDialog = (job: Job) => {
    setSelectedJobForApplication(job)
    setCoverLetter("")
    setShowApplicationDialog(true)
  }

  // Handle apply to job
  const handleApplyToJob = () => {
    if (!user || !selectedJobForApplication) return

    // Create new application
    const newApplication: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: selectedJobForApplication.id,
      userId: user.id,
      status: "pending",
      submittedDate: new Date().toISOString().split("T")[0],
      coverLetter: coverLetter,
    }

    // Save to localStorage
    saveApplication(newApplication)

    // Update state
    setUserApplications([...userApplications, newApplication])
    setShowApplicationDialog(false)

    // Show success message
    alert("Your application has been submitted successfully!")
  }

  // Handle withdraw application
  const handleWithdrawApplication = (jobId: string) => {
    if (!user) return

    // Show confirmation dialog
    if (confirm("Are you sure you want to withdraw your application?")) {
      // Remove from localStorage
      removeApplication(jobId, user.id)

      // Update state
      setUserApplications(userApplications.filter((app) => app.jobId !== jobId))

      // Show success message
      alert("Application withdrawn successfully!")
    }
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Calculate days ago from date
  const getDaysAgo = (dateString: string) => {
    const postedDate = new Date(dateString)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - postedDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Job Board</h1>
            <p className="text-muted-foreground">Find and apply to AI and data science jobs</p>
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
              placeholder="Search jobs by title, company, or skills..."
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
                <DialogTitle>Filter Jobs</DialogTitle>
                <DialogDescription>Filter jobs by skills, location, and more</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {allSkills.slice(0, 12).map((skill) => (
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
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                  >
                    <option value="all">All Locations</option>
                    <option value="Remote">Remote Only</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site Only</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Salary Range</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" placeholder="Min" />
                    <Input type="number" placeholder="Max" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="all">All Levels</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                  </select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterSkills([])
                    setFilterLocation("all")
                  }}
                >
                  Reset Filters
                </Button>
                <Button>Apply Filters</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        {/* Application Dialog */}
        <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Apply for {selectedJobForApplication?.title}</DialogTitle>
              <DialogDescription>
                Submit your application for {selectedJobForApplication?.title} at {selectedJobForApplication?.company}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={selectedJobForApplication?.companyLogo}
                      alt={selectedJobForApplication?.company}
                    />
                    <AvatarFallback>{selectedJobForApplication?.company.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedJobForApplication?.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedJobForApplication?.company} • {selectedJobForApplication?.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cover-letter">Cover Letter (Optional)</Label>
                <Textarea
                  id="cover-letter"
                  placeholder="Tell us why you're a good fit for this position..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <div className="grid gap-2">
                <Label>Resume</Label>
                <div className="p-4 border border-dashed rounded-md text-center">
                  <p className="text-sm text-muted-foreground">Your profile resume will be used for this application</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="inline-block h-3 w-3 text-green-500 mr-1">✓</span>
                    resume_john_doe_2025.pdf
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApplicationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplyToJob}>Submit Application</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Main Content */}
        <Tabs defaultValue="browse">
          <TabsList className="mb-4">
            <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="applied">Applied ({appliedJobs.length})</TabsTrigger>
          </TabsList>

          {/* Browse Jobs Tab */}
          <TabsContent value="browse" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((job) => {
                const isApplied = isJobApplied(job.id)
                const daysAgo = getDaysAgo(job.postedDate)

                return (
                  <Card
                    key={job.id}
                    className="flex flex-col h-full cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => router.push(`/jobs/${job.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={job.companyLogo} alt={job.company} />
                            <AvatarFallback>{job.company.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{job.title}</CardTitle>
                            <CardDescription className="text-xs">
                              {job.company} • Posted {daysAgo} {daysAgo === 1 ? "day" : "days"} ago
                            </CardDescription>
                          </div>
                        </div>
                        {isApplied && <Badge className="bg-green-500">Applied</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {job.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="font-medium">Salary</p>
                          <p className="text-muted-foreground">{job.salary}</p>
                        </div>
                        <div>
                          <p className="font-medium">Employment</p>
                          <p className="text-muted-foreground">{job.employmentType}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                        <span className="mx-1">•</span>
                        <Calendar className="h-3 w-3" />
                        <span>Apply by {formatDate(job.applicationDeadline)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/jobs/${job.id}`}>View Details</Link>
                      </Button>
                      {isApplied ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleWithdrawApplication(job.id)
                          }}
                        >
                          Withdraw
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            openApplicationDialog(job)
                          }}
                        >
                          Apply Now
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
            {filteredJobs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No jobs found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </TabsContent>

          {/* Recommended Jobs Tab */}
          <TabsContent value="recommended" className="space-y-4">
            <div className="mb-4">
              <h2 className="text-lg font-medium">Jobs Recommended for You</h2>
              <p className="text-sm text-muted-foreground">Based on your skills and profile</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedJobs.map((job) => {
                const isApplied = isJobApplied(job.id)
                const daysAgo = getDaysAgo(job.postedDate)

                return (
                  <Card
                    key={job.id}
                    className="flex flex-col h-full border-2 border-primary/20 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => router.push(`/jobs/${job.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={job.companyLogo} alt={job.company} />
                            <AvatarFallback>{job.company.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base">{job.title}</CardTitle>
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            </div>
                            <CardDescription className="text-xs">
                              {job.company} • Posted {daysAgo} {daysAgo === 1 ? "day" : "days"} ago
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className="bg-primary">Recommended</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {job.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="font-medium">Salary</p>
                          <p className="text-muted-foreground">{job.salary}</p>
                        </div>
                        <div>
                          <p className="font-medium">Employment</p>
                          <p className="text-muted-foreground">{job.employmentType}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                        <span className="mx-1">•</span>
                        <Calendar className="h-3 w-3" />
                        <span>Apply by {formatDate(job.applicationDeadline)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/jobs/${job.id}`}>View Details</Link>
                      </Button>
                      {isApplied ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleWithdrawApplication(job.id)
                          }}
                        >
                          Withdraw
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            openApplicationDialog(job)
                          }}
                        >
                          Apply Now
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                )
              })}
            </div>

            {recommendedJobs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Star className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No recommended jobs</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Complete your profile to get personalized job recommendations
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/profile">Update Profile</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Applied Jobs Tab */}
          <TabsContent value="applied" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appliedJobs.map((job) => {
                const application = userApplications.find((app) => app.jobId === job.id)
                const daysAgo = getDaysAgo(job.postedDate)

                return (
                  <Card
                    key={job.id}
                    className="flex flex-col h-full cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => router.push(`/jobs/${job.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={job.companyLogo} alt={job.company} />
                            <AvatarFallback>{job.company.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{job.title}</CardTitle>
                            <CardDescription className="text-xs">
                              {job.company} • Applied on {application?.submittedDate}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className="bg-green-500">Applied</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>

                      <div className="mt-3 p-2 bg-green-500/10 rounded-md">
                        <h3 className="text-xs font-medium text-green-700 dark:text-green-300">Application Status</h3>
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          <Clock className="h-3 w-3 text-green-500" />
                          <span>Application under review</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex gap-2">
                      <Dialog onClick={(e) => e.stopPropagation()}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                          >
                            View Application
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Application Details</DialogTitle>
                            <DialogDescription>
                              Your application for {job.title} at {job.company}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="bg-muted p-4 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={job.companyLogo} alt={job.company} />
                                  <AvatarFallback>{job.company.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-medium">{job.title}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {job.company} • {job.location}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h3 className="text-sm font-medium">Application Status</h3>
                              <div className="p-3 bg-green-500/10 rounded-md">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-green-500" />
                                  <span className="text-sm text-green-700 dark:text-green-300">
                                    Application under review
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h3 className="text-sm font-medium">Submitted Date</h3>
                              <p className="text-sm text-muted-foreground">{application?.submittedDate}</p>
                            </div>

                            {application?.coverLetter && (
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium">Cover Letter</h3>
                                <div className="p-3 bg-muted rounded-md">
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {application.coverLetter}
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="space-y-2">
                              <h3 className="text-sm font-medium">Resume</h3>
                              <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">resume_john_doe_2025.pdf</p>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" asChild>
                              <Link href={`/jobs/${job.id}`}>View Job Details</Link>
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleWithdrawApplication(job.id)
                        }}
                      >
                        Withdraw
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
            {appliedJobs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No applications yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Browse jobs and submit applications to see them here
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => document.querySelector('[data-value="browse"]')?.click()}
                >
                  Browse Jobs
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

