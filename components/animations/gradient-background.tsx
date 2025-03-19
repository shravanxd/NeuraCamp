"use client"

import { useEffect, useRef } from "react"

export function GradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size with device pixel ratio for sharpness
    const resizeCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1

      // Set display size (css pixels)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`

      // Set actual size in memory (scaled to account for extra pixel density)
      canvas.width = Math.floor(window.innerWidth * pixelRatio)
      canvas.height = Math.floor(window.innerHeight * pixelRatio)

      // Normalize coordinate system to use css pixels
      ctx.scale(pixelRatio, pixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation variables
    let time = 0
    const speed = 0.0003

    // Animation loop
    const animate = () => {
      time += speed

      const width = window.innerWidth
      const height = window.innerHeight

      // Create gradient
      const gradient = ctx.createLinearGradient(
        width * (0.5 + 0.3 * Math.sin(time)),
        0,
        width * (0.5 + 0.3 * Math.cos(time)),
        height,
      )

      gradient.addColorStop(0, "rgba(20, 10, 30, 1)")
      gradient.addColorStop(0.5, "rgba(40, 15, 60, 1)")
      gradient.addColorStop(1, "rgba(10, 5, 20, 1)")

      // Fill background
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Add subtle noise texture
      addNoiseTexture(ctx, width, height, time)

      animationRef.current = requestAnimationFrame(animate)
    }

    // Function to add subtle noise texture
    const addNoiseTexture = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
      // Create a subtle noise pattern
      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data

      // Only process a subset of pixels for performance
      const step = 8

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const i = (y * width + x) * 4

          // Skip if outside bounds
          if (i >= data.length) continue

          // Add very subtle noise
          const noise = Math.sin(x * 0.01 + time) * Math.cos(y * 0.01 + time) * 5

          data[i] = Math.min(255, Math.max(0, data[i] + noise))
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-1]" />
}

