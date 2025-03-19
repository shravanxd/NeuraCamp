"use client"

import { Flame } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface StreakReminderProps {
  days: number
}

export function StreakReminder({ days }: StreakReminderProps) {
  return (
    <Alert className="bg-orange-500/10 border-orange-500/20">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20">
          <Flame className="h-5 w-5 text-orange-500" />
        </div>
        <div className="flex-1">
          <AlertTitle className="flex items-center gap-2 text-orange-500">
            <span>{days}-Day Streak!</span>
          </AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <div className="text-sm">Keep learning daily to maintain your streak!</div>
            <div className="flex items-center gap-2">
              <Progress value={(days % 10) * 10} className="h-2 flex-1" />
              <span className="text-xs font-medium">{days % 10}/10 days to next badge</span>
            </div>
          </AlertDescription>
        </div>
        <Button size="sm" variant="outline" className="shrink-0">
          Practice Now
        </Button>
      </div>
    </Alert>
  )
}

