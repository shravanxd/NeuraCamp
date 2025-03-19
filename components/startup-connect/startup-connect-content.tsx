"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import StartupsList from "./startups-list"
import InvestorsList from "./investors-list"
import MyStartups from "./my-startups"
import MyConnections from "./my-connections"
import { useToast } from "@/hooks/use-toast"

export default function StartupConnectContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleCreateStartup = () => {
    router.push("/startup-connect/create")
  }

  return (
    <div className="flex flex-col h-screen">
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Startup Connect</h1>
              <p className="text-sm text-muted-foreground">Connect with investors and showcase your startup ideas</p>
            </div>
            <Button onClick={handleCreateStartup}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Submit Startup Idea
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search startups or investors..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="startups" className="space-y-4">
            <TabsList>
              <TabsTrigger value="startups">Browse Startups</TabsTrigger>
              <TabsTrigger value="investors">Browse Investors</TabsTrigger>
              <TabsTrigger value="my-startups">My Startups</TabsTrigger>
              <TabsTrigger value="my-connections">My Connections</TabsTrigger>
            </TabsList>

            <TabsContent value="startups" className="space-y-4">
              <StartupsList searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="investors" className="space-y-4">
              <InvestorsList searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="my-startups" className="space-y-4">
              <MyStartups />
            </TabsContent>

            <TabsContent value="my-connections" className="space-y-4">
              <MyConnections />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </div>
  )
}

