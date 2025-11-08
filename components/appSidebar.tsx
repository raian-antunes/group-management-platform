import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import SignOutButton from "./signOutButton"

type AppSidebarProps = {
  role: string
}

const MENU = {
  user: [{ label: "Dados do Usuário", url: "/dashboard/user/edit" }],
  admin: [{ label: "Intenções", url: "/dashboard/intentions" }],
}

export async function AppSidebar({ role }: AppSidebarProps) {
  const items = [...MENU[role as keyof typeof MENU]]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader>Dashboard ({role})</SidebarHeader>
          <SidebarSeparator className="my-2" />
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuButton asChild>
          <SignOutButton />
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
