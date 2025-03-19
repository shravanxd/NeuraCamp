"use client"

import {
  Award,
  BookOpen,
  Code,
  Compass,
  LineChart,
  MessageSquare,
  Rocket,
  Trophy,
  Users,
  Briefcase,
  Lightbulb,
  DollarSign,
  Cpu,
  GitBranch,
  User,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"

export function DashboardSidebar() {
  return (
    <>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r">
        <SidebarHeader className="flex h-16 items-center border-b px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Rocket className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">NeuraCamp</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Learning</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Dashboard" asChild>
                    <a href="/dashboard">
                      <Rocket className="h-5 w-5" />
                      <span>Dashboard</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="My Courses" asChild>
                    <a href="/my-courses">
                      <BookOpen className="h-5 w-5" />
                      <span>My Courses</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Learning Tracks" asChild>
                    <a href="/tracks">
                      <GitBranch className="h-5 w-5" />
                      <span>Learning Tracks</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Browse Courses" asChild>
                    <a href="/courses">
                      <Compass className="h-5 w-5" />
                      <span>Browse Courses</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Practice Arena" asChild>
                    <a href="/practice">
                      <Code className="h-5 w-5" />
                      <span>Practice Arena</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Virtual Machines" asChild>
                    <a href="/virtual-machines">
                      <Cpu className="h-5 w-5" />
                      <span>Virtual Machines</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Marketplace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Job Board" asChild>
                    <a href="/jobs">
                      <Briefcase className="h-5 w-5" />
                      <span>Job Board</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Freelance Projects" asChild>
                    <a href="/freelance-projects">
                      <DollarSign className="h-5 w-5" />
                      <span>Freelance Projects</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Startup Connect" asChild>
                    <a href="/startup-connect">
                      <Lightbulb className="h-5 w-5" />
                      <span>Startup Connect</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Community</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Competitions">
                    <Trophy className="h-5 w-5" />
                    <span>Competitions</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Community">
                    <Users className="h-5 w-5" />
                    <span>Community</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Personal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Profile" asChild>
                    <a href="/profile">
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Analytics">
                    <LineChart className="h-5 w-5" />
                    <span>Analytics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Achievements">
                    <Award className="h-5 w-5" />
                    <span>Achievements</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Need help?</span>
            </div>
            <div className="text-xs text-muted-foreground">Contact support or visit our help center</div>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  )
}

