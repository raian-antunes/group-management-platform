import { renderHook, waitFor } from "@testing-library/react"
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { useIsMobile } from "../../hooks/use-mobile"

describe("useIsMobile", () => {
  let mockMatchMedia: {
    matches: boolean
    media: string
    addEventListener: ReturnType<typeof vi.fn>
    removeEventListener: ReturnType<typeof vi.fn>
    addListener: ReturnType<typeof vi.fn>
    removeListener: ReturnType<typeof vi.fn>
    dispatchEvent: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockMatchMedia = {
      matches: false,
      media: "",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query) => ({
        ...mockMatchMedia,
        media: query,
      })),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("retorna false para largura de desktop", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    })

    const { result } = renderHook(() => useIsMobile())

    await waitFor(() => {
      expect(result.current).toBe(false)
    })
  })

  it("retorna true para largura de mobile", async () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    })

    const { result } = renderHook(() => useIsMobile())

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  it("limpa o event listener ao desmontar", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    })

    const { unmount } = renderHook(() => useIsMobile())

    unmount()

    expect(mockMatchMedia.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    )
  })
})
