"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"

interface StartupFormContentProps {
  mode: "create" | "edit"
  startupId?: string
}

export default function StartupFormContent({ mode, startupId }: StartupFormContentProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pitch: "",
    fundingGoal: "",
    equityOffered: "",
    industry: "",
    stage: "",
    location: "",
    website: "",
    traction: "",
    tags: [""],
    team: [
      {
        name: "",
        role: "",
        bio: "",
      },
    ],
  })
  const [isLoading, setIsLoading] = useState(mode === "edit")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (mode === "edit" && startupId) {
      const fetchStartup = async () => {
        try {
          // Fetch startup data
          const startupsResponse = await import("@/data/startups.json")
          const startupData = startupsResponse.default.find((s: any) => s.id === startupId)

          if (!startupData) {
            router.push("/startup-connect")
            return
          }

          // Check if current user is the owner
          const currentUser = getCurrentUser()
          if (!currentUser || startupData.founder !== currentUser.id) {
            toast({
              title: "Unauthorized",
              description: "You don't have permission to edit this startup.",
              variant: "destructive",
            })
            router.push("/startup-connect")
            return
          }

          // Format the data for the form
          setFormData({
            name: startupData.name,
            description: startupData.description,
            pitch: startupData.pitch,
            fundingGoal: startupData.fundingGoal.toString(),
            equityOffered: startupData.equityOffered.toString(),
            industry: startupData.industry,
            stage: startupData.stage,
            location: startupData.location,
            website: startupData.website,
            traction: startupData.traction,
            tags: startupData.tags,
            team: startupData.team,
          })

          setIsLoading(false)
        } catch (error) {
          console.error("Error fetching startup:", error)
          setIsLoading(false)
        }
      }

      fetchStartup()
    }
  }, [mode, startupId, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags]
    newTags[index] = value
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }))
  }

  const addTag = () => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, ""],
    }))
  }

  const removeTag = (index: number) => {
    const newTags = [...formData.tags]
    newTags.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }))
  }

  const handleTeamMemberChange = (index: number, field: string, value: string) => {
    const newTeam = [...formData.team]
    newTeam[index] = {
      ...newTeam[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      team: newTeam,
    }))
  }

  const addTeamMember = () => {
    setFormData((prev) => ({
      ...prev,
      team: [...prev.team, { name: "", role: "", bio: "" }],
    }))
  }

  const removeTeamMember = (index: number) => {
    const newTeam = [...formData.team]
    newTeam.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      team: newTeam,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.description || !formData.fundingGoal || !formData.equityOffered) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would be an API call
    toast({
      title: mode === "create" ? "Startup created" : "Startup updated",
      description:
        mode === "create"
          ? "Your startup has been created successfully."
          : "Your startup has been updated successfully.",
    })

    router.push("/startup-connect?tab=my-startups")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading startup data...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <div className="flex flex-1 items-center">
            <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.push("/startup-connect")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">{mode === "create" ? "Create Startup" : "Edit Startup"}</h1>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Provide the basic details about your startup.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Startup Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Short Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="A brief description of your startup (1-2 sentences)"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pitch">Pitch *</Label>
                    <Textarea
                      id="pitch"
                      name="pitch"
                      value={formData.pitch}
                      onChange={handleInputChange}
                      placeholder="Describe your startup, the problem you're solving, and your solution"
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry *</Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) => handleSelectChange("industry", value)}
                      >
                        <SelectTrigger id="industry">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                          <SelectItem value="Fintech">Fintech</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Sustainability">Sustainability</SelectItem>
                          <SelectItem value="SaaS">SaaS</SelectItem>
                          <SelectItem value="Marketplace">Marketplace</SelectItem>
                          <SelectItem value="Consumer Apps">Consumer Apps</SelectItem>
                          <SelectItem value="Enterprise Software">Enterprise Software</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stage">Stage *</Label>
                      <Select value={formData.stage} onValueChange={(value) => handleSelectChange("stage", value)}>
                        <SelectTrigger id="stage">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Idea">Idea</SelectItem>
                          <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                          <SelectItem value="Seed">Seed</SelectItem>
                          <SelectItem value="Series A">Series A</SelectItem>
                          <SelectItem value="Series B">Series B</SelectItem>
                          <SelectItem value="Growth">Growth</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Funding Information</CardTitle>
                  <CardDescription>Provide details about your funding needs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fundingGoal">Funding Goal ($) *</Label>
                      <Input
                        id="fundingGoal"
                        name="fundingGoal"
                        type="number"
                        value={formData.fundingGoal}
                        onChange={handleInputChange}
                        placeholder="500000"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="equityOffered">Equity Offered (%) *</Label>
                      <Input
                        id="equityOffered"
                        name="equityOffered"
                        type="number"
                        value={formData.equityOffered}
                        onChange={handleInputChange}
                        placeholder="15"
                        min="0"
                        max="100"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="traction">Traction</Label>
                    <Input
                      id="traction"
                      name="traction"
                      value={formData.traction}
                      onChange={handleInputChange}
                      placeholder="e.g., 5,000 users, 20% weekly growth"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                  <CardDescription>Add tags to help investors find your startup.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={tag}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        placeholder="e.g., AI, SaaS, Mobile"
                      />
                      {formData.tags.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeTag(index)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addTag}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Tag
                  </Button>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Team</CardTitle>
                  <CardDescription>Add information about your team members.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {formData.team.map((member, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-md">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Team Member {index + 1}</h4>
                        {formData.team.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeTeamMember(index)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`team-${index}-name`}>Name</Label>
                        <Input
                          id={`team-${index}-name`}
                          value={member.name}
                          onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`team-${index}-role`}>Role</Label>
                        <Input
                          id={`team-${index}-role`}
                          value={member.role}
                          onChange={(e) => handleTeamMemberChange(index, "role", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`team-${index}-bio`}>Bio</Label>
                        <Textarea
                          id={`team-${index}-bio`}
                          value={member.bio}
                          onChange={(e) => handleTeamMemberChange(index, "bio", e.target.value)}
                          placeholder="Brief background and expertise"
                        />
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addTeamMember}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Team Member
                  </Button>
                </CardContent>
              </Card>

              <CardFooter className="flex justify-end gap-2 px-0">
                <Button type="button" variant="outline" onClick={() => router.push("/startup-connect")}>
                  Cancel
                </Button>
                <Button type="submit">{mode === "create" ? "Create Startup" : "Update Startup"}</Button>
              </CardFooter>
            </form>
          </div>
        </div>
      </SidebarInset>
    </div>
  )
}

