"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Users, BookOpen, Award, ArrowRight, Cpu, Briefcase, Lightbulb, Zap, Menu, X } from "lucide-react"

import { GradientBackground } from "@/components/animations/gradient-background"
import { ParticleField } from "@/components/animations/particle-field"
import { NeuralNetworkAnimation } from "@/components/animations/neural-network"
import { AnimatedText, AnimatedTitle } from "@/components/animations/animated-text"
import { FeatureCard } from "@/components/landing/feature-card"
import { ServiceCard } from "@/components/landing/service-card"
import { TestimonialCard } from "@/components/landing/testimonial-card"
import { StatsSection } from "@/components/landing/stats-section"

import courses from "@/data/courses.json"
import testimonials from "@/data/testimonials.json"
import partners from "@/data/partners.json"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 100], [0, 1])
  const [isLoaded, setIsLoaded] = useState(false)

  // Get featured courses
  const featuredCourses = courses.filter((course) => course.featured).slice(0, 3)

  // Intersection observer for section animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Handle resize and scroll events
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)

    // Set loaded state after a short delay to ensure animations are ready
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Background Animations - Only show when loaded */}
      {isLoaded && (
        <>
          <GradientBackground />
          <ParticleField />
        </>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-purple-900/30 bg-black/50 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center z-10">
            <span className="text-xl font-bold font-sans tracking-tight text-white">NeuraCamp</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-purple-900/30">
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 gap-3 p-4">
                    <Link href="/courses" legacyBehavior passHref>
                      <NavigationMenuLink className="flex flex-col space-y-1 rounded-md p-3 hover:bg-purple-900/20">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-medium">AI Courses</span>
                        </div>
                        <p className="text-xs text-gray-400">Expert-curated, AI-audited learning paths</p>
                      </NavigationMenuLink>
                    </Link>
                    <Link href="/mentorship" legacyBehavior passHref>
                      <NavigationMenuLink className="flex flex-col space-y-1 rounded-md p-3 hover:bg-purple-900/20">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-medium">Mentorship</span>
                        </div>
                        <p className="text-xs text-gray-400">Connect with industry leaders and experts</p>
                      </NavigationMenuLink>
                    </Link>
                    <Link href="/jobs" legacyBehavior passHref>
                      <NavigationMenuLink className="flex flex-col space-y-1 rounded-md p-3 hover:bg-purple-900/20">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-medium">Job Matching</span>
                        </div>
                        <p className="text-xs text-gray-400">Find top AI talent or your next role</p>
                      </NavigationMenuLink>
                    </Link>
                    <Link href="/startup-connect" legacyBehavior passHref>
                      <NavigationMenuLink className="flex flex-col space-y-1 rounded-md p-3 hover:bg-purple-900/20">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-medium">Startup Connect</span>
                        </div>
                        <p className="text-xs text-gray-400">Connect startups with investors and resources</p>
                      </NavigationMenuLink>
                    </Link>
                    <Link href="/virtual-machines" legacyBehavior passHref>
                      <NavigationMenuLink className="flex flex-col space-y-1 rounded-md p-3 hover:bg-purple-900/20">
                        <div className="flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-medium">GPU Resources</span>
                        </div>
                        <p className="text-xs text-gray-400">Rent high-performance computing resources</p>
                      </NavigationMenuLink>
                    </Link>
                    <Link href="/practice" legacyBehavior passHref>
                      <NavigationMenuLink className="flex flex-col space-y-1 rounded-md p-3 hover:bg-purple-900/20">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-purple-400" />
                          <span className="text-sm font-medium">Practice Arena</span>
                        </div>
                        <p className="text-xs text-gray-400">Sharpen your skills with challenges and competitions</p>
                      </NavigationMenuLink>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle() + " bg-transparent hover:bg-purple-900/30"}
                  >
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/pricing" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle() + " bg-transparent hover:bg-purple-900/30"}
                  >
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle() + " bg-transparent hover:bg-purple-900/30"}
                  >
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu Button */}
          <button
            className="z-20 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-10 bg-black/95 md:hidden">
              <ScrollArea className="h-full w-full p-6 pt-20">
                <div className="flex flex-col space-y-4">
                  <div className="border-b border-purple-900/30 pb-4">
                    <p className="mb-2 text-sm font-medium text-purple-400">Services</p>
                    <div className="grid grid-cols-1 gap-2">
                      <Link
                        href="/courses"
                        className="flex items-center gap-2 rounded-md p-2 hover:bg-purple-900/20"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <BookOpen className="h-4 w-4 text-purple-400" />
                        <span className="text-sm">AI Courses</span>
                      </Link>
                      <Link
                        href="/mentorship"
                        className="flex items-center gap-2 rounded-md p-2 hover:bg-purple-900/20"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Users className="h-4 w-4 text-purple-400" />
                        <span className="text-sm">Mentorship</span>
                      </Link>
                      <Link
                        href="/jobs"
                        className="flex items-center gap-2 rounded-md p-2 hover:bg-purple-900/20"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Briefcase className="h-4 w-4 text-purple-400" />
                        <span className="text-sm">Job Matching</span>
                      </Link>
                      <Link
                        href="/startup-connect"
                        className="flex items-center gap-2 rounded-md p-2 hover:bg-purple-900/20"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Lightbulb className="h-4 w-4 text-purple-400" />
                        <span className="text-sm">Startup Connect</span>
                      </Link>
                      <Link
                        href="/virtual-machines"
                        className="flex items-center gap-2 rounded-md p-2 hover:bg-purple-900/20"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Cpu className="h-4 w-4 text-purple-400" />
                        <span className="text-sm">GPU Resources</span>
                      </Link>
                      <Link
                        href="/practice"
                        className="flex items-center gap-2 rounded-md p-2 hover:bg-purple-900/20"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Zap className="h-4 w-4 text-purple-400" />
                        <span className="text-sm">Practice Arena</span>
                      </Link>
                    </div>
                  </div>

                  <Link
                    href="/about"
                    className="border-b border-purple-900/30 py-3 text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/pricing"
                    className="border-b border-purple-900/30 py-3 text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/contact"
                    className="border-b border-purple-900/30 py-3 text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>

                  <div className="flex flex-col gap-3 pt-4">
                    <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-900/30 hover:text-white"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full bg-purple-700 hover:bg-purple-600">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/auth/signin">
              <Button
                variant="outline"
                size="sm"
                className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30 hover:text-white"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-purple-700 hover:bg-purple-600">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden py-20 md:py-32">
        {isLoaded && (
          <div className="absolute inset-0 z-0">
            <NeuralNetworkAnimation />
          </div>
        )}

        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scaleX: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-purple-900/50 text-purple-200 border-purple-500/50">
                The Complete Data Science Ecosystem
              </Badge>
            </motion.div>

            <AnimatedTitle className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              <span className="block">Your One-Stop Platform for</span>
              <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-transparent">
                AI & Data Science
              </span>
            </AnimatedTitle>

            <AnimatedText
              text="From learning to deployment, connect with resources, mentors, jobs, and investment opportunities all in one place."
              className="mb-8 text-lg text-gray-300 md:text-xl"
              once={true}
            />

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/courses">
                <Button size="lg" className="w-full sm:w-auto bg-purple-700 hover:bg-purple-600">
                  Explore Platform
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/virtual-machines">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-purple-500/50 text-purple-300 hover:bg-purple-900/30 hover:text-white"
                >
                  Try GPU Resources
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="mt-12 flex flex-wrap justify-center gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-medium text-gray-300">50,000+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-medium text-gray-300">200+ AI-Audited Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-medium text-gray-300">Industry Recognized</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-medium text-gray-300">On-Demand GPU Access</span>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scaleX: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1.5,
          }}
        />
      </section>

      {/* Services Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge className="mb-2 bg-purple-900/50 text-purple-200 border-purple-500/50">Our Services</Badge>
            <AnimatedTitle className="mb-4 text-3xl font-bold md:text-4xl">
              Complete Data Science Ecosystem
            </AnimatedTitle>
            <AnimatedText
              text="Everything you need to succeed in AI and data science, all in one platform."
              className="mx-auto max-w-2xl text-gray-300"
              once={true}
            />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ServiceCard
              title="AI-Audited Learning"
              description="Expert-curated courses with AI-verified content to ensure you learn the most relevant and up-to-date skills."
              image="/placeholder.svg?height=300&width=500"
              link="/courses"
              tags={["Courses", "Learning Paths", "Certifications"]}
              index={0}
            />
            <ServiceCard
              title="Expert Mentorship"
              description="Connect with industry leaders who provide personalized guidance to accelerate your career growth."
              image="/placeholder.svg?height=300&width=500"
              link="/mentorship"
              tags={["1:1 Coaching", "Career Advice", "Project Feedback"]}
              index={1}
            />
            <ServiceCard
              title="Job Matching"
              description="Find your perfect role or the ideal candidate with our AI-powered job matching platform."
              image="/placeholder.svg?height=300&width=500"
              link="/jobs"
              tags={["Talent Sourcing", "Career Opportunities", "Skill Matching"]}
              index={2}
            />
            <ServiceCard
              title="Startup Connect"
              description="Connect startups with investors, resources, and talent to help innovative ideas thrive."
              image="/placeholder.svg?height=300&width=500"
              link="/startup-connect"
              tags={["Investment", "Networking", "Resources"]}
              index={3}
            />
            <ServiceCard
              title="GPU Resources"
              description="Access high-performance computing resources on-demand for your AI and machine learning projects."
              image="/placeholder.svg?height=300&width=500"
              link="/virtual-machines"
              tags={["Cloud GPUs", "Development Environments", "One-Click Setup"]}
              index={4}
            />
            <ServiceCard
              title="Practice Arena"
              description="Sharpen your skills with challenges, competitions, and real-world projects in our interactive practice environment."
              image="/placeholder.svg?height=300&width=500"
              link="/practice"
              tags={["Challenges", "Competitions", "Leaderboards"]}
              index={5}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <StatsSection />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge className="mb-2 bg-purple-900/50 text-purple-200 border-purple-500/50">Why Choose NeuraCamp</Badge>
            <AnimatedTitle className="mb-4 text-3xl font-bold md:text-4xl">Breaking Down Barriers in AI</AnimatedTitle>
            <AnimatedText
              text="We're removing the obstacles that prevent people from entering and succeeding in the world of AI and data science."
              className="mx-auto max-w-2xl text-gray-300"
              once={true}
            />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Cpu}
              title="Instant Access to Computing Power"
              description="One-click setup for GPU resources eliminates technical barriers, allowing you to focus on your work instead of infrastructure."
              delay={0.1}
            />
            <FeatureCard
              icon={BookOpen}
              title="Quality-Assured Learning"
              description="AI-audited courses ensure you're learning accurate, up-to-date content that's relevant to industry needs."
              delay={0.2}
            />
            <FeatureCard
              icon={Users}
              title="Community & Mentorship"
              description="Connect with experts and peers who can guide your journey and provide valuable feedback on your work."
              delay={0.3}
            />
            <FeatureCard
              icon={Briefcase}
              title="Career Opportunities"
              description="Direct connections to job opportunities that match your skills and career goals in the AI and data science field."
              delay={0.4}
            />
            <FeatureCard
              icon={Lightbulb}
              title="Innovation Support"
              description="Resources and connections for startups and innovators to bring their AI ideas to life with funding and expertise."
              delay={0.5}
            />
            <FeatureCard
              icon={Zap}
              title="Practical Skill Development"
              description="Interactive challenges and competitions that build real-world skills and showcase your abilities to potential employers."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge className="mb-2 bg-purple-900/50 text-purple-200 border-purple-500/50">Success Stories</Badge>
            <AnimatedTitle className="mb-4 text-3xl font-bold md:text-4xl">What Our Community Says</AnimatedTitle>
            <AnimatedText
              text="Hear from users who have transformed their careers and businesses with NeuraCamp."
              className="mx-auto max-w-2xl text-gray-300"
              once={true}
            />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                quote={testimonial.testimonial}
                author={testimonial.name}
                role={testimonial.role}
                company={testimonial.company || testimonial.course}
                avatar={testimonial.avatar || "/placeholder.svg?height=100&width=100"}
                rating={testimonial.rating}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-2 bg-purple-900/50 text-purple-200 border-purple-500/50">Our Partners</Badge>
            <AnimatedTitle className="mb-4 text-3xl font-bold md:text-4xl">Trusted by Industry Leaders</AnimatedTitle>
            <AnimatedText
              text="We collaborate with top companies to ensure our platform meets industry standards and provides real-world value."
              className="mx-auto max-w-2xl text-gray-300"
              once={true}
            />
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.id}
                className="flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={partner.logo || "/placeholder.svg?height=80&width=160"}
                  alt={partner.name}
                  className="max-h-12 opacity-70 transition-opacity hover:opacity-100 filter grayscale hover:grayscale-0"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900 to-black opacity-80"
          initial={{ opacity: 0.7 }}
          whileInView={{ opacity: 0.9 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <AnimatedTitle className="mb-6 text-3xl font-bold text-white md:text-4xl">
              Ready to Transform Your Data Science Journey?
            </AnimatedTitle>
            <AnimatedText
              text="Join thousands of professionals who are leveraging our complete ecosystem to learn, build, and grow in AI and data science."
              className="mb-8 text-lg text-white/80"
              once={true}
            />
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link href="/courses">
                <Button size="lg" className="w-full sm:w-auto bg-white text-purple-900 hover:bg-gray-100">
                  Explore Platform
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-white/10"
                >
                  Sign Up for Free
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-900/30 bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold font-sans tracking-tight text-white">NeuraCamp</span>
              </Link>
              <p className="mt-4 text-sm text-gray-400">
                The complete ecosystem for AI and data science. Learn, build, connect, and grow with our comprehensive
                platform.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-white">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/courses" className="text-gray-400 hover:text-purple-400 transition-colors">
                    AI-Audited Courses
                  </Link>
                </li>
                <li>
                  <Link href="/mentorship" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Expert Mentorship
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Job Matching
                  </Link>
                </li>
                <li>
                  <Link href="/startup-connect" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Startup Connect
                  </Link>
                </li>
                <li>
                  <Link href="/virtual-machines" className="text-gray-400 hover:text-purple-400 transition-colors">
                    GPU Resources
                  </Link>
                </li>
                <li>
                  <Link href="/practice" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Practice Arena
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-white">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-purple-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-white">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-purple-900/30 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-gray-400">© {new Date().getFullYear()} NeuraCamp. All rights reserved.</p>
              <div className="flex gap-4">
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  <span className="sr-only">GitHub</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

