import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { JobsContent } from "@/components/jobs/jobs-content"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function JobsPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto bg-muted/20">
            <JobsContent />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

