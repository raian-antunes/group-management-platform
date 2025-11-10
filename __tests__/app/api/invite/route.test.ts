import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "@/app/api/invite/route"
import { db } from "@/drizzle/config"
import { NextRequest, NextResponse } from "next/server"

// Mock do drizzle database
vi.mock("@/drizzle/config", () => ({
  db: {
    query: {
      invites: {
        findMany: vi.fn(),
      },
    },
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(),
      })),
    })),
  },
}))

// Mock do NextResponse
vi.mock("next/server", () => ({
  NextRequest: vi.fn(),
  NextResponse: {
    json: vi.fn((data, init) => ({
      data,
      init,
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}))

// Mock do createNewId
vi.mock("@/lib/utils", () => ({
  createNewId: vi.fn(() => "mock-id-123"),
}))

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("Rotas de API de Invites", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("GET /api/invite", () => {
    it("deve retornar um convite com intention relacionada quando token for fornecido", async () => {
      const mockInvite = {
        id: "invite-123",
        token: "valid-token-456",
        intentionId: "intention-789",
        usedAt: null,
        createdAt: new Date("2024-01-01"),
        intention: {
          id: "intention-789",
          name: "John Doe",
          email: "john@example.com",
          company: "Company A",
          motivation: "Join the group",
          status: "approved",
          createdAt: new Date("2024-01-01"),
        },
      }

      const mockRequest = {
        url: "http://localhost:3000/api/invite?token=valid-token-456",
      } as NextRequest

      vi.mocked(db.query.invites.findMany).mockResolvedValueOnce([mockInvite])

      const response = await GET(mockRequest)

      expect(db.query.invites.findMany).toHaveBeenCalledTimes(1)
      expect(db.query.invites.findMany).toHaveBeenCalledWith({
        where: expect.anything(),
        with: {
          intention: true,
        },
        limit: 1,
      })

      expect(NextResponse.json).toHaveBeenCalledWith({ data: mockInvite })

      const jsonData = await response.json()
      expect(jsonData).toEqual({ data: mockInvite })
      expect(jsonData.data.intention).toBeDefined()
    })

    it("deve retornar erro 400 quando o token não for fornecido", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/invite",
      } as NextRequest

      const response = await GET(mockRequest)

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Token query parameter is required" },
        { status: 400 }
      )

      const jsonData = await response.json()
      expect(jsonData.error).toBe("Token query parameter is required")
      expect(response.status).toBe(400)
    })

    it("deve retornar erro 404 quando o token não for encontrado", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/invite?token=non-existent-token",
      } as NextRequest

      vi.mocked(db.query.invites.findMany).mockResolvedValueOnce([])

      const response = await GET(mockRequest)

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Token not found" },
        { status: 404 }
      )

      const jsonData = await response.json()
      expect(jsonData.error).toBe("Token not found")
      expect(response.status).toBe(404)
    })

    it("deve tratar erros do banco de dados graciosamente", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/invite?token=valid-token",
      } as NextRequest

      const mockError = new Error("Database connection failed")
      vi.mocked(db.query.invites.findMany).mockRejectedValueOnce(mockError)

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})

      const response = await GET(mockRequest)

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

    it("deve retornar convite com estrutura correta incluindo intention", async () => {
      const mockInvite = {
        id: "invite-999",
        token: "token-999",
        intentionId: "intention-999",
        usedAt: null,
        createdAt: new Date("2024-06-15T10:30:00Z"),
        intention: {
          id: "intention-999",
          name: "Test User",
          email: "test@example.com",
          company: "Test Company",
          motivation: "Test motivation",
          status: "approved",
          createdAt: new Date("2024-06-15T10:00:00Z"),
        },
      }

      const mockRequest = {
        url: "http://localhost:3000/api/invite?token=token-999",
      } as NextRequest

      vi.mocked(db.query.invites.findMany).mockResolvedValueOnce([mockInvite])

      const response = await GET(mockRequest)

      const jsonData = await response.json()
      expect(jsonData.data).toMatchObject({
        id: "invite-999",
        token: "token-999",
        intentionId: "intention-999",
      })
      expect(jsonData.data.intention).toMatchObject({
        id: "intention-999",
        name: "Test User",
        email: "test@example.com",
      })
    })
  })

  describe("POST /api/invite", () => {
    it("deve criar um convite com sucesso", async () => {
      const mockInvite = {
        id: "mock-id-123",
        token: "mock-id-123",
        intentionId: "intention-456",
        usedAt: null,
        createdAt: new Date("2024-01-01"),
      }

      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({ intentionId: "intention-456" }),
      } as unknown as NextRequest

      const mockInsert = vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn().mockResolvedValueOnce([mockInvite]),
        })),
      }))

      vi.mocked(db.insert).mockImplementation(mockInsert as any)

      const response = await POST(mockRequest)

      expect(mockRequest.json).toHaveBeenCalledTimes(1)
      expect(db.insert).toHaveBeenCalledTimes(1)
      expect(NextResponse.json).toHaveBeenCalledWith(
        { data: mockInvite },
        { status: 201 }
      )

      const jsonData = await response.json()
      expect(jsonData).toEqual({ data: mockInvite })
      expect(response.status).toBe(201)
    })

    it("deve retornar erro 400 quando intentionId não for fornecido", async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({}),
      } as unknown as NextRequest

      const response = await POST(mockRequest)

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "intentionId is required" },
        { status: 400 }
      )

      const jsonData = await response.json()
      expect(jsonData.error).toBe("intentionId is required")
      expect(response.status).toBe(400)
    })

    it("deve retornar erro 500 quando falhar ao criar convite", async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({ intentionId: "intention-789" }),
      } as unknown as NextRequest

      const mockInsert = vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn().mockResolvedValueOnce([]),
        })),
      }))

      vi.mocked(db.insert).mockImplementation(mockInsert as any)

      const response = await POST(mockRequest)

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Failed to create invite" },
        { status: 500 }
      )

      const jsonData = await response.json()
      expect(jsonData.error).toBe("Failed to create invite")
      expect(response.status).toBe(500)
    })

    it("deve tratar erros do banco de dados graciosamente", async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({ intentionId: "intention-123" }),
      } as unknown as NextRequest

      const mockError = new Error("Database error")
      const mockInsert = vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn().mockRejectedValueOnce(mockError),
        })),
      }))

      vi.mocked(db.insert).mockImplementation(mockInsert as any)

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})

      const response = await POST(mockRequest)

      expect(consoleErrorSpy).toHaveBeenCalled()
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Internal Server Error" },
        { status: 500 }
      )

      expect(response.status).toBe(500)
      const jsonData = await response.json()
      expect(jsonData.error).toBe("Internal Server Error")

      consoleErrorSpy.mockRestore()
    })

    it("deve criar convite com id e token gerados", async () => {
      const mockInvite = {
        id: "mock-id-123",
        token: "mock-id-123",
        intentionId: "intention-999",
        usedAt: null,
        createdAt: new Date("2024-01-15"),
      }

      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({ intentionId: "intention-999" }),
      } as unknown as NextRequest

      const mockInsert = vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn().mockResolvedValueOnce([mockInvite]),
        })),
      }))

      vi.mocked(db.insert).mockImplementation(mockInsert as any)

      const response = await POST(mockRequest)

      const jsonData = await response.json()
      expect(jsonData.data).toMatchObject({
        id: "mock-id-123",
        token: "mock-id-123",
        intentionId: "intention-999",
      })
      expect(jsonData.data.usedAt).toBeNull()
    })

    it("deve retornar status 201 para criação bem-sucedida", async () => {
      const mockInvite = {
        id: "mock-id-123",
        token: "mock-id-123",
        intentionId: "intention-111",
        usedAt: null,
        createdAt: new Date("2024-01-20"),
      }

      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({ intentionId: "intention-111" }),
      } as unknown as NextRequest

      const mockInsert = vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn().mockResolvedValueOnce([mockInvite]),
        })),
      }))

      vi.mocked(db.insert).mockImplementation(mockInsert as any)

      const response = await POST(mockRequest)

      expect(response.status).toBe(201)
    })
  })
})
