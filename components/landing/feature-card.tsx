"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  delay?: number
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: "spring" }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <Card className="h-full overflow-hidden border-purple-500/20 bg-black/40 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
        <CardContent className="p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-900/30">
            <Icon className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
          <p className="text-sm text-gray-300">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

