import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import "@testing-library/jest-dom"
import IntentionPage from "@/app/dashboard/intentions/[id]/page"

// Mock das funções
const mockGetIntention = vi.fn()
const mockNotFound = vi.fn()
const mockRedirect = vi.fn()

vi.mock("@/lib/dal/intention", () => ({
  getIntention: (id: string) => mockGetIntention(id),
}))

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation")
  return {
    ...actual,
    notFound: () => mockNotFound(),
    redirect: (url: string) => mockRedirect(url),
  }
})

vi.mock("@/lib/actions/intention", () => ({
  updateIntentionStatusAction: vi.fn(),
}))

describe("Intention Detail Page", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Renderização com intenção existente", () => {
    const mockIntention = {
      id: "intention-1",
      name: "João Silva",
      email: "joao@example.com",
      company: "Empresa Teste LTDA",
      motivation:
        "Quero fazer networking e expandir meus contatos profissionais",
      status: "pending" as const,
      createdAt: new Date("2025-01-15"),
    }

    it("renderiza o card de detalhes", async () => {
      mockGetIntention.mockResolvedValue(mockIntention)
      const component = await IntentionPage({
        params: Promise.resolve({ id: "intention-1" }),
      })
      render(component)

      expect(screen.getByText("Detalhes da Intenção")).toBeInTheDocument()
    })

    it("renderiza o nome da intenção", async () => {
      mockGetIntention.mockResolvedValue(mockIntention)
      const component = await IntentionPage({
        params: Promise.resolve({ id: "intention-1" }),
      })
      render(component)

      const nameInput = screen.getByDisplayValue("João Silva")
      expect(nameInput).toBeInTheDocument()
      expect(nameInput).toBeDisabled()
    })

    it("renderiza o email da intenção", async () => {
      mockGetIntention.mockResolvedValue(mockIntention)
      const component = await IntentionPage({
        params: Promise.resolve({ id: "intention-1" }),
      })
      render(component)

      const emailInput = screen.getByDisplayValue("joao@example.com")
      expect(emailInput).toBeInTheDocument()
      expect(emailInput).toBeDisabled()
    })

    it("renderiza a empresa", async () => {
      mockGetIntention.mockResolvedValue(mockIntention)
      const component = await IntentionPage({
        params: Promise.resolve({ id: "intention-1" }),
      })
      render(component)

      const companyInput = screen.getByDisplayValue("Empresa Teste LTDA")
      expect(companyInput).toBeInTheDocument()
      expect(companyInput).toBeDisabled()
    })

    it("renderiza a motivação", async () => {
      mockGetIntention.mockResolvedValue(mockIntention)
      const component = await IntentionPage({
        params: Promise.resolve({ id: "intention-1" }),
      })
      render(component)

      const motivationTextarea = screen.getByDisplayValue(
        /Quero fazer networking/
      )
      expect(motivationTextarea).toBeInTheDocument()
      expect(motivationTextarea).toBeDisabled()
    })

    it("renderiza a data formatada corretamente", async () => {
      mockGetIntention.mockResolvedValue(mockIntention)
      const component = await IntentionPage({
        params: Promise.resolve({ id: "intention-1" }),
      })
      render(component)

      expect(screen.getByText(/14\/01\/2025/)).toBeInTheDocument()
    })
  })

  describe("Status da Intenção", () => {
    it("renderiza status pendente com cor amarela", async () => {
      mockGetIntention.mockResolvedValue({
        id: "1",
        name: "Test",
        email: "test@example.com",
        company: "Test Co",
        motivation: "Test motivation",
        status: "pending",
        createdAt: new Date(),
      })
      const component = await IntentionPage({
        params: Promise.resolve({ id: "1" }),
      })
      render(component)

      const statusBadge = screen.getByText("Pendente")
      expect(statusBadge).toBeInTheDocument()
      expect(statusBadge).toHaveClass("text-yellow-700")
    })

    it("renderiza status aprovado com cor verde", async () => {
      mockGetIntention.mockResolvedValue({
        id: "1",
        name: "Test",
        email: "test@example.com",
        company: "Test Co",
        motivation: "Test motivation",
        status: "approved",
        createdAt: new Date(),
      })
      const component = await IntentionPage({
        params: Promise.resolve({ id: "1" }),
      })
      render(component)

      const statusBadge = screen.getByText("Aprovado")
      expect(statusBadge).toBeInTheDocument()
      expect(statusBadge).toHaveClass("text-green-700")
    })

    it("renderiza status rejeitado com cor vermelha", async () => {
      mockGetIntention.mockResolvedValue({
        id: "1",
        name: "Test",
        email: "test@example.com",
        company: "Test Co",
        motivation: "Test motivation",
        status: "rejected",
        createdAt: new Date(),
      })
      const component = await IntentionPage({
        params: Promise.resolve({ id: "1" }),
      })
      render(component)

      const statusBadge = screen.getByText("Rejeitado")
      expect(statusBadge).toBeInTheDocument()
      expect(statusBadge).toHaveClass("text-red-700")
    })
  })

  describe("Botões de Ação", () => {
    it("renderiza botão 'Voltar' sempre", async () => {
      mockGetIntention.mockResolvedValue({
        id: "1",
        name: "Test",
        email: "test@example.com",
        company: "Test Co",
        motivation: "Test motivation",
        status: "pending",
        createdAt: new Date(),
      })
      const component = await IntentionPage({
        params: Promise.resolve({ id: "1" }),
      })
      render(component)

      const backButton = screen.getByRole("link", { name: /Voltar/i })
      expect(backButton).toBeInTheDocument()
      expect(backButton).toHaveAttribute("href", "/dashboard/intentions")
    })

    it("renderiza botões Aprovar e Reprovar para status pendente", async () => {
      mockGetIntention.mockResolvedValue({
        id: "1",
        name: "Test",
        email: "test@example.com",
        company: "Test Co",
        motivation: "Test motivation",
        status: "pending",
        createdAt: new Date(),
      })
      const component = await IntentionPage({
        params: Promise.resolve({ id: "1" }),
      })
      render(component)

      expect(
        screen.getByRole("button", { name: /Aprovar/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: /Reprovar/i })
      ).toBeInTheDocument()
    })

    it("não renderiza botões Aprovar/Reprovar para status aprovado", async () => {
      mockGetIntention.mockResolvedValue({
        id: "1",
        name: "Test",
        email: "test@example.com",
        company: "Test Co",
        motivation: "Test motivation",
        status: "approved",
        createdAt: new Date(),
      })
      const component = await IntentionPage({
        params: Promise.resolve({ id: "1" }),
      })
      render(component)

      expect(
        screen.queryByRole("button", { name: /Aprovar/i })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole("button", { name: /Reprovar/i })
      ).not.toBeInTheDocument()
    })

    it("não renderiza botões Aprovar/Reprovar para status rejeitado", async () => {
      mockGetIntention.mockResolvedValue({
        id: "1",
        name: "Test",
        email: "test@example.com",
        company: "Test Co",
        motivation: "Test motivation",
        status: "rejected",
        createdAt: new Date(),
      })
      const component = await IntentionPage({
        params: Promise.resolve({ id: "1" }),
      })
      render(component)

      expect(
        screen.queryByRole("button", { name: /Aprovar/i })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole("button", { name: /Reprovar/i })
      ).not.toBeInTheDocument()
    })

    it("botão Reprovar tem variant destructive", async () => {
      mockGetIntention.mockResolvedValue({
        id: "1",
        name: "Test",
        email: "test@example.com",
        company: "Test Co",
        motivation: "Test motivation",
        status: "pending",
        createdAt: new Date(),
      })
      const component = await IntentionPage({
        params: Promise.resolve({ id: "1" }),
      })
      render(component)

      const rejectButton = screen.getByRole("button", { name: /Reprovar/i })
      expect(rejectButton).toBeInTheDocument()
    })
  })

  describe("Labels dos Campos", () => {
    it("renderiza todas as labels dos campos", async () => {
      mockGetIntention.mockResolvedValue({
        id: "1",
        name: "Test",
        email: "test@example.com",
        company: "Test Co",
        motivation: "Test motivation",
        status: "pending",
        createdAt: new Date(),
      })
      const component = await IntentionPage({
        params: Promise.resolve({ id: "1" }),
      })
      render(component)

      expect(screen.getByText("Nome")).toBeInTheDocument()
      expect(screen.getByText("Email")).toBeInTheDocument()
      expect(screen.getByText("Empresa")).toBeInTheDocument()
      expect(screen.getByText("Motivação")).toBeInTheDocument()
    })
  })

  describe("Intenção não encontrada", () => {
    it("chama notFound quando intenção não existe", async () => {
      mockGetIntention.mockResolvedValue(null)
      mockNotFound.mockImplementation(() => {
        throw new Error("Not Found")
      })

      await expect(
        IntentionPage({ params: Promise.resolve({ id: "invalid-id" }) })
      ).rejects.toThrow("Not Found")

      expect(mockNotFound).toHaveBeenCalled()
    })
  })

  describe("Integração com DAL", () => {
    it("chama getIntention com o id correto", async () => {
      mockGetIntention.mockResolvedValue({
        id: "test-id-123",
        name: "Test",
        email: "test@example.com",
        company: "Test Co",
        motivation: "Test motivation",
        status: "pending",
        createdAt: new Date(),
      })

      await IntentionPage({ params: Promise.resolve({ id: "test-id-123" }) })

      expect(mockGetIntention).toHaveBeenCalledWith("test-id-123")
    })

    it("utiliza os dados retornados por getIntention", async () => {
      const customIntention = {
        id: "custom-1",
        name: "Nome Customizado",
        email: "custom@example.com",
        company: "Empresa Customizada",
        motivation: "Motivação customizada para testes",
        status: "pending" as const,
        createdAt: new Date("2025-02-20"),
      }

      mockGetIntention.mockResolvedValue(customIntention)
      const component = await IntentionPage({
        params: Promise.resolve({ id: "custom-1" }),
      })
      render(component)

      expect(screen.getByDisplayValue("Nome Customizado")).toBeInTheDocument()
      expect(screen.getByDisplayValue("custom@example.com")).toBeInTheDocument()
      expect(
        screen.getByDisplayValue("Empresa Customizada")
      ).toBeInTheDocument()
    })
  })

  describe("Estrutura do Card", () => {
    it("card tem largura máxima definida", async () => {
      mockGetIntention.mockResolvedValue({
        id: "1",
        name: "Test",
        email: "test@example.com",
        company: "Test Co",
        motivation: "Test motivation",
        status: "pending",
        createdAt: new Date(),
      })
      const component = await IntentionPage({
        params: Promise.resolve({ id: "1" }),
      })
      const { container } = render(component)

      const card = container.querySelector(".max-w-3xl")
      expect(card).toBeInTheDocument()
    })

    it("container principal tem padding correto", async () => {
      mockGetIntention.mockResolvedValue({
        id: "1",
        name: "Test",
        email: "test@example.com",
        company: "Test Co",
        motivation: "Test motivation",
        status: "pending",
        createdAt: new Date(),
      })
      const component = await IntentionPage({
        params: Promise.resolve({ id: "1" }),
      })
      const { container } = render(component)

      const containerDiv = container.querySelector(".container")
      expect(containerDiv).toHaveClass("py-8")
    })
  })

  describe("Todos os Campos são Disabled", () => {
    it("todos os inputs e textarea são disabled", async () => {
      mockGetIntention.mockResolvedValue({
        id: "1",
        name: "Test Name",
        email: "test@example.com",
        company: "Test Company",
        motivation: "Test Motivation",
        status: "pending",
        createdAt: new Date(),
      })
      const component = await IntentionPage({
        params: Promise.resolve({ id: "1" }),
      })
      render(component)

      const nameInput = screen.getByDisplayValue("Test Name")
      const emailInput = screen.getByDisplayValue("test@example.com")
      const companyInput = screen.getByDisplayValue("Test Company")
      const motivationTextarea = screen.getByDisplayValue("Test Motivation")

      expect(nameInput).toBeDisabled()
      expect(emailInput).toBeDisabled()
      expect(companyInput).toBeDisabled()
      expect(motivationTextarea).toBeDisabled()
    })
  })
})
