"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { auth, type User } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  GraduationCap,
  Award,
  Star,
  Edit,
  Plus,
  Trash2,
  Github,
  Linkedin,
  Globe,
  Twitter,
  Upload,
} from "lucide-react"

// Define the portfolio types
interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description: string
}

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
  skills: string[]
}

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  link: string
  image: string
}

interface Skill {
  name: string
  level: number // 1-5
}

interface Portfolio {
  bio: string
  title: string
  location: string
  skills: Skill[]
  education: Education[]
  experience: Experience[]
  projects: Project[]
  socialLinks: {
    github?: string
    linkedin?: string
    website?: string
    twitter?: string
  }
}

// Sample portfolio data
const samplePortfolio: Portfolio = {
  bio: "Experienced data scientist with a passion for machine learning and AI. I specialize in developing predictive models and data-driven solutions for complex business problems.",
  title: "Senior Data Scientist",
  location: "San Francisco, CA",
  skills: [
    { name: "Python", level: 5 },
    { name: "Machine Learning", level: 5 },
    { name: "TensorFlow", level: 4 },
    { name: "PyTorch", level: 4 },
    { name: "SQL", level: 4 },
    { name: "Data Visualization", level: 4 },
    { name: "Statistical Analysis", level: 5 },
    { name: "Deep Learning", level: 4 },
    { name: "NLP", level: 3 },
    { name: "Computer Vision", level: 3 },
  ],
  education: [
    {
      id: "edu1",
      institution: "Stanford University",
      degree: "Master's Degree",
      field: "Computer Science, AI Specialization",
      startDate: "2018-09",
      endDate: "2020-06",
      description:
        "Focused on machine learning and artificial intelligence. Completed thesis on reinforcement learning applications in autonomous systems.",
    },
    {
      id: "edu2",
      institution: "University of California, Berkeley",
      degree: "Bachelor's Degree",
      field: "Mathematics and Statistics",
      startDate: "2014-09",
      endDate: "2018-05",
      description: "Double major in Mathematics and Statistics with a minor in Computer Science.",
    },
  ],
  experience: [
    {
      id: "exp1",
      company: "TechCorp Inc.",
      position: "Senior Data Scientist",
      startDate: "2022-01",
      endDate: "Present",
      description:
        "Lead data scientist for the AI research team. Developed and deployed machine learning models for customer segmentation, churn prediction, and recommendation systems.",
      skills: ["Python", "TensorFlow", "PyTorch", "SQL", "AWS"],
    },
    {
      id: "exp2",
      company: "DataTech Solutions",
      position: "Data Scientist",
      startDate: "2020-07",
      endDate: "2021-12",
      description:
        "Developed predictive models for financial forecasting and risk assessment. Implemented NLP solutions for sentiment analysis of customer feedback.",
      skills: ["Python", "Machine Learning", "NLP", "SQL", "Tableau"],
    },
  ],
  projects: [
    {
      id: "proj1",
      title: "Customer Churn Prediction Model",
      description:
        "Developed a machine learning model to predict customer churn with 85% accuracy, helping the company reduce churn by 20%.",
      technologies: ["Python", "scikit-learn", "XGBoost", "Pandas"],
      link: "https://github.com/username/churn-prediction",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "proj2",
      title: "Sentiment Analysis Tool",
      description:
        "Created an NLP-based sentiment analysis tool that processes customer reviews and social media mentions to determine brand sentiment.",
      technologies: ["Python", "NLTK", "BERT", "Flask"],
      link: "https://github.com/username/sentiment-analysis",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "proj3",
      title: "Image Classification System",
      description:
        "Built a deep learning system for image classification using convolutional neural networks, achieving 92% accuracy on test data.",
      technologies: ["Python", "TensorFlow", "Keras", "OpenCV"],
      link: "https://github.com/username/image-classifier",
      image: "/placeholder.svg?height=200&width=300",
    },
  ],
  socialLinks: {
    github: "https://github.com/username",
    linkedin: "https://linkedin.com/in/username",
    website: "https://username.com",
    twitter: "https://twitter.com/username",
  },
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [portfolio, setPortfolio] = useState<Portfolio>(samplePortfolio)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = auth.getCurrentUser()

    if (!currentUser) {
      // Redirect to sign in page if not authenticated
      router.push("/auth/signin")
      return
    }

    setUser(currentUser)

    // In a real app, we would fetch the user's portfolio from the backend
    // For now, we'll use the sample data

    setLoading(false)
  }, [router])

  const handleSavePortfolio = () => {
    // In a real app, we would save the portfolio to the backend
    setIsEditing(false)
    // Show success message
    alert("Portfolio saved successfully!")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader user={user} />
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
            <div className="container mx-auto max-w-5xl">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">My Profile</h1>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "default" : "outline"}
                  className="gap-2"
                >
                  {isEditing ? (
                    <>Save Profile</>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>

              {/* Profile Header */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24 md:h-32 md:w-32">
                        <AvatarImage
                          src={user?.avatar || "/placeholder.svg?height=128&width=128"}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button size="sm" variant="outline" className="absolute bottom-0 right-0 rounded-full">
                          <Upload className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" defaultValue={user?.name || ""} />
                          </div>
                          <div>
                            <Label htmlFor="title">Professional Title</Label>
                            <Input id="title" defaultValue={portfolio.title} />
                          </div>
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" defaultValue={portfolio.location} />
                          </div>
                          <div>
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" defaultValue={portfolio.bio} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h2 className="text-2xl font-bold">{user?.name}</h2>
                          <p className="text-lg text-muted-foreground">{portfolio.title}</p>
                          <p className="text-sm text-muted-foreground">{portfolio.location}</p>
                          <p className="mt-2">{portfolio.bio}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {portfolio.socialLinks.github && (
                        <Button variant="outline" size="sm" asChild className="gap-2">
                          <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {portfolio.socialLinks.linkedin && (
                        <Button variant="outline" size="sm" asChild className="gap-2">
                          <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {portfolio.socialLinks.website && (
                        <Button variant="outline" size="sm" asChild className="gap-2">
                          <a href={portfolio.socialLinks.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4" />
                            Website
                          </a>
                        </Button>
                      )}
                      {portfolio.socialLinks.twitter && (
                        <Button variant="outline" size="sm" asChild className="gap-2">
                          <a href={portfolio.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                            Twitter
                          </a>
                        </Button>
                      )}
                    </div>
                  )}

                  {isEditing && (
                    <div className="mt-6 space-y-4">
                      <h3 className="font-medium">Social Links</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="github">GitHub</Label>
                          <div className="flex items-center gap-2">
                            <Github className="h-4 w-4" />
                            <Input id="github" defaultValue={portfolio.socialLinks.github} />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <div className="flex items-center gap-2">
                            <Linkedin className="h-4 w-4" />
                            <Input id="linkedin" defaultValue={portfolio.socialLinks.linkedin} />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <Input id="website" defaultValue={portfolio.socialLinks.website} />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="twitter">Twitter</Label>
                          <div className="flex items-center gap-2">
                            <Twitter className="h-4 w-4" />
                            <Input id="twitter" defaultValue={portfolio.socialLinks.twitter} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills Section */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Skills</CardTitle>
                    {isEditing && (
                      <Button size="sm" variant="outline" className="gap-1">
                        <Plus className="h-4 w-4" />
                        Add Skill
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {portfolio.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input defaultValue={skill.name} className="flex-1" />
                          <select
                            className="h-10 rounded-md border border-input bg-background px-3 py-2"
                            defaultValue={skill.level}
                          >
                            <option value="1">Beginner</option>
                            <option value="2">Elementary</option>
                            <option value="3">Intermediate</option>
                            <option value="4">Advanced</option>
                            <option value="5">Expert</option>
                          </select>
                          <Button size="icon" variant="ghost" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {portfolio.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-1 rounded-full border px-3 py-1">
                          <span>{skill.name}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < skill.level ? "fill-yellow-500 text-yellow-500" : "text-muted"}`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tabs for Experience, Education, Projects */}
              <Tabs defaultValue="experience" className="mb-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="experience" className="gap-2">
                    <Briefcase className="h-4 w-4" />
                    Experience
                  </TabsTrigger>
                  <TabsTrigger value="education" className="gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Education
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="gap-2">
                    <Award className="h-4 w-4" />
                    Projects
                  </TabsTrigger>
                </TabsList>

                {/* Experience Tab */}
                <TabsContent value="experience">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Work Experience</CardTitle>
                        {isEditing && (
                          <Button size="sm" variant="outline" className="gap-1">
                            <Plus className="h-4 w-4" />
                            Add Experience
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {portfolio.experience.map((exp, index) => (
                        <div key={exp.id} className={index !== 0 ? "pt-6 border-t" : ""}>
                          {isEditing ? (
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="space-y-4 flex-1">
                                  <div>
                                    <Label htmlFor={`company-${exp.id}`}>Company</Label>
                                    <Input id={`company-${exp.id}`} defaultValue={exp.company} />
                                  </div>
                                  <div>
                                    <Label htmlFor={`position-${exp.id}`}>Position</Label>
                                    <Input id={`position-${exp.id}`} defaultValue={exp.position} />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor={`start-date-${exp.id}`}>Start Date</Label>
                                      <Input id={`start-date-${exp.id}`} type="month" defaultValue={exp.startDate} />
                                    </div>
                                    <div>
                                      <Label htmlFor={`end-date-${exp.id}`}>End Date</Label>
                                      <Input
                                        id={`end-date-${exp.id}`}
                                        type="month"
                                        defaultValue={exp.endDate !== "Present" ? exp.endDate : ""}
                                        placeholder="Present"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor={`description-${exp.id}`}>Description</Label>
                                    <Textarea id={`description-${exp.id}`} defaultValue={exp.description} />
                                  </div>
                                  <div>
                                    <Label htmlFor={`skills-${exp.id}`}>Skills (comma separated)</Label>
                                    <Input id={`skills-${exp.id}`} defaultValue={exp.skills.join(", ")} />
                                  </div>
                                </div>
                                <Button size="icon" variant="ghost" className="text-destructive ml-2">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">{exp.position}</h3>
                                <Badge variant="outline">
                                  {exp.startDate} - {exp.endDate}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground">{exp.company}</p>
                              <p className="mt-2">{exp.description}</p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {exp.skills.map((skill, i) => (
                                  <Badge key={i} variant="secondary">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Education Tab */}
                <TabsContent value="education">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Education</CardTitle>
                        {isEditing && (
                          <Button size="sm" variant="outline" className="gap-1">
                            <Plus className="h-4 w-4" />
                            Add Education
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {portfolio.education.map((edu, index) => (
                        <div key={edu.id} className={index !== 0 ? "pt-6 border-t" : ""}>
                          {isEditing ? (
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="space-y-4 flex-1">
                                  <div>
                                    <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                                    <Input id={`institution-${edu.id}`} defaultValue={edu.institution} />
                                  </div>
                                  <div>
                                    <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                                    <Input id={`degree-${edu.id}`} defaultValue={edu.degree} />
                                  </div>
                                  <div>
                                    <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                                    <Input id={`field-${edu.id}`} defaultValue={edu.field} />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor={`start-date-${edu.id}`}>Start Date</Label>
                                      <Input id={`start-date-${edu.id}`} type="month" defaultValue={edu.startDate} />
                                    </div>
                                    <div>
                                      <Label htmlFor={`end-date-${edu.id}`}>End Date</Label>
                                      <Input id={`end-date-${edu.id}`} type="month" defaultValue={edu.endDate} />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor={`description-${edu.id}`}>Description</Label>
                                    <Textarea id={`description-${edu.id}`} defaultValue={edu.description} />
                                  </div>
                                </div>
                                <Button size="icon" variant="ghost" className="text-destructive ml-2">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">{edu.institution}</h3>
                                <Badge variant="outline">
                                  {edu.startDate} - {edu.endDate}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground">
                                {edu.degree}, {edu.field}
                              </p>
                              <p className="mt-2">{edu.description}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Projects Tab */}
                <TabsContent value="projects">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Projects</CardTitle>
                        {isEditing && (
                          <Button size="sm" variant="outline" className="gap-1">
                            <Plus className="h-4 w-4" />
                            Add Project
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {portfolio.projects.map((project) => (
                          <div key={project.id} className="border rounded-lg overflow-hidden">
                            {isEditing ? (
                              <div className="p-4 space-y-4">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-4 flex-1">
                                    <div>
                                      <Label htmlFor={`title-${project.id}`}>Title</Label>
                                      <Input id={`title-${project.id}`} defaultValue={project.title} />
                                    </div>
                                    <div>
                                      <Label htmlFor={`description-${project.id}`}>Description</Label>
                                      <Textarea id={`description-${project.id}`} defaultValue={project.description} />
                                    </div>
                                    <div>
                                      <Label htmlFor={`technologies-${project.id}`}>
                                        Technologies (comma separated)
                                      </Label>
                                      <Input
                                        id={`technologies-${project.id}`}
                                        defaultValue={project.technologies.join(", ")}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`link-${project.id}`}>Project Link</Label>
                                      <Input id={`link-${project.id}`} defaultValue={project.link} />
                                    </div>
                                    <div>
                                      <Label htmlFor={`image-${project.id}`}>Image URL</Label>
                                      <Input id={`image-${project.id}`} defaultValue={project.image} />
                                    </div>
                                  </div>
                                  <Button size="icon" variant="ghost" className="text-destructive ml-2">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="aspect-video w-full overflow-hidden">
                                  <img
                                    src={project.image || "/placeholder.svg"}
                                    alt={project.title}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="p-4">
                                  <h3 className="font-semibold text-lg">{project.title}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {project.technologies.map((tech, i) => (
                                      <Badge key={i} variant="secondary">
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                  <Button asChild className="mt-4 w-full" size="sm">
                                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                                      View Project
                                    </a>
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {isEditing && (
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSavePortfolio}>Save Profile</Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

