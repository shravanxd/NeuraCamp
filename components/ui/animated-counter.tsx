"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
}

export function AnimatedCounter({ value, duration = 1000, className }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      if (progress < duration) {
        setCount(Math.floor((value * progress) / duration))
        animationFrame = requestAnimationFrame(updateCount)
      } else {
        setCount(value)
      }
    }

    animationFrame = requestAnimationFrame(updateCount)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [value, duration])

  return <span className={cn("tabular-nums", className)}>{count}</span>
}

