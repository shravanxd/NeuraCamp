"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Expand, Pause, Play, Settings, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"

export function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)

  // Mock video duration in seconds
  const duration = 1520 // 25:20

  // Format time from seconds to MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="relative">
      <div className="relative aspect-video w-full bg-black">
        <img
          src="/placeholder.svg?height=720&width=1280"
          alt="Video thumbnail"
          className="h-full w-full object-cover"
        />

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="icon"
              className="h-16 w-16 rounded-full bg-primary/80 hover:bg-primary"
              onClick={() => setIsPlaying(true)}
            >
              <Play className="h-8 w-8" />
            </Button>
          </div>
        )}
      </div>

      <div className="bg-background p-2">
        <div className="flex items-center gap-2">
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            className="flex-1"
            onValueChange={(value) => setCurrentTime(value[0])}
          />
          <span className="text-xs tabular-nums text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider value={[isMuted ? 0 : 75]} max={100} step={1} className="w-24" />
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setShowTranscript(!showTranscript)}
            >
              {showTranscript ? "Hide Transcript" : "Show Transcript"}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {showTranscript && (
        <div className="mt-2 border-t">
          <Tabs defaultValue="transcript">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-2 pt-2">
              <TabsTrigger value="transcript" className="rounded-t-md rounded-b-none">
                Transcript
              </TabsTrigger>
              <TabsTrigger value="notes" className="rounded-t-md rounded-b-none">
                Notes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="transcript" className="mt-0">
              <ScrollArea className="h-40">
                <div className="space-y-2 p-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-xs tabular-nums text-muted-foreground">{formatTime(i * 150)}</span>
                      <p className="text-sm">
                        {i === 0
                          ? "Welcome to our lesson on Support Vector Machines. Today we'll be exploring one of the most powerful classification algorithms in machine learning."
                          : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="notes" className="mt-0">
              <div className="p-4">
                <p className="text-sm text-muted-foreground">
                  Your notes for this video will appear here. You can add notes while watching the video.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

