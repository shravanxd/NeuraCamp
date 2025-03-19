"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Building, Briefcase, MapPin, Calendar, DollarSign, Users, Globe, ArrowLeft, CheckCircle } from "lucide-react"
import { auth, type User } from "@/lib/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { hasApplied, removeApplication, saveApplication, type JobApplication } from "@/lib/job-applications"

// Sample job data (in a real app, this would come from an API)
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

export function JobDetailContent({ jobId }: { jobId: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [showApplyDialog, setShowApplyDialog] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const router = useRouter()

  // Find the job by ID
  const job = jobsData.find((j) => j.id === jobId)

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = auth.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  // Check if the job has been applied to
  const isJobApplied = () => {
    if (!user || !job) return false
    return hasApplied(job.id, user.id)
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Handle apply to job
  const handleApplyToJob = () => {
    if (!user || !job) return

    // Create new application
    const newApplication: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      userId: user.id,
      status: "pending",
      submittedDate: new Date().toISOString().split("T")[0],
      coverLetter: coverLetter,
    }

    // Save to localStorage
    saveApplication(newApplication)

    // Close dialog and show success message
    setShowApplyDialog(false)
    alert("Your application has been submitted successfully!")

    // Force re-render to update the applied status
    router.refresh()
  }

  // Handle withdraw application
  const handleWithdrawApplication = () => {
    if (!user || !job) return

    // Show confirmation dialog
    if (confirm("Are you sure you want to withdraw your application?")) {
      // Remove from localStorage
      removeApplication(job.id, user.id)

      // Show success message
      alert("Application withdrawn successfully!")

      // Force re-render to update the applied status
      router.refresh()
    }
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Briefcase className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">Job not found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The job you're looking for doesn't exist or has been removed
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <Button variant="outline" className="w-fit" asChild>
          <Link href="/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>

        {/* Job Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={job.companyLogo} alt={job.company} />
              <AvatarFallback>{job.company.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                <span>{job.company}</span>
                <span>•</span>
                <span>{job.location}</span>
                <span>•</span>
                <span>Posted on {formatDate(job.postedDate)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {isJobApplied() ? (
              <>
                <Badge className="mb-2 self-end bg-green-500">Applied</Badge>
                <Button variant="destructive" onClick={handleWithdrawApplication}>
                  Withdraw Application
                </Button>
              </>
            ) : (
              <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
                <DialogTrigger asChild>
                  <Button>Apply Now</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Apply for {job.title}</DialogTitle>
                    <DialogDescription>
                      Submit your application for {job.title} at {job.company}
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
                        <p className="text-sm text-muted-foreground">
                          Your profile resume will be used for this application
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="inline-block h-3 w-3 text-green-500 mr-1">✓</span>
                          resume_john_doe_2025.pdf
                        </p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleApplyToJob}>Submit Application</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Description</h3>
                  <p className="mt-2 text-muted-foreground">{job.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Requirements</h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Responsibilities</h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Benefits</h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                    {job.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Required Skills</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>About {job.company}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{job.companyDescription}</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{job.companyIndustry}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{job.companySize}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <a
                      href={job.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {job.companyWebsite.replace("https://", "")}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Job Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Briefcase className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Job Type</p>
                    <p className="text-sm text-muted-foreground">{job.employmentType}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Salary</p>
                    <p className="text-sm text-muted-foreground">{job.salary}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Application Deadline</p>
                    <p className="text-sm text-muted-foreground">{formatDate(job.applicationDeadline)}</p>
                  </div>
                </div>
                <Separator />
                {isJobApplied() ? (
                  <div className="rounded-md bg-green-500/10 p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <p className="font-medium text-green-700 dark:text-green-300">Application Submitted</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">Your application is under review</p>
                  </div>
                ) : (
                  <Button className="w-full" onClick={() => setShowApplyDialog(true)}>
                    Apply Now
                  </Button>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2">
                <p className="text-sm text-muted-foreground">Share this job:</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-linkedin"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <span className="sr-only">Share on LinkedIn</span>
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-twitter"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                    <span className="sr-only">Share on Twitter</span>
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-mail"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span className="sr-only">Share via Email</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

