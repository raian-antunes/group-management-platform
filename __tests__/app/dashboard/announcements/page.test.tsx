import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import "@testing-library/jest-dom"
import AnnouncementPage from "@/app/dashboard/announcements/page"

// Mock da função getAnnouncements
const mockGetAnnouncements = vi.fn()
vi.mock("@/lib/dal/announcement", () => ({
  getAnnouncements: () => mockGetAnnouncements(),
}))

describe("Announcements Page", () => {
  describe("Renderização com dados", () => {
    const mockAnnouncements = {
      data: [
        {
          id: "1",
          message: "Primeira mensagem importante",
          createdAt: new Date("2025-01-15"),
          user: {
            name: "João Silva",
          },
        },
        {
          id: "2",
          message: "Segunda mensagem de comunicado",
          createdAt: new Date("2025-01-20"),
          user: {
            name: "Maria Santos",
          },
        },
      ],
    }

    it("renderiza o título da página", async () => {
      mockGetAnnouncements.mockResolvedValue(mockAnnouncements)
      const component = await AnnouncementPage()
      render(component)

      expect(screen.getByText("Avisos e Comunicados")).toBeInTheDocument()
    })

    it("renderiza todos os avisos retornados", async () => {
      mockGetAnnouncements.mockResolvedValue(mockAnnouncements)
      const component = await AnnouncementPage()
      render(component)

      expect(screen.getByText("Aviso 1")).toBeInTheDocument()
      expect(screen.getByText("Aviso 2")).toBeInTheDocument()
    })

    it("renderiza as mensagens dos avisos", async () => {
      mockGetAnnouncements.mockResolvedValue(mockAnnouncements)
      const component = await AnnouncementPage()
      render(component)

      expect(
        screen.getByText("Primeira mensagem importante")
      ).toBeInTheDocument()
      expect(
        screen.getByText("Segunda mensagem de comunicado")
      ).toBeInTheDocument()
    })

    it("renderiza o nome do autor de cada aviso", async () => {
      mockGetAnnouncements.mockResolvedValue(mockAnnouncements)
      const component = await AnnouncementPage()
      render(component)

      expect(screen.getByText(/João Silva/)).toBeInTheDocument()
      expect(screen.getByText(/Maria Santos/)).toBeInTheDocument()
    })

    it("renderiza a data formatada corretamente", async () => {
      mockGetAnnouncements.mockResolvedValue(mockAnnouncements)
      const component = await AnnouncementPage()
      render(component)

      expect(screen.getByText(/14\/01\/2025/)).toBeInTheDocument()
      expect(screen.getByText(/19\/01\/2025/)).toBeInTheDocument()
    })

    it("renderiza descrição com autor e data", async () => {
      mockGetAnnouncements.mockResolvedValue(mockAnnouncements)
      const component = await AnnouncementPage()
      render(component)

      expect(
        screen.getByText(/Autor: João Silva - Data da postagem:/)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Autor: Maria Santos - Data da postagem:/)
      ).toBeInTheDocument()
    })
  })

  describe("Renderização sem dados", () => {
    it("renderiza página vazia quando não há avisos", async () => {
      mockGetAnnouncements.mockResolvedValue({ data: [] })
      const component = await AnnouncementPage()
      render(component)

      expect(screen.getByText("Avisos e Comunicados")).toBeInTheDocument()
      expect(screen.queryByText(/Aviso 1/)).not.toBeInTheDocument()
    })
  })

  describe("Estrutura", () => {
    it("renderiza o título com classes corretas", async () => {
      mockGetAnnouncements.mockResolvedValue({ data: [] })
      const component = await AnnouncementPage()
      render(component)

      const title = screen.getByText("Avisos e Comunicados")
      expect(title).toHaveClass("mb-6", "text-4xl", "font-bold")
    })

    it("cada aviso é renderizado dentro de um Card", async () => {
      mockGetAnnouncements.mockResolvedValue({
        data: [
          {
            id: "1",
            message: "Teste",
            createdAt: new Date(),
            user: { name: "Teste" },
          },
        ],
      })
      const component = await AnnouncementPage()
      const { container } = render(component)

      const cards = container.querySelectorAll('[class*="w-full"]')
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  describe("Layout", () => {
    it("container principal tem classes de centralização", async () => {
      mockGetAnnouncements.mockResolvedValue({ data: [] })
      const component = await AnnouncementPage()
      const { container } = render(component)

      const mainDiv = container.querySelector(
        ".flex.flex-col.justify-center.items-center"
      )
      expect(mainDiv).toBeInTheDocument()
    })

    it("lista de avisos tem gap entre os cards", async () => {
      mockGetAnnouncements.mockResolvedValue({
        data: [
          {
            id: "1",
            message: "Teste 1",
            createdAt: new Date(),
            user: { name: "User 1" },
          },
          {
            id: "2",
            message: "Teste 2",
            createdAt: new Date(),
            user: { name: "User 2" },
          },
        ],
      })
      const component = await AnnouncementPage()
      const { container } = render(component)

      const listContainer = container.querySelector(".flex.flex-col.gap-4")
      expect(listContainer).toBeInTheDocument()
    })
  })

  describe("Índice dos avisos", () => {
    it("numera os avisos sequencialmente", async () => {
      mockGetAnnouncements.mockResolvedValue({
        data: [
          {
            id: "a",
            message: "Primeiro",
            createdAt: new Date(),
            user: { name: "User" },
          },
          {
            id: "b",
            message: "Segundo",
            createdAt: new Date(),
            user: { name: "User" },
          },
          {
            id: "c",
            message: "Terceiro",
            createdAt: new Date(),
            user: { name: "User" },
          },
        ],
      })
      const component = await AnnouncementPage()
      render(component)

      expect(screen.getByText("Aviso 1")).toBeInTheDocument()
      expect(screen.getByText("Aviso 2")).toBeInTheDocument()
      expect(screen.getByText("Aviso 3")).toBeInTheDocument()
    })
  })

  describe("Integração com DAL", () => {
    it("chama getAnnouncements ao renderizar", async () => {
      mockGetAnnouncements.mockResolvedValue({ data: [] })
      mockGetAnnouncements.mockClear()
      await AnnouncementPage()

      expect(mockGetAnnouncements).toHaveBeenCalled()
    })

    it("utiliza os dados retornados pela função", async () => {
      const customData = {
        data: [
          {
            id: "custom-1",
            message: "Mensagem customizada",
            createdAt: new Date("2025-02-10"),
            user: { name: "Autor Customizado" },
          },
        ],
      }
      mockGetAnnouncements.mockResolvedValue(customData)
      const component = await AnnouncementPage()
      render(component)

      expect(screen.getByText("Mensagem customizada")).toBeInTheDocument()
      expect(screen.getByText(/Autor Customizado/)).toBeInTheDocument()
    })
  })
})
