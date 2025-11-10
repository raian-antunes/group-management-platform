import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import "@testing-library/jest-dom"
import SignupPage from "@/app/(auth)/signup/page"

// Mock do hook useValidateToken
const mockUseValidateToken = vi.fn()
vi.mock("@/hooks/useValidateToken", () => ({
  default: () => mockUseValidateToken(),
}))

// Mock do componente FormSignUp
vi.mock("@/components/layout/form/formSignUp", () => ({
  default: ({ invite }: { invite: unknown }) => (
    <div data-testid="form-signup">
      Form SignUp Mock - Invite: {JSON.stringify(invite)}
    </div>
  ),
}))

// Mock do useSearchParams para retornar um token
vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation")
  return {
    ...actual,
    useSearchParams: () => ({
      get: (key: string) => (key === "token" ? "test-token-123" : null),
    }),
  }
})

describe("Signup Page", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Estado de Validação", () => {
    it("renderiza mensagem 'Validando token...' quando está validando", () => {
      mockUseValidateToken.mockReturnValue({
        invite: null,
        message: "",
        isValidToken: false,
        isValidating: true,
      })

      render(<SignupPage />)
      expect(screen.getByText("Validando token...")).toBeInTheDocument()
    })

    it("renderiza mensagem de erro quando token é inválido", () => {
      mockUseValidateToken.mockReturnValue({
        invite: null,
        message: "Token inválido",
        isValidToken: false,
        isValidating: false,
      })

      render(<SignupPage />)
      expect(screen.getByText("Token inválido")).toBeInTheDocument()
    })

    it("não renderiza o formulário quando está validando", () => {
      mockUseValidateToken.mockReturnValue({
        invite: null,
        message: "",
        isValidToken: false,
        isValidating: true,
      })

      render(<SignupPage />)
      expect(screen.queryByTestId("form-signup")).not.toBeInTheDocument()
    })

    it("não renderiza o formulário quando token é inválido", () => {
      mockUseValidateToken.mockReturnValue({
        invite: null,
        message: "Token expirado",
        isValidToken: false,
        isValidating: false,
      })

      render(<SignupPage />)
      expect(screen.queryByTestId("form-signup")).not.toBeInTheDocument()
    })
  })

  describe("Token Válido", () => {
    const mockInvite = {
      id: "invite-1",
      email: "test@example.com",
      token: "test-token-123",
    }

    it("renderiza o formulário quando token é válido", () => {
      mockUseValidateToken.mockReturnValue({
        invite: mockInvite,
        message: "",
        isValidToken: true,
        isValidating: false,
      })

      render(<SignupPage />)
      expect(screen.getByTestId("form-signup")).toBeInTheDocument()
    })

    it("renderiza título 'Crie uma nova conta'", () => {
      mockUseValidateToken.mockReturnValue({
        invite: mockInvite,
        message: "",
        isValidToken: true,
        isValidating: false,
      })

      render(<SignupPage />)
      expect(screen.getByText("Crie uma nova conta")).toBeInTheDocument()
    })

    it("renderiza descrição do formulário", () => {
      mockUseValidateToken.mockReturnValue({
        invite: mockInvite,
        message: "",
        isValidToken: true,
        isValidating: false,
      })

      render(<SignupPage />)
      expect(
        screen.getByText(
          "Insira seu email e uma senha abaixo para criar uma nova conta"
        )
      ).toBeInTheDocument()
    })

    it("passa o invite para o FormSignUp", () => {
      mockUseValidateToken.mockReturnValue({
        invite: mockInvite,
        message: "",
        isValidToken: true,
        isValidating: false,
      })

      render(<SignupPage />)
      const form = screen.getByTestId("form-signup")
      expect(form.textContent).toContain(JSON.stringify(mockInvite))
    })
  })

  describe("Estrutura do Card", () => {
    it("renderiza card com classes de responsividade", () => {
      mockUseValidateToken.mockReturnValue({
        invite: null,
        message: "",
        isValidToken: false,
        isValidating: true,
      })

      const { container } = render(<SignupPage />)
      const card = container.querySelector(".sm\\:mx-auto")
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass("sm:w-full", "sm:max-w-md", "mt-8")
    })

    it("cabeçalho tem centralização quando token é válido", () => {
      mockUseValidateToken.mockReturnValue({
        invite: { id: "1", email: "test@example.com" },
        message: "",
        isValidToken: true,
        isValidating: false,
      })

      const { container } = render(<SignupPage />)
      const header = container.querySelector('[class*="text-center"]')
      expect(header).toBeInTheDocument()
    })
  })

  describe("Fluxo de Estados", () => {
    it("transição de validando para token válido", async () => {
      const { rerender } = render(<SignupPage />)

      // Primeiro estado: validando
      mockUseValidateToken.mockReturnValue({
        invite: null,
        message: "",
        isValidToken: false,
        isValidating: true,
      })
      rerender(<SignupPage />)
      expect(screen.getByText("Validando token...")).toBeInTheDocument()

      // Segundo estado: token válido
      mockUseValidateToken.mockReturnValue({
        invite: { id: "1", email: "test@example.com" },
        message: "",
        isValidToken: true,
        isValidating: false,
      })
      rerender(<SignupPage />)

      await waitFor(() => {
        expect(screen.queryByText("Validando token...")).not.toBeInTheDocument()
        expect(screen.getByTestId("form-signup")).toBeInTheDocument()
      })
    })

    it("transição de validando para token inválido", async () => {
      const { rerender } = render(<SignupPage />)

      // Primeiro estado: validando
      mockUseValidateToken.mockReturnValue({
        invite: null,
        message: "",
        isValidToken: false,
        isValidating: true,
      })
      rerender(<SignupPage />)
      expect(screen.getByText("Validando token...")).toBeInTheDocument()

      // Segundo estado: token inválido
      mockUseValidateToken.mockReturnValue({
        invite: null,
        message: "Token expirado",
        isValidToken: false,
        isValidating: false,
      })
      rerender(<SignupPage />)

      await waitFor(() => {
        expect(screen.queryByText("Validando token...")).not.toBeInTheDocument()
        expect(screen.getByText("Token expirado")).toBeInTheDocument()
      })
    })
  })
})
