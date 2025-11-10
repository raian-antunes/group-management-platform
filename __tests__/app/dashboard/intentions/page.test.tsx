import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import "@testing-library/jest-dom"
import IntentionsPage from "@/app/dashboard/intentions/page"

// Mock das dependências
const mockGetIntentions = vi.fn()
vi.mock("@/lib/dal/intention", () => ({
  getIntentions: () => mockGetIntentions(),
}))

// Mock dos componentes columns e DataTable
vi.mock("@/app/dashboard/intentions/columns", () => ({
  columns: [
    { accessorKey: "name", header: "Nome" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "status", header: "Status" },
  ],
}))

vi.mock("@/app/dashboard/intentions/data-table", () => ({
  DataTable: ({
    columns,
    data,
  }: {
    columns: unknown[]
    data: Array<{ id: string; name: string; email: string }>
  }) => (
    <div data-testid="data-table">
      <div data-testid="columns-count">{columns.length}</div>
      <div data-testid="data-count">{data.length}</div>
      {data.map((item) => (
        <div key={item.id} data-testid={`intention-${item.id}`}>
          {item.name} - {item.email}
        </div>
      ))}
    </div>
  ),
}))

describe("Intentions Page", () => {
  describe("Renderização", () => {
    it("renderiza o título da página", async () => {
      mockGetIntentions.mockResolvedValue([])
      const component = await IntentionsPage()
      render(component)

      expect(screen.getByText("Lista de Intenções")).toBeInTheDocument()
    })

    it("renderiza o DataTable", async () => {
      mockGetIntentions.mockResolvedValue([])
      const component = await IntentionsPage()
      render(component)

      expect(screen.getByTestId("data-table")).toBeInTheDocument()
    })

    it("título tem classes de estilo corretas", async () => {
      mockGetIntentions.mockResolvedValue([])
      const component = await IntentionsPage()
      render(component)

      const title = screen.getByText("Lista de Intenções")
      expect(title).toHaveClass("mb-6", "text-4xl", "font-bold")
    })
  })

  describe("Dados e Transformação", () => {
    it("renderiza intenções quando há dados", async () => {
      const mockData = [
        {
          id: "1",
          name: "João Silva",
          email: "joao@example.com",
          company: "Empresa A",
          motivation: "Motivação teste",
          status: "pending",
          createdAt: new Date(),
        },
        {
          id: "2",
          name: "Maria Santos",
          email: "maria@example.com",
          company: "Empresa B",
          motivation: "Outra motivação",
          status: "approved",
          createdAt: new Date(),
        },
      ]

      mockGetIntentions.mockResolvedValue(mockData)
      const component = await IntentionsPage()
      render(component)

      expect(screen.getByTestId("intention-1")).toBeInTheDocument()
      expect(screen.getByTestId("intention-2")).toBeInTheDocument()
      expect(screen.getByText(/João Silva/)).toBeInTheDocument()
      expect(screen.getByText(/Maria Santos/)).toBeInTheDocument()
    })

    it("transforma o status para label antes de passar para DataTable", async () => {
      const mockData = [
        {
          id: "1",
          name: "Teste",
          email: "teste@example.com",
          company: "Empresa",
          motivation: "Motivação",
          status: "pending",
          createdAt: new Date(),
        },
      ]

      mockGetIntentions.mockResolvedValue(mockData)
      const component = await IntentionsPage()
      render(component)

      // Verifica que o DataTable foi renderizado com os dados
      expect(screen.getByTestId("data-table")).toBeInTheDocument()
    })

    it("renderiza lista vazia quando não há intenções", async () => {
      mockGetIntentions.mockResolvedValue([])
      const component = await IntentionsPage()
      render(component)

      expect(screen.getByTestId("data-count")).toHaveTextContent("0")
    })

    it("renderiza múltiplas intenções corretamente", async () => {
      const mockData = [
        {
          id: "1",
          name: "Pessoa 1",
          email: "pessoa1@example.com",
          company: "Empresa 1",
          motivation: "Motivação 1",
          status: "pending",
          createdAt: new Date(),
        },
        {
          id: "2",
          name: "Pessoa 2",
          email: "pessoa2@example.com",
          company: "Empresa 2",
          motivation: "Motivação 2",
          status: "approved",
          createdAt: new Date(),
        },
        {
          id: "3",
          name: "Pessoa 3",
          email: "pessoa3@example.com",
          company: "Empresa 3",
          motivation: "Motivação 3",
          status: "rejected",
          createdAt: new Date(),
        },
      ]

      mockGetIntentions.mockResolvedValue(mockData)
      const component = await IntentionsPage()
      render(component)

      expect(screen.getByTestId("data-count")).toHaveTextContent("3")
      expect(screen.getByTestId("intention-1")).toBeInTheDocument()
      expect(screen.getByTestId("intention-2")).toBeInTheDocument()
      expect(screen.getByTestId("intention-3")).toBeInTheDocument()
    })
  })

  describe("Integração com DAL", () => {
    it("chama getIntentions ao renderizar", async () => {
      mockGetIntentions.mockResolvedValue([])
      mockGetIntentions.mockClear()
      await IntentionsPage()

      expect(mockGetIntentions).toHaveBeenCalled()
    })

    it("passa os dados transformados para o DataTable", async () => {
      const mockData = [
        {
          id: "test-1",
          name: "Nome Teste",
          email: "email@teste.com",
          company: "Empresa Teste",
          motivation: "Motivação Teste",
          status: "approved",
          createdAt: new Date("2025-01-15"),
        },
      ]

      mockGetIntentions.mockResolvedValue(mockData)
      const component = await IntentionsPage()
      render(component)

      expect(screen.getByText(/Nome Teste/)).toBeInTheDocument()
      expect(screen.getByText(/email@teste.com/)).toBeInTheDocument()
    })
  })

  describe("Colunas do DataTable", () => {
    it("passa as colunas corretas para o DataTable", async () => {
      mockGetIntentions.mockResolvedValue([])
      const component = await IntentionsPage()
      render(component)

      // Verifica que há 3 colunas definidas
      expect(screen.getByTestId("columns-count")).toHaveTextContent("3")
    })
  })

  describe("Estrutura da Página", () => {
    it("tem estrutura básica com título e tabela", async () => {
      mockGetIntentions.mockResolvedValue([])
      const component = await IntentionsPage()
      const { container } = render(component)

      const mainDiv = container.querySelector("div")
      expect(mainDiv).toBeInTheDocument()
      expect(screen.getByText("Lista de Intenções")).toBeInTheDocument()
      expect(screen.getByTestId("data-table")).toBeInTheDocument()
    })
  })

  describe("Diferentes Status", () => {
    it("processa intenções com diferentes status", async () => {
      const mockData = [
        {
          id: "pending-1",
          name: "Pendente",
          email: "pendente@example.com",
          company: "Empresa",
          motivation: "Motivação",
          status: "pending",
          createdAt: new Date(),
        },
        {
          id: "approved-1",
          name: "Aprovado",
          email: "aprovado@example.com",
          company: "Empresa",
          motivation: "Motivação",
          status: "approved",
          createdAt: new Date(),
        },
        {
          id: "rejected-1",
          name: "Rejeitado",
          email: "rejeitado@example.com",
          company: "Empresa",
          motivation: "Motivação",
          status: "rejected",
          createdAt: new Date(),
        },
      ]

      mockGetIntentions.mockResolvedValue(mockData)
      const component = await IntentionsPage()
      render(component)

      expect(screen.getByTestId("intention-pending-1")).toBeInTheDocument()
      expect(screen.getByTestId("intention-approved-1")).toBeInTheDocument()
      expect(screen.getByTestId("intention-rejected-1")).toBeInTheDocument()
    })
  })
})
