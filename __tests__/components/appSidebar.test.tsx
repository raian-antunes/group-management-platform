import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import "@testing-library/jest-dom"
import { AppSidebar } from "@/components/appSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

// Mock do componente SignOutButton
vi.mock("@/components/signOutButton", () => ({
  default: () => <button>Sign Out</button>,
}))

// Helper para renderizar com SidebarProvider
const renderWithProvider = async (role: string) => {
  const component = await AppSidebar({ role })
  return render(<SidebarProvider>{component}</SidebarProvider>)
}

describe("Componente AppSidebar", () => {
  describe("Renderização", () => {
    it("renderiza a sidebar com role no cabeçalho", async () => {
      await renderWithProvider("admin")
      expect(screen.getByText("Dashboard (admin)")).toBeInTheDocument()
    })

    it("renderiza label do menu público", async () => {
      await renderWithProvider("user")
      expect(screen.getByText("Menu Público")).toBeInTheDocument()
    })

    it("renderiza label do menu privado", async () => {
      await renderWithProvider("admin")
      expect(screen.getByText("Menu Privado")).toBeInTheDocument()
    })
  })

  describe("Itens do Menu Público", () => {
    it("renderiza link 'Avisos e Comunicados' para todos os roles", async () => {
      await renderWithProvider("user")
      const link = screen.getByRole("link", { name: /Avisos e Comunicados/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute("href", "/dashboard/announcements")
    })

    it("renderiza itens do menu público para role admin", async () => {
      await renderWithProvider("admin")
      const link = screen.getByRole("link", { name: /Avisos e Comunicados/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute("href", "/dashboard/announcements")
    })
  })

  describe("Itens do Menu Privado - Role User", () => {
    it("renderiza link 'Dados do Usuário' para role user", async () => {
      await renderWithProvider("user")
      const link = screen.getByRole("link", { name: /Dados do Usuário/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute("href", "/dashboard/user/edit")
    })

    it("não renderiza link 'Intenções' para role user", async () => {
      await renderWithProvider("user")
      const link = screen.queryByRole("link", { name: /Intenções/i })
      expect(link).not.toBeInTheDocument()
    })
  })

  describe("Itens do Menu Privado - Role Admin", () => {
    it("renderiza link 'Intenções' para role admin", async () => {
      await renderWithProvider("admin")
      const link = screen.getByRole("link", { name: /Intenções/i })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute("href", "/dashboard/intentions")
    })

    it("não renderiza link 'Dados do Usuário' para role admin", async () => {
      await renderWithProvider("admin")
      const link = screen.queryByRole("link", { name: /Dados do Usuário/i })
      expect(link).not.toBeInTheDocument()
    })
  })

  describe("Rodapé", () => {
    it("renderiza SignOutButton no rodapé", async () => {
      await renderWithProvider("user")
      expect(screen.getByText("Sign Out")).toBeInTheDocument()
    })
  })

  describe("Renderização baseada em role", () => {
    it("exibe cabeçalho correto para role user", async () => {
      await renderWithProvider("user")
      expect(screen.getByText("Dashboard (user)")).toBeInTheDocument()
    })

    it("exibe cabeçalho correto para role admin", async () => {
      await renderWithProvider("admin")
      expect(screen.getByText("Dashboard (admin)")).toBeInTheDocument()
    })
  })

  describe("Estrutura do Menu", () => {
    it("tem número correto de links para role user", async () => {
      await renderWithProvider("user")
      const links = screen.getAllByRole("link")
      // 1 public menu item + 1 private menu item = 2 links
      expect(links).toHaveLength(2)
    })

    it("tem número correto de links para role admin", async () => {
      await renderWithProvider("admin")
      const links = screen.getAllByRole("link")
      // 1 public menu item + 1 private menu item = 2 links
      expect(links).toHaveLength(2)
    })
  })
})
