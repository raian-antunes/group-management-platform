import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, PUT } from "@/app/api/intention/[id]/route"
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

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("Rotas de API de Intention [id]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("PUT /api/intention/[id]", () => {
    it("deve atualizar o status de uma intenção com sucesso", async () => {
      const mockIntention = {
        id: "intention-123",
        name: "John Doe",
        email: "john@example.com",
        company: "Company A",
        motivation: "Join the group",
        status: "approved",
        createdAt: new Date("2024-01-01"),
      }

      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({ status: "approved" }),
      } as unknown as NextRequest

      const mockParams = Promise.resolve({ id: "intention-123" })

      const mockUpdate = vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn().mockResolvedValueOnce([mockIntention]),
          })),
        })),
      }))

      vi.mocked(db.update).mockImplementation(mockUpdate as any)

      const response = await PUT(mockRequest, { params: mockParams })

      expect(mockRequest.json).toHaveBeenCalledTimes(1)
      expect(db.update).toHaveBeenCalledTimes(1)
      expect(NextResponse.json).toHaveBeenCalledWith(
        { data: mockIntention },
        { status: 200 }
      )

      const jsonData = await response.json()
      expect(jsonData).toEqual({ data: mockIntention })
      expect(response.status).toBe(200)
    })

    it("deve retornar erro 400 quando o status não for fornecido", async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({}),
      } as unknown as NextRequest

      const mockParams = Promise.resolve({ id: "intention-123" })

      const response = await PUT(mockRequest, { params: mockParams })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Status is required" },
        { status: 400 }
      )

      const jsonData = await response.json()
      expect(jsonData.error).toBe("Status is required")
      expect(response.status).toBe(400)
    })

    it("deve retornar erro 404 quando a intenção não for encontrada", async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({ status: "approved" }),
      } as unknown as NextRequest

      const mockParams = Promise.resolve({ id: "non-existent-id" })

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
        { error: "Intention not found" },
        { status: 404 }
      )

      const jsonData = await response.json()
      expect(jsonData.error).toBe("Intention not found")
      expect(response.status).toBe(404)
    })

    it("deve tratar erros do banco de dados graciosamente", async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({ status: "approved" }),
      } as unknown as NextRequest

      const mockParams = Promise.resolve({ id: "intention-123" })

      const mockError = new Error("Database error")
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

    it("deve atualizar status para rejected", async () => {
      const mockIntention = {
        id: "intention-456",
        name: "Jane Smith",
        email: "jane@example.com",
        company: "Company B",
        motivation: "Networking",
        status: "rejected",
        createdAt: new Date("2024-01-02"),
      }

      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({ status: "rejected" }),
      } as unknown as NextRequest

      const mockParams = Promise.resolve({ id: "intention-456" })

      const mockUpdate = vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn().mockResolvedValueOnce([mockIntention]),
          })),
        })),
      }))

      vi.mocked(db.update).mockImplementation(mockUpdate as any)

      const response = await PUT(mockRequest, { params: mockParams })

      const jsonData = await response.json()
      expect(jsonData.data.status).toBe("rejected")
    })
  })

  describe("GET /api/intention/[id]", () => {
    it("deve retornar uma intenção específica com sucesso", async () => {
      const mockIntention = {
        id: "intention-123",
        name: "John Doe",
        email: "john@example.com",
        company: "Company A",
        motivation: "Join the group",
        status: "pending",
        createdAt: new Date("2024-01-01"),
      }

      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ id: "intention-123" })

      const mockSelect = vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn().mockResolvedValueOnce([mockIntention]),
        })),
      }))

      vi.mocked(db.select).mockImplementation(mockSelect as any)

      const response = await GET(mockRequest, { params: mockParams })

      expect(db.select).toHaveBeenCalledTimes(1)
      expect(NextResponse.json).toHaveBeenCalledWith(
        { data: mockIntention },
        { status: 200 }
      )

      const jsonData = await response.json()
      expect(jsonData).toEqual({ data: mockIntention })
      expect(response.status).toBe(200)
    })

    it("deve retornar erro 404 quando a intenção não for encontrada", async () => {
      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ id: "non-existent-id" })

      const mockSelect = vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn().mockResolvedValueOnce([]),
        })),
      }))

      vi.mocked(db.select).mockImplementation(mockSelect as any)

      const response = await GET(mockRequest, { params: mockParams })

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Intention not found" },
        { status: 404 }
      )

      const jsonData = await response.json()
      expect(jsonData.error).toBe("Intention not found")
      expect(response.status).toBe(404)
    })

    it("deve tratar erros do banco de dados graciosamente", async () => {
      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ id: "intention-123" })

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

    it("deve retornar intenção com estrutura correta", async () => {
      const mockIntention = {
        id: "unique-id-789",
        name: "Test User",
        email: "test@example.com",
        company: "Test Company",
        motivation: "Test motivation",
        status: "pending",
        createdAt: new Date("2024-06-15T10:30:00Z"),
      }

      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ id: "unique-id-789" })

      const mockSelect = vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn().mockResolvedValueOnce([mockIntention]),
        })),
      }))

      vi.mocked(db.select).mockImplementation(mockSelect as any)

      const response = await GET(mockRequest, { params: mockParams })

      const jsonData = await response.json()
      expect(jsonData.data).toMatchObject({
        id: "unique-id-789",
        name: "Test User",
        email: "test@example.com",
        company: "Test Company",
        motivation: "Test motivation",
        status: "pending",
      })
    })

    it("deve retornar status 200 para requisição bem-sucedida", async () => {
      const mockIntention = {
        id: "intention-999",
        name: "Sample User",
        email: "sample@example.com",
        company: "Sample Co",
        motivation: "Sample motivation",
        status: "approved",
        createdAt: new Date("2024-01-10"),
      }

      const mockRequest = {} as NextRequest
      const mockParams = Promise.resolve({ id: "intention-999" })

      const mockSelect = vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn().mockResolvedValueOnce([mockIntention]),
        })),
      }))

      vi.mocked(db.select).mockImplementation(mockSelect as any)

      const response = await GET(mockRequest, { params: mockParams })

      expect(response.status).toBe(200)
    })
  })
})
