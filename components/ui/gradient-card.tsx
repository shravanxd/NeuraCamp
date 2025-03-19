import type React from "react"
import { cn } from "@/lib/utils"

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "success" | "warning" | "danger"
}

export function GradientCard({ children, className, variant = "primary", ...props }: GradientCardProps) {
  const gradientClasses = {
    primary: "bg-gradient-to-br from-purple-900 to-purple-600",
    secondary: "bg-gradient-to-br from-gray-900 to-gray-700",
    success: "bg-gradient-to-br from-green-900 to-green-600",
    warning: "bg-gradient-to-br from-yellow-900 to-yellow-600",
    danger: "bg-gradient-to-br from-red-900 to-red-600",
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-purple-500/10 p-6 shadow-lg",
        gradientClasses[variant],
        className,
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 z-0 bg-black/40"></div>
      <div className="absolute -bottom-4 -right-4 z-0 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl"></div>
      <div className="absolute -top-4 -left-4 z-0 h-24 w-24 rounded-full bg-purple-400/20 blur-2xl"></div>
    </div>
  )
}

