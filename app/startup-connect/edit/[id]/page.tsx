import type { Metadata } from "next"
import { SidebarProvider } from "@/components/ui/sidebar"
import StartupFormContent from "@/components/startup-connect/startup-form-content"

interface EditStartupPageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: "Edit Startup | NeuraCamp",
  description: "Edit your startup details",
}

export default function EditStartupPage({ params }: EditStartupPageProps) {
  return (
    <SidebarProvider>
      <StartupFormContent mode="edit" startupId={params.id} />
    </SidebarProvider>
  )
}

