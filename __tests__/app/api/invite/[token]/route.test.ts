import { describe, it, expect, vi, beforeEach } from "vitest"
import { PUT } from "@/app/api/invite/[token]/route"
import { db } from "@/drizzle/config"
import { NextRequest, NextResponse } from "next/server"

// Mock do drizzle database
vi.mock("@/drizzle/config", () => ({
  db: {
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(),
        })),
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

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("Rotas de API de Invite [token]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("PUT /api/invite/[token]", () => {
    it("deve marcar um convite como usado com sucesso", async () => {
      const mockUsedAt = new Date("2024-01-15T12:00:00Z")
      const mockInvite = {
        id: "invite-123",
        token: "valid-token-456",
        intentionId: "intention-789",
        usedAt: mockUsedAt,
        createdAt: new Date("2024-01-01"),
      }

      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ token: "valid-token-456" })

      const mockUpdate = vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn().mockResolvedValueOnce([mockInvite]),
          })),
        })),
      }))

      vi.mocked(db.update).mockImplementation(mockUpdate as any)

      const response = await PUT(mockRequest, { params: mockParams })

      expect(db.update).toHaveBeenCalledTimes(1)
      expect(NextResponse.json).toHaveBeenCalledWith({ data: mockInvite })

      const jsonData = await response.json()
      expect(jsonData).toEqual({ data: mockInvite })
      expect(jsonData.data.usedAt).toBeDefined()
    })

    it("deve retornar erro 400 quando o token não for fornecido", async () => {
      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ token: "" })

      const response = await PUT(mockRequest, { params: mockParams })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Token is required" },
        { status: 400 }
      )

      const jsonData = await response.json()
      expect(jsonData.error).toBe("Token is required")
      expect(response.status).toBe(400)
    })

    it("deve retornar erro 404 quando o convite não for encontrado", async () => {
      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ token: "non-existent-token" })

      const mockUpdate = vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn().mockResolvedValueOnce([]),
          })),
        })),
      }))

      vi.mocked(db.update).mockImplementation(mockUpdate as any)

      const response = await PUT(mockRequest, { params: mockParams })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Invite not found or failed to update" },
        { status: 404 }
      )

      const jsonData = await response.json()
      expect(jsonData.error).toBe("Invite not found or failed to update")
      expect(response.status).toBe(404)
    })

    it("deve tratar erros do banco de dados graciosamente", async () => {
      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ token: "valid-token" })

      const mockError = new Error("Database connection failed")
      const mockUpdate = vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn().mockRejectedValueOnce(mockError),
          })),
        })),
      }))

      vi.mocked(db.update).mockImplementation(mockUpdate as any)

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})

      const response = await PUT(mockRequest, { params: mockParams })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error updating invite:",
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

    it("deve atualizar usedAt com data atual", async () => {
      const mockInvite = {
        id: "invite-456",
        token: "token-456",
        intentionId: "intention-456",
        usedAt: new Date(),
        createdAt: new Date("2024-01-01"),
      }

      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ token: "token-456" })

      const mockUpdate = vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn().mockResolvedValueOnce([mockInvite]),
          })),
        })),
      }))

      vi.mocked(db.update).mockImplementation(mockUpdate as any)

      const response = await PUT(mockRequest, { params: mockParams })

      const jsonData = await response.json()
      expect(jsonData.data.usedAt).toBeInstanceOf(Date)
      expect(jsonData.data.token).toBe("token-456")
    })

    it("deve retornar convite com estrutura correta após atualização", async () => {
      const mockInvite = {
        id: "invite-789",
        token: "token-789",
        intentionId: "intention-789",
        usedAt: new Date("2024-06-15T14:30:00Z"),
        createdAt: new Date("2024-06-01T10:00:00Z"),
      }

      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ token: "token-789" })

      const mockUpdate = vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn().mockResolvedValueOnce([mockInvite]),
          })),
        })),
      }))

      vi.mocked(db.update).mockImplementation(mockUpdate as any)

      const response = await PUT(mockRequest, { params: mockParams })

      const jsonData = await response.json()
      expect(jsonData.data).toMatchObject({
        id: "invite-789",
        token: "token-789",
        intentionId: "intention-789",
      })
      expect(jsonData.data.usedAt).toBeDefined()
    })

    it("deve chamar update com set incluindo usedAt", async () => {
      const mockInvite = {
        id: "invite-999",
        token: "token-999",
        intentionId: "intention-999",
        usedAt: new Date(),
        createdAt: new Date("2024-01-01"),
      }

      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ token: "token-999" })

      const mockReturning = vi.fn().mockResolvedValueOnce([mockInvite])
      const mockWhere = vi.fn(() => ({ returning: mockReturning }))
      const mockSet = vi.fn(() => ({ where: mockWhere }))
      const mockUpdate = vi.fn(() => ({ set: mockSet }))

      vi.mocked(db.update).mockImplementation(mockUpdate as any)

      await PUT(mockRequest, { params: mockParams })

      expect(mockUpdate).toHaveBeenCalledTimes(1)
      expect(mockSet).toHaveBeenCalledTimes(1)
      expect(mockSet).toHaveBeenCalledWith({
        usedAt: expect.any(Date),
      })
    })

    it("deve retornar status 200 por padrão para atualização bem-sucedida", async () => {
      const mockInvite = {
        id: "invite-111",
        token: "token-111",
        intentionId: "intention-111",
        usedAt: new Date(),
        createdAt: new Date("2024-01-01"),
      }

      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ token: "token-111" })

      const mockUpdate = vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn().mockResolvedValueOnce([mockInvite]),
          })),
        })),
      }))

      vi.mocked(db.update).mockImplementation(mockUpdate as any)

      const response = await PUT(mockRequest, { params: mockParams })

      expect(response.status).toBe(200)
    })
  })
})
