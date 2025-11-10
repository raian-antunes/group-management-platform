import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import SignOutButton from "@/components/signOutButton"

// Mock do signOutAction
const mockSignOutAction = vi.fn()
vi.mock("@/lib/actions/auth", () => ({
  signOutAction: () => mockSignOutAction(),
}))

describe("Componente SignOutButton", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Renderização", () => {
    it("renderiza o botão de sair", () => {
      render(<SignOutButton />)
      const button = screen.getByRole("button", { name: /Sair/i })
      expect(button).toBeInTheDocument()
    })

    it("renderiza com texto inicial correto", () => {
      render(<SignOutButton />)
      expect(screen.getByText("Sair")).toBeInTheDocument()
    })

    it("não está desabilitado inicialmente", () => {
      render(<SignOutButton />)
      const button = screen.getByRole("button", { name: /Sair/i })
      expect(button).not.toBeDisabled()
    })
  })

  describe("Interação do Usuário", () => {
    it("chama signOutAction quando clicado", async () => {
      const user = userEvent.setup()
      mockSignOutAction.mockResolvedValue(undefined)

      render(<SignOutButton />)
      const button = screen.getByRole("button", { name: /Sair/i })

      await user.click(button)

      await waitFor(() => {
        expect(mockSignOutAction).toHaveBeenCalledTimes(1)
      })
    })

    it("mostra estado de carregamento quando clicado", async () => {
      const user = userEvent.setup()
      mockSignOutAction.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )

      render(<SignOutButton />)
      const button = screen.getByRole("button", { name: /Sair/i })

      await user.click(button)

      // Should show loading text
      expect(screen.getByText("Saindo...")).toBeInTheDocument()
      expect(button).toBeDisabled()
    })

    it("desabilita o botão durante o processo de sign out", async () => {
      const user = userEvent.setup()
      mockSignOutAction.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )

      render(<SignOutButton />)
      const button = screen.getByRole("button", { name: /Sair/i })

      await user.click(button)

      expect(button).toBeDisabled()
    })

    it("previne múltiplos cliques durante o sign out", async () => {
      const user = userEvent.setup()
      mockSignOutAction.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )

      render(<SignOutButton />)
      const button = screen.getByRole("button", { name: /Sair/i })

      await user.click(button)
      await user.click(button)
      await user.click(button)

      await waitFor(() => {
        expect(mockSignOutAction).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe("Estado de Carregamento", () => {
    it("exibe texto 'Saindo...' durante carregamento", async () => {
      const user = userEvent.setup()
      mockSignOutAction.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )

      render(<SignOutButton />)
      const button = screen.getByRole("button", { name: /Sair/i })

      await user.click(button)

      expect(screen.getByText("Saindo...")).toBeInTheDocument()
      expect(screen.queryByText("Sair")).not.toBeInTheDocument()
    })

    it("retorna ao estado normal após sign out bem-sucedido", async () => {
      const user = userEvent.setup()
      mockSignOutAction.mockResolvedValue(undefined)

      render(<SignOutButton />)
      const button = screen.getByRole("button", { name: /Sair/i })

      await user.click(button)

      await waitFor(() => {
        expect(mockSignOutAction).toHaveBeenCalled()
      })

      // After completion, should return to normal state
      await waitFor(() => {
        expect(screen.getByText("Sair")).toBeInTheDocument()
        expect(button).not.toBeDisabled()
      })
    })
  })
})
