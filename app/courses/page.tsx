"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Rocket, Star, Search, Filter, ArrowUpDown, BookOpen } from "lucide-react"

import coursesData from "@/data/courses.json"

type Course = (typeof coursesData)[0]

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(coursesData)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "price-low" | "price-high">("popular")

  // Extract unique categories and levels
  const categories = Array.from(new Set(coursesData.map((course) => course.category)))
  const levels = Array.from(new Set(coursesData.map((course) => course.level)))

  // Filter and sort courses
  useEffect(() => {
    let filteredCourses = [...coursesData]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query),
      )
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filteredCourses = filteredCourses.filter((course) => selectedCategories.includes(course.category))
    }

    // Apply level filter
    if (selectedLevels.length > 0) {
      filteredCourses = filteredCourses.filter((course) => selectedLevels.includes(course.level))
    }

    // Apply sorting
    switch (sortBy) {
      case "popular":
        filteredCourses.sort((a, b) => b.enrolledStudents - a.enrolledStudents)
        break
      case "newest":
        // For demo purposes, we'll just reverse the array
        filteredCourses.reverse()
        break
      case "price-low":
        filteredCourses.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredCourses.sort((a, b) => b.price - a.price)
        break
    }

    setCourses(filteredCourses)
  }, [searchQuery, selectedCategories, selectedLevels, sortBy])

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Toggle level selection
  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Rocket className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">NeuraCamp</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/courses" className="text-sm font-medium text-primary">
              Courses
            </Link>
            <Link href="/#mentors" className="text-sm font-medium hover:text-primary">
              Mentors
            </Link>
            <Link href="/#about" className="text-sm font-medium hover:text-primary">
              About Us
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-16">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-5 bg-cover bg-center"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Explore Our <span className="gradient-text">AI & Data Science</span> Courses
            </h1>
            <p className="mb-8 text-muted-foreground md:text-lg">
              Discover a wide range of courses designed to help you master the skills that are shaping the future.
            </p>

            <div className="relative mx-auto max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for courses, topics, or instructors..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="sticky top-24 space-y-6">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium">Filters</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCategories([])
                        setSelectedLevels([])
                        setSearchQuery("")
                        setSortBy("popular")
                      }}
                    >
                      Reset
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-medium">Categories</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => toggleCategory(category)}
                            />
                            <Label htmlFor={`category-${category}`} className="text-sm">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 font-medium">Level</h3>
                      <div className="space-y-2">
                        {levels.map((level) => (
                          <div key={level} className="flex items-center space-x-2">
                            <Checkbox
                              id={`level-${level}`}
                              checked={selectedLevels.includes(level)}
                              onCheckedChange={() => toggleLevel(level)}
                            />
                            <Label htmlFor={`level-${level}`} className="text-sm">
                              {level}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Sort By</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="sort-popular"
                        name="sort"
                        checked={sortBy === "popular"}
                        onChange={() => setSortBy("popular")}
                        className="h-4 w-4 text-primary"
                      />
                      <Label htmlFor="sort-popular" className="text-sm">
                        Most Popular
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="sort-newest"
                        name="sort"
                        checked={sortBy === "newest"}
                        onChange={() => setSortBy("newest")}
                        className="h-4 w-4 text-primary"
                      />
                      <Label htmlFor="sort-newest" className="text-sm">
                        Newest
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="sort-price-low"
                        name="sort"
                        checked={sortBy === "price-low"}
                        onChange={() => setSortBy("price-low")}
                        className="h-4 w-4 text-primary"
                      />
                      <Label htmlFor="sort-price-low" className="text-sm">
                        Price: Low to High
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="sort-price-high"
                        name="sort"
                        checked={sortBy === "price-high"}
                        onChange={() => setSortBy("price-high")}
                        className="h-4 w-4 text-primary"
                      />
                      <Label htmlFor="sort-price-high" className="text-sm">
                        Price: High to Low
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="lg:w-3/4">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold">All Courses</h2>
                  <p className="text-sm text-muted-foreground">
                    Showing {courses.length} of {coursesData.length} courses
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1 md:hidden">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 md:hidden">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort
                  </Button>
                </div>
              </div>

              {courses.length === 0 ? (
                <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed">
                  <BookOpen className="mb-4 h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No courses found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <Link href={`/courses/${course.id}`} key={course.id}>
                      <Card className="h-full overflow-hidden card-hover">
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={course.thumbnail || "/placeholder.svg"}
                            alt={course.title}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <Badge className="bg-primary/10 text-primary">{course.category}</Badge>
                            <Badge variant="outline">{course.level}</Badge>
                          </div>
                          <h3 className="mb-2 line-clamp-2 text-lg font-bold">{course.title}</h3>
                          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{course.shortDescription}</p>

                          <div className="mb-3 flex items-center gap-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={course.instructorAvatar} alt={course.instructor} />
                              <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="text-xs">{course.instructor}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              <span className="text-sm font-medium">{course.rating}</span>
                              <span className="text-xs text-muted-foreground">({course.ratingCount})</span>
                            </div>
                            <p className="text-lg font-bold">${course.price}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} NeuraCamp. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                Terms
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                Privacy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

