import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET } from "@/app/api/announcement/route"
import { db } from "@/drizzle/config"
import { NextResponse } from "next/server"

// Mock do drizzle database
vi.mock("@/drizzle/config", () => ({
  db: {
    query: {
      announcements: {
        findMany: vi.fn(),
      },
    },
  },
}))

// Mock do NextResponse
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((data, init) => ({
      data,
      init,
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}))

describe("Rotas de API de Announcements", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("GET /api/announcement", () => {
    it("deve retornar avisos com dados do usuário com sucesso", async () => {
      const mockAnnouncements = [
        {
          id: "1",
          userId: "user1",
          message: "First announcement",
          createdAt: new Date("2024-01-01"),
          user: {
            id: "user1",
            name: "John Doe",
            email: "john@example.com",
            password: "hashedpassword",
            role: "admin",
            createdAt: new Date("2023-12-01"),
            company: "Company A",
            inviteId: null,
          },
        },
        {
          id: "2",
          userId: "user2",
          message: "Second announcement",
          createdAt: new Date("2024-01-02"),
          user: {
            id: "user2",
            name: "Jane Smith",
            email: "jane@example.com",
            password: "hashedpassword",
            role: "user",
            createdAt: new Date("2023-12-05"),
            company: "Company B",
            inviteId: null,
          },
        },
      ]

      vi.mocked(db.query.announcements.findMany).mockResolvedValueOnce(
        mockAnnouncements
      )

      const response = await GET()

      expect(db.query.announcements.findMany).toHaveBeenCalledTimes(1)
      expect(db.query.announcements.findMany).toHaveBeenCalledWith({
        orderBy: expect.anything(),
        with: {
          user: true,
        },
      })

      expect(NextResponse.json).toHaveBeenCalledWith({
        data: mockAnnouncements,
      })

      const jsonData = await response.json()
      expect(jsonData).toEqual({ data: mockAnnouncements })
    })

    it("deve retornar array vazio quando não há avisos", async () => {
      vi.mocked(db.query.announcements.findMany).mockResolvedValueOnce([])

      const response = await GET()

      expect(db.query.announcements.findMany).toHaveBeenCalledTimes(1)
      expect(NextResponse.json).toHaveBeenCalledWith({ data: [] })

      const jsonData = await response.json()
      expect(jsonData.data).toHaveLength(0)
    })

    it("deve retornar avisos ordenados por data de criação (decrescente)", async () => {
      const mockAnnouncements = [
        {
          id: "2",
          userId: "user2",
          message: "Newer announcement",
          createdAt: new Date("2024-01-10"),
          user: {
            id: "user2",
            name: "Jane Smith",
            email: "jane@example.com",
            password: "hashedpassword",
            role: "user",
            createdAt: new Date("2023-12-05"),
            company: "Company B",
            inviteId: null,
          },
        },
        {
          id: "1",
          userId: "user1",
          message: "Older announcement",
          createdAt: new Date("2024-01-01"),
          user: {
            id: "user1",
            name: "John Doe",
            email: "john@example.com",
            password: "hashedpassword",
            role: "admin",
            createdAt: new Date("2023-12-01"),
            company: "Company A",
            inviteId: null,
          },
        },
      ]

      vi.mocked(db.query.announcements.findMany).mockResolvedValueOnce(
        mockAnnouncements
      )

      const response = await GET()

      const jsonData = await response.json()
      expect(jsonData.data).toHaveLength(2)
      expect(jsonData.data[0].id).toBe("2")
      expect(jsonData.data[1].id).toBe("1")
    })

    it("deve incluir relações de usuário na resposta", async () => {
      const mockAnnouncement = {
        id: "1",
        userId: "user1",
        message: "Test announcement",
        createdAt: new Date("2024-01-01"),
        user: {
          id: "user1",
          name: "John Doe",
          email: "john@example.com",
          password: "hashedpassword",
          role: "admin",
          createdAt: new Date("2023-12-01"),
          company: "Company A",
          inviteId: null,
        },
      }

      vi.mocked(db.query.announcements.findMany).mockResolvedValueOnce([
        mockAnnouncement,
      ])

      const response = await GET()

      expect(db.query.announcements.findMany).toHaveBeenCalledWith({
        orderBy: expect.anything(),
        with: {
          user: true,
        },
      })

      const jsonData = await response.json()
      expect(jsonData.data[0].user).toBeDefined()
      expect(jsonData.data[0].user.name).toBe("John Doe")
      expect(jsonData.data[0].user.email).toBe("john@example.com")
    })

    it("deve tratar erros do banco de dados graciosamente", async () => {
      const mockError = new Error("Database connection failed")
      vi.mocked(db.query.announcements.findMany).mockRejectedValueOnce(
        mockError
      )

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})

      const response = await GET()

      expect(consoleErrorSpy).toHaveBeenCalledWith(mockError)
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Internal Server Error" },
        { status: 500 }
      )

      expect(response.status).toBe(500)
      const jsonData = await response.json()
      expect(jsonData.error).toBe("Internal Server Error")

      consoleErrorSpy.mockRestore()
    })

    it("deve tratar erros inesperados durante execução da query", async () => {
      vi.mocked(db.query.announcements.findMany).mockRejectedValueOnce(
        new Error("Unexpected error")
      )

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})

      const response = await GET()

      expect(response.status).toBe(500)
      const jsonData = await response.json()
      expect(jsonData).toHaveProperty("error")

      consoleErrorSpy.mockRestore()
    })

    it("deve retornar estrutura correta para um único aviso", async () => {
      const mockAnnouncement = {
        id: "unique-id-123",
        userId: "user-id-456",
        message: "Single announcement message",
        createdAt: new Date("2024-06-15T10:30:00Z"),
        user: {
          id: "user-id-456",
          name: "Test User",
          email: "test@example.com",
          password: "hashedpassword123",
          role: "user",
          createdAt: new Date("2024-01-01T00:00:00Z"),
          company: "Test Company",
          inviteId: "invite-123",
        },
      }

      vi.mocked(db.query.announcements.findMany).mockResolvedValueOnce([
        mockAnnouncement,
      ])

      const response = await GET()
      const jsonData = await response.json()

      expect(jsonData.data).toHaveLength(1)
      expect(jsonData.data[0]).toMatchObject({
        id: "unique-id-123",
        userId: "user-id-456",
        message: "Single announcement message",
      })
      expect(jsonData.data[0].user).toMatchObject({
        id: "user-id-456",
        name: "Test User",
        email: "test@example.com",
      })
    })

    it("deve verificar que findMany é chamado com parâmetros corretos", async () => {
      vi.mocked(db.query.announcements.findMany).mockResolvedValueOnce([])

      await GET()

      const callArgs = vi.mocked(db.query.announcements.findMany).mock
        .calls[0]?.[0]
      expect(callArgs).toBeDefined()
      expect(callArgs).toHaveProperty("orderBy")
      expect(callArgs).toHaveProperty("with")
      expect(callArgs?.with).toEqual({ user: true })
    })
  })
})
