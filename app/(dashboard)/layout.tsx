import type React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import Protected from "@/components/auth/Protected"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Protected>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">GST Invoice Management</h2>
            </div>
          </header>
          <main className="flex-1 p-6 bg-muted/20">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </Protected>
  )
}
