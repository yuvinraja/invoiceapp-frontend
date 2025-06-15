"use client"

import { LayoutDashboard, FileText, Settings, LogOut, Building2, Plus, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import Link from "next/link"

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & analytics",
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: FileText,
    description: "Manage all invoices",
  },
  // {
  //   title: "Analytics",
  //   url: "/analytics",
  //   icon: BarChart3,
  //   description: "Reports & insights",
  // },
]

const secondaryMenuItems = [
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout")
    }
  }

  return (
    <Sidebar className="border-r-2">
      <SidebarHeader className="border-b-2 bg-muted/30">
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground">
            <Building2 className="h-5 w-5 text-background" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base truncate">InvoiceGST</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Quick Actions */}
        <SidebarGroup className="py-4">
          <SidebarGroupContent>
            <Button asChild className="w-full justify-start h-10">
              <Link href="/invoices/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* Main Navigation */}
        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12 px-3">
                    <Link href={item.url} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* Secondary Navigation */}
        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 px-3">
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t-2 bg-muted/30 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="px-2 py-3">
              <Button variant="outline" className="w-full justify-start h-10 bg-background" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
