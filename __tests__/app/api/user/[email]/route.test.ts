import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET } from "@/app/api/user/[email]/route"
import { db } from "@/drizzle/config"
import { NextRequest, NextResponse } from "next/server"

// Mock do drizzle database
vi.mock("@/drizzle/config", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(),
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

// Mock do auth
vi.mock("@/lib/auth", () => ({
  getSession: vi.fn(),
}))

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("Rotas de API de User [email]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("GET /api/user/[email]", () => {
    it("deve retornar um usuário por email com sucesso", async () => {
      const mockUser = {
        id: "user-123",
        name: "John Doe",
        email: "john@example.com",
        password: "hashedpassword",
        role: "user",
        company: "Company A",
        createdAt: new Date("2024-01-01"),
        inviteId: null,
      }

      const mockSession = { userId: "user-456", userRole: "admin" }

      const { getSession } = await import("@/lib/auth")
      vi.mocked(getSession).mockResolvedValueOnce(mockSession)

      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ email: "john@example.com" })

      const mockSelect = vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn().mockResolvedValueOnce([mockUser]),
        })),
      }))

      vi.mocked(db.select).mockImplementation(mockSelect as any)

      const response = await GET(mockRequest, { params: mockParams })

      expect(getSession).toHaveBeenCalledTimes(1)
      expect(db.select).toHaveBeenCalledTimes(1)
      expect(NextResponse.json).toHaveBeenCalledWith({ data: mockUser })

      const jsonData = await response.json()
      expect(jsonData).toEqual({ data: mockUser })
    })

    it("deve retornar erro 401 quando o usuário não estiver autenticado", async () => {
      const { getSession } = await import("@/lib/auth")
      vi.mocked(getSession).mockResolvedValueOnce(null)

      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ email: "john@example.com" })

      const response = await GET(mockRequest, { params: mockParams })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "User not authenticated" },
        { status: 401 }
      )

      const jsonData = await response.json()
      expect(jsonData.error).toBe("User not authenticated")
      expect(response.status).toBe(401)
    })

    it("deve retornar erro 404 quando o usuário não for encontrado", async () => {
      const mockSession = { userId: "user-456", userRole: "admin" }

      const { getSession } = await import("@/lib/auth")
      vi.mocked(getSession).mockResolvedValueOnce(mockSession)

      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ email: "nonexistent@example.com" })

      const mockSelect = vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn().mockResolvedValueOnce([]),
        })),
      }))

      vi.mocked(db.select).mockImplementation(mockSelect as any)

      const response = await GET(mockRequest, { params: mockParams })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "User not found" },
        { status: 404 }
      )

      const jsonData = await response.json()
      expect(jsonData.error).toBe("User not found")
      expect(response.status).toBe(404)
    })

    it("deve tratar erros do banco de dados graciosamente", async () => {
      const mockSession = { userId: "user-456", userRole: "admin" }

      const { getSession } = await import("@/lib/auth")
      vi.mocked(getSession).mockResolvedValueOnce(mockSession)

      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ email: "john@example.com" })

      const mockError = new Error("Database connection failed")
      const mockSelect = vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn().mockRejectedValueOnce(mockError),
        })),
      }))

      vi.mocked(db.select).mockImplementation(mockSelect as any)

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})

      const response = await GET(mockRequest, { params: mockParams })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error getting user by email:",
        mockError
      )
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Internal Server Error" },
        { status: 500 }
      )

      expect(response.status).toBe(500)
      const jsonData = await response.json()
      expect(jsonData.error).toBe("Internal Server Error")

      consoleErrorSpy.mockRestore()
    })

    it("deve retornar usuário com estrutura correta", async () => {
      const mockUser = {
        id: "user-789",
        name: "Jane Smith",
        email: "jane@example.com",
        password: "hashedpassword789",
        role: "user",
        company: "Company B",
        createdAt: new Date("2024-06-15T10:30:00Z"),
        inviteId: "invite-456",
      }

      const mockSession = { userId: "user-999", userRole: "admin" }

      const { getSession } = await import("@/lib/auth")
      vi.mocked(getSession).mockResolvedValueOnce(mockSession)

      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ email: "jane@example.com" })

      const mockSelect = vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn().mockResolvedValueOnce([mockUser]),
        })),
      }))

      vi.mocked(db.select).mockImplementation(mockSelect as any)

      const response = await GET(mockRequest, { params: mockParams })

      const jsonData = await response.json()
      expect(jsonData.data).toMatchObject({
        id: "user-789",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "user",
        company: "Company B",
      })
    })

    it("deve retornar status 200 para requisição bem-sucedida", async () => {
      const mockUser = {
        id: "user-111",
        name: "Sample User",
        email: "sample@example.com",
        password: "hashedpassword111",
        role: "user",
        company: "Sample Company",
        createdAt: new Date("2024-01-20"),
        inviteId: null,
      }

      const mockSession = { userId: "user-222", userRole: "admin" }

      const { getSession } = await import("@/lib/auth")
      vi.mocked(getSession).mockResolvedValueOnce(mockSession)

      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ email: "sample@example.com" })

      const mockSelect = vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn().mockResolvedValueOnce([mockUser]),
        })),
      }))

      vi.mocked(db.select).mockImplementation(mockSelect as any)

      const response = await GET(mockRequest, { params: mockParams })

      expect(response.status).toBe(200)
    })

    it("deve validar email no parâmetro da URL", async () => {
      const mockUser = {
        id: "user-333",
        name: "Test User",
        email: "test@domain.com",
        password: "hashedpassword",
        role: "user",
        company: "Test Company",
        createdAt: new Date("2024-02-01"),
        inviteId: null,
      }

      const mockSession = { userId: "user-444", userRole: "user" }

      const { getSession } = await import("@/lib/auth")
      vi.mocked(getSession).mockResolvedValueOnce(mockSession)

      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ email: "test@domain.com" })

      const mockSelect = vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn().mockResolvedValueOnce([mockUser]),
        })),
      }))

      vi.mocked(db.select).mockImplementation(mockSelect as any)

      const response = await GET(mockRequest, { params: mockParams })

      const jsonData = await response.json()
      expect(jsonData.data.email).toBe("test@domain.com")
    })

    it("deve permitir acesso apenas para usuários autenticados", async () => {
      const { getSession } = await import("@/lib/auth")
      vi.mocked(getSession).mockResolvedValueOnce(null)

      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ email: "any@example.com" })

      const response = await GET(mockRequest, { params: mockParams })

      expect(db.select).not.toHaveBeenCalled()
      expect(response.status).toBe(401)
    })
  })
})
