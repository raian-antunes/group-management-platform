import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import "@testing-library/jest-dom"
import SignInPage from "@/app/(auth)/signin/page"

// Mock do componente FormSignIn
vi.mock("@/components/layout/form/formSignIn", () => ({
  default: () => <div data-testid="form-signin">Form SignIn Mock</div>,
}))

describe("SignIn Page", () => {
  describe("Renderização", () => {
    it("renderiza o card principal", () => {
      const { container } = render(<SignInPage />)
      const card = container.querySelector('[data-slot="card"]')
      expect(card).toBeInTheDocument()
    })

    it("renderiza o título do card", () => {
      render(<SignInPage />)
      expect(screen.getByText("Entre na sua conta")).toBeInTheDocument()
    })

    it("renderiza a descrição do card", () => {
      render(<SignInPage />)
      expect(
        screen.getByText("Insira seu email abaixo para entrar na sua conta")
      ).toBeInTheDocument()
    })

    it("renderiza o formulário de sign in", () => {
      render(<SignInPage />)
      expect(screen.getByTestId("form-signin")).toBeInTheDocument()
    })
  })

  describe("Footer", () => {
    it("renderiza mensagem para usuários sem conta", () => {
      render(<SignInPage />)
      expect(screen.getByText(/Não tem uma conta?/i)).toBeInTheDocument()
    })

    it("renderiza link para envio de intenção", () => {
      render(<SignInPage />)
      const link = screen.getByRole("link", {
        name: /Envie uma intenção e avaliaremos/i,
      })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute("href", "/")
    })

    it("aplica estilos corretos no link de intenção", () => {
      render(<SignInPage />)
      const link = screen.getByRole("link", {
        name: /Envie uma intenção e avaliaremos/i,
      })
      expect(link).toHaveClass("font-medium")
    })
  })

  describe("Estrutura", () => {
    it("card tem classes de responsividade corretas", () => {
      const { container } = render(<SignInPage />)
      const card = container.querySelector(".sm\\:mx-auto")
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass("sm:w-full", "sm:max-w-md", "mt-8")
    })

    it("cabeçalho tem centralização de texto", () => {
      const { container } = render(<SignInPage />)
      const header = container.querySelector('[class*="text-center"]')
      expect(header).toBeInTheDocument()
    })

    it("footer tem layout flex-col com gap", () => {
      const { container } = render(<SignInPage />)
      const footer = container.querySelector('[class*="flex-col"]')
      expect(footer).toBeInTheDocument()
    })
  })

  describe("Conteúdo do Card", () => {
    it("renderiza CardHeader, CardContent e CardFooter", () => {
      render(<SignInPage />)
      expect(screen.getByText("Entre na sua conta")).toBeInTheDocument()
      expect(screen.getByTestId("form-signin")).toBeInTheDocument()
      expect(screen.getByText(/Não tem uma conta?/i)).toBeInTheDocument()
    })
  })
})
