"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  company: string
  avatar: string
  rating: number
  index: number
}

export function TestimonialCard({ quote, author, role, company, avatar, rating, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="h-full border-purple-500/20 bg-black/40 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
        <CardContent className="p-6">
          <div className="mb-4 flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-purple-500 text-purple-500" : "text-gray-600"}`} />
            ))}
          </div>

          <p className="mb-6 text-gray-300 italic">"{quote}"</p>

          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-purple-500/30">
              <AvatarImage src={avatar} alt={author} />
              <AvatarFallback className="bg-purple-900 text-purple-200">{author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-white">{author}</p>
              <p className="text-sm text-gray-400">{role}</p>
              <p className="text-xs text-purple-400">{company}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

