import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { JobDetailContent } from "@/components/jobs/job-detail-content"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function JobDetailPage({ params }: { params: { jobId: string } }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto bg-muted/20">
            <JobDetailContent jobId={params.jobId} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

