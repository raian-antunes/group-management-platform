import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import "@testing-library/jest-dom"
import EditUserPage from "@/app/dashboard/user/edit/page"

// Mock da função getCurrentUser
const mockGetCurrentUser = vi.fn()
vi.mock("@/lib/dal/user", () => ({
  getCurrentUser: () => mockGetCurrentUser(),
}))

// Mock do componente FormUser
vi.mock("@/components/layout/form/formUser", () => ({
  default: ({
    user,
  }: {
    user: { id: string; name: string; email: string }
  }) => (
    <div data-testid="form-user">
      Form User Mock - {user.name} ({user.email})
    </div>
  ),
}))

describe("Edit User Page", () => {
  describe("Renderização com usuário", () => {
    const mockUser = {
      id: "user-1",
      name: "João Silva",
      email: "joao@example.com",
      role: "user",
      createdAt: new Date(),
    }

    it("renderiza o card quando há usuário", async () => {
      mockGetCurrentUser.mockResolvedValue(mockUser)
      const component = await EditUserPage()
      render(component)

      expect(screen.getByText("Dados do usuário")).toBeInTheDocument()
    })

    it("renderiza o título do card", async () => {
      mockGetCurrentUser.mockResolvedValue(mockUser)
      const component = await EditUserPage()
      render(component)

      expect(screen.getByText("Dados do usuário")).toBeInTheDocument()
    })

    it("renderiza o FormUser com os dados do usuário", async () => {
      mockGetCurrentUser.mockResolvedValue(mockUser)
      const component = await EditUserPage()
      render(component)

      const form = screen.getByTestId("form-user")
      expect(form).toBeInTheDocument()
      expect(form.textContent).toContain("João Silva")
      expect(form.textContent).toContain("joao@example.com")
    })

    it("passa o usuário correto para o FormUser", async () => {
      const customUser = {
        id: "user-2",
        name: "Maria Santos",
        email: "maria@example.com",
        role: "admin",
        createdAt: new Date(),
      }

      mockGetCurrentUser.mockResolvedValue(customUser)
      const component = await EditUserPage()
      render(component)

      const form = screen.getByTestId("form-user")
      expect(form.textContent).toContain("Maria Santos")
      expect(form.textContent).toContain("maria@example.com")
    })
  })

  describe("Renderização sem usuário", () => {
    it("retorna null quando não há usuário", async () => {
      mockGetCurrentUser.mockResolvedValue(null)
      const component = await EditUserPage()

      expect(component).toBeNull()
    })

    it("não renderiza o card quando usuário é null", async () => {
      mockGetCurrentUser.mockResolvedValue(null)
      const component = await EditUserPage()

      if (component) {
        render(component)
        expect(screen.queryByText("Dados do usuário")).not.toBeInTheDocument()
      }
    })
  })

  describe("Estrutura do Card", () => {
    it("card tem classes de responsividade corretas", async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: "1",
        name: "Teste",
        email: "teste@example.com",
        role: "user",
        createdAt: new Date(),
      })
      const component = await EditUserPage()
      const { container } = render(component)

      const card = container.querySelector(".w-full.max-w-lg")
      expect(card).toBeInTheDocument()
    })

    it("container principal tem classes de layout corretas", async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: "1",
        name: "Teste",
        email: "teste@example.com",
        role: "user",
        createdAt: new Date(),
      })
      const component = await EditUserPage()
      const { container } = render(component)

      const mainDiv = container.querySelector(".flex.flex-col.gap-6")
      expect(mainDiv).toBeInTheDocument()
      expect(mainDiv).toHaveClass("items-center", "w-full", "px-4", "py-8")
    })

    it("renderiza CardHeader e CardContent", async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: "1",
        name: "Teste",
        email: "teste@example.com",
        role: "user",
        createdAt: new Date(),
      })
      const component = await EditUserPage()
      render(component)

      expect(screen.getByText("Dados do usuário")).toBeInTheDocument()
      expect(screen.getByTestId("form-user")).toBeInTheDocument()
    })
  })

  describe("Integração com DAL", () => {
    it("chama getCurrentUser ao renderizar", async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: "1",
        name: "Teste",
        email: "teste@example.com",
        role: "user",
        createdAt: new Date(),
      })
      mockGetCurrentUser.mockClear()
      await EditUserPage()

      expect(mockGetCurrentUser).toHaveBeenCalled()
    })

    it("utiliza os dados retornados por getCurrentUser", async () => {
      const userData = {
        id: "custom-id",
        name: "Nome Customizado",
        email: "custom@example.com",
        role: "admin",
        createdAt: new Date("2025-01-10"),
      }

      mockGetCurrentUser.mockResolvedValue(userData)
      const component = await EditUserPage()
      render(component)

      const form = screen.getByTestId("form-user")
      expect(form.textContent).toContain("Nome Customizado")
      expect(form.textContent).toContain("custom@example.com")
    })
  })

  describe("Estados do Usuário", () => {
    it("renderiza corretamente para usuário com role 'user'", async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: "1",
        name: "User Normal",
        email: "user@example.com",
        role: "user",
        createdAt: new Date(),
      })
      const component = await EditUserPage()
      render(component)

      expect(screen.getByTestId("form-user")).toBeInTheDocument()
    })

    it("renderiza corretamente para usuário com role 'admin'", async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: "2",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        createdAt: new Date(),
      })
      const component = await EditUserPage()
      render(component)

      expect(screen.getByTestId("form-user")).toBeInTheDocument()
    })
  })

  describe("Layout Responsivo", () => {
    it("aplica padding correto no container", async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: "1",
        name: "Teste",
        email: "teste@example.com",
        role: "user",
        createdAt: new Date(),
      })
      const component = await EditUserPage()
      const { container } = render(component)

      const mainDiv = container.querySelector("div")
      expect(mainDiv).toHaveClass("px-4", "py-8")
    })

    it("card tem largura máxima definida", async () => {
      mockGetCurrentUser.mockResolvedValue({
        id: "1",
        name: "Teste",
        email: "teste@example.com",
        role: "user",
        createdAt: new Date(),
      })
      const component = await EditUserPage()
      const { container } = render(component)

      const card = container.querySelector('[class*="max-w-lg"]')
      expect(card).toBeInTheDocument()
    })
  })
})
