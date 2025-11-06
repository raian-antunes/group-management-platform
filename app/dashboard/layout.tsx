import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/appSidebar"
import { getCurrentUser } from "@/lib/dal"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) return null
  return (
    <SidebarProvider>
      <AppSidebar role={user.role} />
      <SidebarTrigger />
      <main className="flex items-center justify-center h-screen w-full">
        {children}
      </main>
    </SidebarProvider>
  )
}
