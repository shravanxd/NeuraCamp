import type { Metadata } from "next"
import { SidebarProvider } from "@/components/ui/sidebar"
import StartupDetailContent from "@/components/startup-connect/startup-detail-content"

interface StartupDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: StartupDetailPageProps): Promise<Metadata> {
  try {
    const startups = await import("@/data/startups.json")
    const startup = startups.default.find((s: any) => s.id === params.id)

    if (!startup) {
      return {
        title: "Startup Not Found | NeuraCamp",
      }
    }

    return {
      title: `${startup.name} | NeuraCamp`,
      description: startup.description,
    }
  } catch (error) {
    return {
      title: "Startup | NeuraCamp",
      description: "View startup details",
    }
  }
}

export default function StartupDetailPage({ params }: StartupDetailPageProps) {
  return (
    <SidebarProvider>
      <StartupDetailContent startupId={params.id} />
    </SidebarProvider>
  )
}

