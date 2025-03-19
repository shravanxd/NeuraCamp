"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Github, Twitter, ArrowRight, Mail, Lock, User } from "lucide-react"
import { auth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) newErrors.email = "Email is required"
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid"
    if (!password) newErrors.password = "Password is required"
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!agreeTerms) newErrors.terms = "You must agree to the terms and conditions"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      auth.signUp({
        name,
        email,
        password,
        avatar: "/placeholder.svg?height=200&width=200",
      })

      toast({
        title: "Account created successfully!",
        description: "You can now sign in with your credentials.",
        variant: "default",
      })

      // Redirect to sign in page
      setTimeout(() => {
        router.push("/auth/signin")
      }, 1500)
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-black">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-12">
            <span className="text-2xl font-bold text-white">NeuraCamp</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-zinc-400">Join our community of AI enthusiasts and start your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`pl-10 bg-zinc-900 border-zinc-800 focus:border-purple-500 h-12 ${errors.name ? "border-red-500" : ""}`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 bg-zinc-900 border-zinc-800 focus:border-purple-500 h-12 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 bg-zinc-900 border-zinc-800 focus:border-purple-500 h-12 ${errors.password ? "border-red-500" : ""}`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-zinc-300">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 bg-zinc-900 border-zinc-800 focus:border-purple-500 h-12 ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className={`${errors.terms ? "border-red-500" : "border-zinc-700"} data-[state=checked]:bg-purple-600`}
              />
              <Label htmlFor="terms" className="text-sm text-zinc-300">
                I agree to the{" "}
                <Link href="/terms" className="text-purple-400 hover:text-purple-300 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300 hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            {errors.terms && <p className="text-xs text-red-500 -mt-2">{errors.terms}</p>}

            <Button
              type="submit"
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-black px-2 text-zinc-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-white">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Button>
              <Button variant="outline" className="h-12 border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-white">
                <Twitter className="mr-2 h-5 w-5" />
                Twitter
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-purple-400 hover:text-purple-300 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image/Decoration */}
      <div className="hidden lg:block lg:w-1/2 relative bg-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-30 bg-cover bg-center mix-blend-overlay"></div>

        {/* Neural network animation overlay */}
        <div className="absolute inset-0 bg-grid-small-white/[0.2]"></div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center items-center p-12">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Accelerate Your AI Career</h2>
            <p className="text-zinc-300 mb-8">
              Join thousands of students mastering AI, machine learning, and deep learning through our interactive
              platform.
            </p>

            {/* Testimonial */}
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20">
              <p className="text-zinc-300 italic mb-4">
                "NeuraCamp helped me transition from a software developer to an AI specialist in just 6 months. The
                courses and community are incredible!"
              </p>
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                  JS
                </div>
                <div className="ml-3 text-left">
                  <p className="text-white font-medium">Jamie Smith</p>
                  <p className="text-zinc-500 text-sm">AI Engineer @ TechCorp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

