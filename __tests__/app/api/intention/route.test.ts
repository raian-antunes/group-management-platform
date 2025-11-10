import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "@/app/api/intention/route"
import { db } from "@/drizzle/config"
import { NextRequest, NextResponse } from "next/server"

// Mock do drizzle database
vi.mock("@/drizzle/config", () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(),
      })),
    })),
    select: vi.fn(() => ({
      from: vi.fn(),
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

describe("Rotas de API de Intentions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("POST /api/intention", () => {
    it("deve criar uma intenção com sucesso", async () => {
      const mockIntention = {
        id: "mock-id-123",
        name: "John Doe",
        email: "john@example.com",
        company: "Company A",
        motivation: "I want to join the group",
        status: "pending",
        createdAt: new Date("2024-01-01"),
      }

      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({
          name: "John Doe",
          email: "john@example.com",
          company: "Company A",
          motivation: "I want to join the group",
        }),
      } as unknown as NextRequest

      const mockInsert = vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn().mockResolvedValueOnce([mockIntention]),
        })),
      }))

      vi.mocked(db.insert).mockImplementation(mockInsert as any)

      const response = await POST(mockRequest)

      expect(mockRequest.json).toHaveBeenCalledTimes(1)
      expect(db.insert).toHaveBeenCalledTimes(1)
      expect(NextResponse.json).toHaveBeenCalledWith(
        { data: mockIntention },
        { status: 201 }
      )

      const jsonData = await response.json()
      expect(jsonData).toEqual({ data: mockIntention })
      expect(response.status).toBe(201)
    })

    it("deve retornar erro 400 quando faltar o campo name", async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({
          email: "john@example.com",
          company: "Company A",
          motivation: "I want to join",
        }),
      } as unknown as NextRequest

      const response = await POST(mockRequest)

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Missing required fields" },
        { status: 400 }
      )

      const jsonData = await response.json()
      expect(jsonData.error).toBe("Missing required fields")
      expect(response.status).toBe(400)
    })

    it("deve retornar erro 400 quando faltar o campo email", async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({
          name: "John Doe",
          company: "Company A",
          motivation: "I want to join",
        }),
      } as unknown as NextRequest

      const response = await POST(mockRequest)

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Missing required fields" },
        { status: 400 }
      )

      const jsonData = await response.json()
      expect(jsonData.error).toBe("Missing required fields")
      expect(response.status).toBe(400)
    })

    it("deve retornar erro 400 quando faltar o campo company", async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({
          name: "John Doe",
          email: "john@example.com",
          motivation: "I want to join",
        }),
      } as unknown as NextRequest

      const response = await POST(mockRequest)

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Missing required fields" },
        { status: 400 }
      )

      const jsonData = await response.json()
      expect(jsonData.error).toBe("Missing required fields")
      expect(response.status).toBe(400)
    })

    it("deve retornar erro 400 quando faltar o campo motivation", async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({
          name: "John Doe",
          email: "john@example.com",
          company: "Company A",
        }),
      } as unknown as NextRequest

      const response = await POST(mockRequest)

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Missing required fields" },
        { status: 400 }
      )

      const jsonData = await response.json()
      expect(jsonData.error).toBe("Missing required fields")
      expect(response.status).toBe(400)
    })

    it("deve tratar erros do banco de dados graciosamente", async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({
          name: "John Doe",
          email: "john@example.com",
          company: "Company A",
          motivation: "I want to join",
        }),
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

    it("deve criar intenção com todos os campos corretos", async () => {
      const mockIntentionData = {
        name: "Jane Smith",
        email: "jane@test.com",
        company: "Tech Corp",
        motivation: "Looking to grow my network",
      }

      const mockIntention = {
        id: "mock-id-123",
        ...mockIntentionData,
        status: "pending",
        createdAt: new Date("2024-01-15"),
      }

      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce(mockIntentionData),
      } as unknown as NextRequest

      const mockInsert = vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn().mockResolvedValueOnce([mockIntention]),
        })),
      }))

      vi.mocked(db.insert).mockImplementation(mockInsert as any)

      const response = await POST(mockRequest)

      const jsonData = await response.json()
      expect(jsonData.data).toMatchObject({
        name: "Jane Smith",
        email: "jane@test.com",
        company: "Tech Corp",
        motivation: "Looking to grow my network",
      })
    })
  })

  describe("GET /api/intention", () => {
    it("deve retornar todas as intenções com sucesso", async () => {
      const mockIntentions = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          company: "Company A",
          motivation: "Join the group",
          status: "pending",
          createdAt: new Date("2024-01-01"),
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          company: "Company B",
          motivation: "Networking",
          status: "approved",
          createdAt: new Date("2024-01-02"),
        },
      ]

      const mockSelect = vi.fn(() => ({
        from: vi.fn().mockResolvedValueOnce(mockIntentions),
      }))

      vi.mocked(db.select).mockImplementation(mockSelect as any)

      const response = await GET()

      expect(db.select).toHaveBeenCalledTimes(1)
      expect(NextResponse.json).toHaveBeenCalledWith(
        { data: mockIntentions },
        { status: 200 }
      )

      const jsonData = await response.json()
      expect(jsonData).toEqual({ data: mockIntentions })
      expect(jsonData.data).toHaveLength(2)
    })

    it("deve retornar array vazio quando não há intenções", async () => {
      const mockSelect = vi.fn(() => ({
        from: vi.fn().mockResolvedValueOnce([]),
      }))

      vi.mocked(db.select).mockImplementation(mockSelect as any)

      const response = await GET()

      expect(db.select).toHaveBeenCalledTimes(1)
      expect(NextResponse.json).toHaveBeenCalledWith(
        { data: [] },
        { status: 200 }
      )

      const jsonData = await response.json()
      expect(jsonData.data).toHaveLength(0)
    })

    it("deve tratar erros do banco de dados graciosamente", async () => {
      const mockError = new Error("Database connection failed")
      const mockSelect = vi.fn(() => ({
        from: vi.fn().mockRejectedValueOnce(mockError),
      }))

      vi.mocked(db.select).mockImplementation(mockSelect as any)

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {})

      const response = await GET()

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

    it("deve retornar intenções com estrutura correta", async () => {
      const mockIntention = {
        id: "unique-id-789",
        name: "Test User",
        email: "test@example.com",
        company: "Test Company",
        motivation: "Test motivation",
        status: "pending",
        createdAt: new Date("2024-06-15T10:30:00Z"),
      }

      const mockSelect = vi.fn(() => ({
        from: vi.fn().mockResolvedValueOnce([mockIntention]),
      }))

      vi.mocked(db.select).mockImplementation(mockSelect as any)

      const response = await GET()

      const jsonData = await response.json()
      expect(jsonData.data).toHaveLength(1)
      expect(jsonData.data[0]).toMatchObject({
        id: "unique-id-789",
        name: "Test User",
        email: "test@example.com",
        company: "Test Company",
        motivation: "Test motivation",
        status: "pending",
      })
    })

    it("deve retornar status 200 para requisição bem-sucedida", async () => {
      const mockSelect = vi.fn(() => ({
        from: vi.fn().mockResolvedValueOnce([]),
      }))

      vi.mocked(db.select).mockImplementation(mockSelect as any)

      const response = await GET()

      expect(response.status).toBe(200)
    })
  })
})
