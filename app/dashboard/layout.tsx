import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/appSidebar"
import { getCurrentUser } from "@/lib/dal/user"

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
      <main className="h-screen w-full">
        <SidebarTrigger />
        <div className="p-7 w-full">{children}</div>
      </main>
    </SidebarProvider>
  )
}
