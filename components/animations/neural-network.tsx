"use client"

import { useEffect, useRef } from "react"

interface Neuron {
  x: number
  y: number
  size: number
  pulseSpeed: number
  pulseState: number
  connections: Connection[]
}

interface Connection {
  from: number
  to: number
  width: number
  active: boolean
  pulsePosition: number
  pulseSpeed: number
  pulseSize: number
  pulseColor: string
}

export function NeuralNetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size with device pixel ratio for sharpness
    const resizeCanvas = () => {
      if (!containerRef.current || !canvas || !ctx) return

      const { width, height } = containerRef.current.getBoundingClientRect()
      const pixelRatio = window.devicePixelRatio || 1

      // Set display size (css pixels)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      // Set actual size in memory (scaled to account for extra pixel density)
      canvas.width = Math.floor(width * pixelRatio)
      canvas.height = Math.floor(height * pixelRatio)

      // Normalize coordinate system to use css pixels
      ctx.scale(pixelRatio, pixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create neurons
    const neurons: Neuron[] = []
    const connections: Connection[] = []

    const initializeNetwork = () => {
      neurons.length = 0
      connections.length = 0

      if (!canvas) return

      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      // Create a more organic neural network
      const layerCount = 4
      const neuronsPerLayer = [6, 8, 8, 5]

      // Create neurons in layers
      for (let layer = 0; layer < layerCount; layer++) {
        const count = neuronsPerLayer[layer]
        const layerX = (layer + 1) * (width / (layerCount + 1))

        for (let i = 0; i < count; i++) {
          // Add some randomness to y position for more organic look
          const baseY = (i + 1) * (height / (count + 1))
          const variance = height * 0.05
          const y = baseY + (Math.random() * variance * 2 - variance)

          neurons.push({
            x: layerX,
            y,
            size: 3 + Math.random() * 2,
            pulseSpeed: 0.02 + Math.random() * 0.03,
            pulseState: Math.random(),
            connections: [],
          })
        }
      }

      // Connect neurons between adjacent layers
      let layerStartIndex = 0
      for (let layer = 0; layer < layerCount - 1; layer++) {
        const nextLayerStartIndex = layerStartIndex + neuronsPerLayer[layer]

        // Connect each neuron in this layer to some neurons in the next layer
        for (let i = layerStartIndex; i < nextLayerStartIndex; i++) {
          const connectionsCount = 1 + Math.floor(Math.random() * 3) // 1-3 connections per neuron

          // Create unique connections
          const targetIndices = new Set<number>()
          while (targetIndices.size < connectionsCount && targetIndices.size < neuronsPerLayer[layer + 1]) {
            const targetIndex = nextLayerStartIndex + Math.floor(Math.random() * neuronsPerLayer[layer + 1])
            targetIndices.add(targetIndex)
          }

          // Create the connections
          for (const targetIndex of targetIndices) {
            const connection: Connection = {
              from: i,
              to: targetIndex,
              width: 0.5 + Math.random() * 1,
              active: Math.random() > 0.5,
              pulsePosition: Math.random(),
              pulseSpeed: 0.005 + Math.random() * 0.01,
              pulseSize: 2 + Math.random() * 2,
              pulseColor: `rgba(${150 + Math.floor(Math.random() * 50)}, ${100 + Math.floor(Math.random() * 50)}, ${200 + Math.floor(Math.random() * 55)}, 0.8)`,
            }

            connections.push(connection)
            neurons[i].connections.push(connection)
          }
        }

        layerStartIndex = nextLayerStartIndex
      }
    }

    initializeNetwork()
    window.addEventListener("resize", initializeNetwork)

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return

      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Update and draw connections
      connections.forEach((conn) => {
        const from = neurons[conn.from]
        const to = neurons[conn.to]

        // Draw connection line
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = "rgba(102, 51, 153, 0.15)"
        ctx.lineWidth = conn.width
        ctx.stroke()

        // Update pulse
        if (conn.active) {
          conn.pulsePosition += conn.pulseSpeed
          if (conn.pulsePosition > 1) {
            conn.pulsePosition = 0
            // 80% chance to remain active
            conn.active = Math.random() > 0.2
          }

          // Draw pulse
          const x = from.x + (to.x - from.x) * conn.pulsePosition
          const y = from.y + (to.y - from.y) * conn.pulsePosition

          const gradient = ctx.createRadialGradient(x, y, 0, x, y, conn.pulseSize)
          gradient.addColorStop(0, conn.pulseColor)
          gradient.addColorStop(1, "rgba(186, 104, 200, 0)")

          ctx.beginPath()
          ctx.arc(x, y, conn.pulseSize, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        } else if (Math.random() > 0.995) {
          // Small chance to activate an inactive connection
          conn.active = true
        }
      })

      // Update and draw neurons
      neurons.forEach((neuron, index) => {
        // Update pulse state
        neuron.pulseState += neuron.pulseSpeed
        if (neuron.pulseState > 1) neuron.pulseState = 0

        // Calculate pulse effect
        const pulseEffect = Math.sin(neuron.pulseState * Math.PI) * 0.5
        const size = neuron.size * (1 + pulseEffect * 0.3)

        // Draw neuron with glow effect
        const gradient = ctx.createRadialGradient(neuron.x, neuron.y, 0, neuron.x, neuron.y, size * 2)

        gradient.addColorStop(0, "rgba(186, 104, 200, 0.8)")
        gradient.addColorStop(0.5, "rgba(186, 104, 200, 0.3)")
        gradient.addColorStop(1, "rgba(186, 104, 200, 0)")

        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Draw neuron core
        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, size * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(220, 180, 255, 0.9)"
        ctx.fill()

        // Randomly activate connections
        if (Math.random() > 0.99) {
          neuron.connections.forEach((conn) => {
            if (!conn.active && Math.random() > 0.7) {
              conn.active = true
              conn.pulsePosition = 0
            }
          })
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("resize", initializeNetwork)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

