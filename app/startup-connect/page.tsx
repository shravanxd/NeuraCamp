import type { Metadata } from "next"
import { SidebarProvider } from "@/components/ui/sidebar"
import StartupConnectContent from "@/components/startup-connect/startup-connect-content"

export const metadata: Metadata = {
  title: "Startup Connect | NeuraCamp",
  description: "Connect with investors and showcase your startup ideas",
}

export default function StartupConnectPage() {
  return (
    <SidebarProvider>
      <StartupConnectContent />
    </SidebarProvider>
  )
}

