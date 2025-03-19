"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedTextProps {
  text: string
  className?: string
  once?: boolean
}

export function AnimatedText({ text, className = "", once = false }: AnimatedTextProps) {
  const words = text.split(" ")

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      {words.map((word, index) => (
        <motion.span key={index} className="inline-block mr-2" variants={child}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

interface AnimatedTitleProps {
  children: ReactNode
  className?: string
  delay?: number
  once?: boolean
}

export function AnimatedTitle({ children, className = "", delay = 0, once = false }: AnimatedTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, type: "spring" }}
      viewport={{ once }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedFadeIn({ children, className = "", delay = 0, once = false }: AnimatedTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.2, delay }}
      viewport={{ once }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

