"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface ServiceCardProps {
  title: string
  description: string
  image: string
  link: string
  tags: string[]
  index: number
}

export function ServiceCard({ title, description, image, link, tags, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden border-purple-500/20 bg-black/40 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
        <div className="aspect-video w-full overflow-hidden">
          <motion.img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <CardContent className="p-6">
          <div className="mb-3 flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <Badge key={i} className="bg-purple-900/50 text-purple-200 hover:bg-purple-800">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
          <p className="mb-4 text-sm text-gray-300">{description}</p>
          <Link href={link}>
            <Button
              variant="outline"
              className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-900/30 hover:text-white"
            >
              Explore
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}

