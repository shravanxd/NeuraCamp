import type { Metadata } from "next"
import { SidebarProvider } from "@/components/ui/sidebar"
import StartupFormContent from "@/components/startup-connect/startup-form-content"

export const metadata: Metadata = {
  title: "Create Startup | NeuraCamp",
  description: "Submit your startup idea and connect with investors",
}

export default function CreateStartupPage() {
  return (
    <SidebarProvider>
      <StartupFormContent mode="create" />
    </SidebarProvider>
  )
}

