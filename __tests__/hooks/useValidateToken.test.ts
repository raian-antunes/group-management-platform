import { renderHook, waitFor } from "@testing-library/react"
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import useValidateToken from "../../hooks/useValidateToken"
import * as inviteActions from "../../lib/actions/invite"

// Mock the invite actions
vi.mock("../../lib/actions/invite", () => ({
  validateInviteToken: vi.fn(),
}))

// Mock fetch globally
global.fetch = vi.fn()

describe("useValidateToken", () => {
  const mockToken = "valid-token-123"
  const mockInviteData = {
    id: "1",
    token: mockToken,
    intentionId: "intention-1",
    usedAt: null,
    createdAt: new Date().toISOString(),
    intention: {
      id: "intention-1",
      name: "Test Intention",
      description: "Test Description",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("valida token com sucesso", async () => {
    vi.mocked(inviteActions.validateInviteToken).mockResolvedValue({
      success: true,
      message: "Token de convite válido.",
    })

    vi.mocked(fetch).mockResolvedValue({
      json: async () => ({ data: mockInviteData }),
    } as Response)

    const { result } = renderHook(() => useValidateToken(mockToken))

    await waitFor(() => {
      expect(result.current.isValidating).toBe(false)
    })

    expect(result.current.isValidToken).toBe(true)
    expect(result.current.invite).toEqual(mockInviteData)
  })

  it("trata token inválido", async () => {
    vi.mocked(inviteActions.validateInviteToken).mockResolvedValue({
      success: false,
      message: "Token de convite inválido.",
    })

    const { result } = renderHook(() => useValidateToken(mockToken))

    await waitFor(() => {
      expect(result.current.isValidating).toBe(false)
    })

    expect(result.current.isValidToken).toBe(false)
    expect(result.current.message).toBe("Token de convite inválido.")
  })

  it("não valida quando token está vazio", async () => {
    const { result } = renderHook(() => useValidateToken(""))

    await waitFor(() => {
      expect(result.current.isValidating).toBe(false)
    })

    expect(inviteActions.validateInviteToken).not.toHaveBeenCalled()
  })
})
