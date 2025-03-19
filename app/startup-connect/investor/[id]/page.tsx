import type { Metadata } from "next"
import { SidebarProvider } from "@/components/ui/sidebar"
import InvestorDetailContent from "@/components/startup-connect/investor-detail-content"

interface InvestorDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: InvestorDetailPageProps): Promise<Metadata> {
  try {
    const investors = await import("@/data/investors.json")
    const investor = investors.default.find((i: any) => i.id === params.id)

    if (!investor) {
      return {
        title: "Investor Not Found | NeuraCamp",
      }
    }

    return {
      title: `${investor.name} | NeuraCamp`,
      description: investor.description,
    }
  } catch (error) {
    return {
      title: "Investor | NeuraCamp",
      description: "View investor details",
    }
  }
}

export default function InvestorDetailPage({ params }: InvestorDetailPageProps) {
  return (
    <SidebarProvider>
      <InvestorDetailContent investorId={params.id} />
    </SidebarProvider>
  )
}

