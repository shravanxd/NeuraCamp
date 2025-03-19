"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PracticeQuestions } from "./practice-questions"
import { PracticeProgress } from "./practice-progress"
import { PracticeCompetitions } from "./practice-competitions"
import { PracticeLeaderboard } from "./practice-leaderboard"

export function PracticeContent() {
  const [activeTab, setActiveTab] = useState("questions")

  return (
    <div className="flex flex-col h-full">
      <div className="border-b">
        <div className="container py-4">
          <h1 className="text-3xl font-bold">Practice Arena</h1>
          <p className="text-muted-foreground mt-1">
            Sharpen your coding skills with practice problems, competitions, and challenges
          </p>
        </div>
      </div>
      <div className="container py-6 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-6">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
            <TabsTrigger value="competitions">Competitions</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          <TabsContent value="questions" className="flex-1">
            <PracticeQuestions />
          </TabsContent>
          <TabsContent value="progress" className="flex-1">
            <PracticeProgress />
          </TabsContent>
          <TabsContent value="competitions" className="flex-1">
            <PracticeCompetitions />
          </TabsContent>
          <TabsContent value="leaderboard" className="flex-1">
            <PracticeLeaderboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

