import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "@/app/api/user/route"
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

// Mock do auth
vi.mock("@/lib/auth", () => ({
  getSession: vi.fn(),
  hashPassword: vi.fn(() => Promise.resolve("hashedpassword123")),
}))

// Mock do createNewId
vi.mock("@/lib/utils", () => ({
  createNewId: vi.fn(() => "mock-id-123"),
}))

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("Rotas de API de Users", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("GET /api/user", () => {
    it("deve retornar o usuário autenticado com sucesso", async () => {
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

      const mockSession = { userId: "user-123", userRole: "user" }

      const { getSession } = await import("@/lib/auth")
      vi.mocked(getSession).mockResolvedValueOnce(mockSession)

      const mockSelect = vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn().mockResolvedValueOnce([mockUser]),
        })),
      }))

      vi.mocked(db.select).mockImplementation(mockSelect as any)

      const response = await GET()

      expect(getSession).toHaveBeenCalledTimes(1)
      expect(db.select).toHaveBeenCalledTimes(1)
      expect(NextResponse.json).toHaveBeenCalledWith({ data: [mockUser] })

      const jsonData = await response.json()
      expect(jsonData).toEqual({ data: [mockUser] })
    })

    it("deve retornar erro 401 quando o usuário não estiver autenticado", async () => {
      const { getSession } = await import("@/lib/auth")
      vi.mocked(getSession).mockResolvedValueOnce(null)

      const response = await GET()

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "User not authenticated" },
        { status: 401 }
      )

      const jsonData = await response.json()
      expect(jsonData.error).toBe("User not authenticated")
      expect(response.status).toBe(401)
    })

    it("deve tratar erros do banco de dados graciosamente", async () => {
      const mockSession = { userId: "user-123", userRole: "user" }

      const { getSession } = await import("@/lib/auth")
      vi.mocked(getSession).mockResolvedValueOnce(mockSession)

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

      const response = await GET()

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error getting current user:",
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
        id: "user-456",
        name: "Jane Smith",
        email: "jane@example.com",
        password: "hashedpassword456",
        role: "admin",
        company: "Company B",
        createdAt: new Date("2024-06-15T10:30:00Z"),
        inviteId: "invite-123",
      }

      const mockSession = { userId: "user-456", userRole: "admin" }

      const { getSession } = await import("@/lib/auth")
      vi.mocked(getSession).mockResolvedValueOnce(mockSession)

      const mockSelect = vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn().mockResolvedValueOnce([mockUser]),
        })),
      }))

      vi.mocked(db.select).mockImplementation(mockSelect as any)

      const response = await GET()

      const jsonData = await response.json()
      expect(jsonData.data[0]).toMatchObject({
        id: "user-456",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "admin",
        company: "Company B",
      })
    })
  })

  describe("POST /api/user", () => {
    it("deve criar um usuário com sucesso", async () => {
      const mockUser = {
        id: "mock-id-123",
        name: "John Doe",
        email: "john@example.com",
        password: "hashedpassword123",
        role: "user",
        company: "Company A",
        createdAt: new Date("2024-01-01"),
        inviteId: null,
      }

      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({
          name: "John Doe",
          email: "john@example.com",
          password: "plainpassword",
          company: "Company A",
        }),
      } as unknown as NextRequest

      const mockInsert = vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn().mockResolvedValueOnce([mockUser]),
        })),
      }))

      vi.mocked(db.insert).mockImplementation(mockInsert as any)

      const response = await POST(mockRequest)

      expect(mockRequest.json).toHaveBeenCalledTimes(1)
      expect(db.insert).toHaveBeenCalledTimes(1)
      expect(NextResponse.json).toHaveBeenCalledWith(
        { data: mockUser },
        { status: 201 }
      )

      const jsonData = await response.json()
      expect(jsonData).toEqual({ data: mockUser })
      expect(response.status).toBe(201)
    })

    it("deve retornar erro 400 quando faltar o campo name", async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({
          email: "john@example.com",
          password: "plainpassword",
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

    it("deve retornar erro 400 quando faltar o campo email", async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({
          name: "John Doe",
          password: "plainpassword",
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

    it("deve retornar erro 400 quando faltar o campo password", async () => {
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

    it("deve retornar erro 400 quando faltar o campo company", async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({
          name: "John Doe",
          email: "john@example.com",
          password: "plainpassword",
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

    it("deve retornar erro 500 quando falhar ao criar usuário", async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({
          name: "John Doe",
          email: "john@example.com",
          password: "plainpassword",
          company: "Company A",
        }),
      } as unknown as NextRequest

      const mockInsert = vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn().mockResolvedValueOnce([]),
        })),
      }))

      vi.mocked(db.insert).mockImplementation(mockInsert as any)

      const response = await POST(mockRequest)

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Failed to create user" },
        { status: 500 }
      )

      const jsonData = await response.json()
      expect(jsonData.error).toBe("Failed to create user")
      expect(response.status).toBe(500)
    })

    it("deve tratar erros do banco de dados graciosamente", async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({
          name: "John Doe",
          email: "john@example.com",
          password: "plainpassword",
          company: "Company A",
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

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error creating user:",
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

    it("deve criar usuário com password hash correto", async () => {
      const mockUser = {
        id: "mock-id-123",
        name: "Jane Smith",
        email: "jane@example.com",
        password: "hashedpassword123",
        role: "user",
        company: "Company B",
        createdAt: new Date("2024-01-15"),
        inviteId: null,
      }

      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({
          name: "Jane Smith",
          email: "jane@example.com",
          password: "plainpassword123",
          company: "Company B",
        }),
      } as unknown as NextRequest

      const { hashPassword } = await import("@/lib/auth")
      vi.mocked(hashPassword).mockResolvedValueOnce("hashedpassword123")

      const mockInsert = vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn().mockResolvedValueOnce([mockUser]),
        })),
      }))

      vi.mocked(db.insert).mockImplementation(mockInsert as any)

      const response = await POST(mockRequest)

      expect(hashPassword).toHaveBeenCalledWith("plainpassword123")
      const jsonData = await response.json()
      expect(jsonData.data.password).toBe("hashedpassword123")
    })

    it("deve criar usuário com role padrão de user", async () => {
      const mockUser = {
        id: "mock-id-123",
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword123",
        role: "user",
        company: "Test Company",
        createdAt: new Date("2024-01-20"),
        inviteId: null,
      }

      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({
          name: "Test User",
          email: "test@example.com",
          password: "testpassword",
          company: "Test Company",
        }),
      } as unknown as NextRequest

      const mockInsert = vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn().mockResolvedValueOnce([mockUser]),
        })),
      }))

      vi.mocked(db.insert).mockImplementation(mockInsert as any)

      const response = await POST(mockRequest)

      const jsonData = await response.json()
      expect(jsonData.data.role).toBe("user")
    })

    it("deve retornar status 201 para criação bem-sucedida", async () => {
      const mockUser = {
        id: "mock-id-123",
        name: "Sample User",
        email: "sample@example.com",
        password: "hashedpassword123",
        role: "user",
        company: "Sample Company",
        createdAt: new Date("2024-01-25"),
        inviteId: null,
      }

      const mockRequest = {
        json: vi.fn().mockResolvedValueOnce({
          name: "Sample User",
          email: "sample@example.com",
          password: "samplepassword",
          company: "Sample Company",
        }),
      } as unknown as NextRequest

      const mockInsert = vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn().mockResolvedValueOnce([mockUser]),
        })),
      }))

      vi.mocked(db.insert).mockImplementation(mockInsert as any)

      const response = await POST(mockRequest)

      expect(response.status).toBe(201)
    })
  })
})
