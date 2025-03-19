"use client"

import { useEffect, useRef } from "react"

export function ParticleField() {
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

    // Create particles
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 25))
    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      pulseSpeed: number
      pulseState: number
    }[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.4 + 0.1,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        pulseState: Math.random(),
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Update pulse state
        particle.pulseState += particle.pulseSpeed
        if (particle.pulseState > 1) particle.pulseState = 0

        // Calculate pulse effect
        const pulseEffect = Math.sin(particle.pulseState * Math.PI * 2)
        const size = particle.size * (1 + pulseEffect * 0.2)
        const opacity = particle.opacity * (1 + pulseEffect * 0.3)

        // Wrap around edges
        if (particle.x < 0) particle.x = window.innerWidth
        if (particle.x > window.innerWidth) particle.x = 0
        if (particle.y < 0) particle.y = window.innerHeight
        if (particle.y > window.innerHeight) particle.y = 0

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, size * 2)

        gradient.addColorStop(0, `rgba(186, 104, 200, ${opacity})`)
        gradient.addColorStop(1, "rgba(186, 104, 200, 0)")

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Draw particle core
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220, 180, 255, ${opacity})`
        ctx.fill()
      })

      // Draw connections
      ctx.strokeStyle = "rgba(186, 104, 200, 0.05)"
      ctx.lineWidth = 0.5

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            // Opacity based on distance
            const opacity = 0.05 * (1 - distance / 150)

            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(186, 104, 200, ${opacity})`
            ctx.stroke()
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-40 pointer-events-none" />
}

