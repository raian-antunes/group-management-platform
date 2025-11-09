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

const PUBLIC_MENU = [
  { label: "Avisos e Comunicados", url: "/dashboard/announcements" },
]

const MENU = {
  user: [{ label: "Dados do Usuário", url: "/dashboard/user/edit" }],
  admin: [{ label: "Intenções", url: "/dashboard/intentions" }],
}

export async function AppSidebar({ role }: AppSidebarProps) {
  const publicMenus = [...PUBLIC_MENU]
  const items = [...MENU[role as keyof typeof MENU]]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader>Dashboard ({role})</SidebarHeader>
          <SidebarSeparator className="my-2" />
          <SidebarGroupLabel>Menu Público</SidebarGroupLabel>
          <SidebarMenu>
            {publicMenus.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarSeparator className="my-2" />
          <SidebarGroupLabel>Menu Privado</SidebarGroupLabel>
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
