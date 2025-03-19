"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Users, BookOpen, Server, Award } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "50,000+",
      label: "Users Worldwide",
      description: "Professionals and learners from 120+ countries",
    },
    {
      icon: BookOpen,
      value: "200+",
      label: "AI-Audited Courses",
      description: "Curated and verified by industry experts",
    },
    {
      icon: Server,
      value: "10,000+",
      label: "GPU Hours Monthly",
      description: "Powering AI research and development",
    },
    {
      icon: Award,
      value: "$15M+",
      label: "Investment Facilitated",
      description: "Connecting startups with capital",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-900/30">
                  <Icon className="h-6 w-6 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="mb-1 text-sm font-medium text-purple-300">{stat.label}</p>
                <p className="text-xs text-gray-400">{stat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

