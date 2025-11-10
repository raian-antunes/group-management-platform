import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import "@testing-library/jest-dom"
import LandingPage from "@/app/(landing)/page"

// Mock do componente FormIntention
vi.mock("@/components/layout/form/formIntention", () => ({
  default: () => <div data-testid="form-intention">Form Intention Mock</div>,
}))

describe("Landing Page", () => {
  describe("Renderização", () => {
    it("renderiza o título principal", () => {
      render(<LandingPage />)
      expect(screen.getByText(/Plataforma de Gestão para/i)).toBeInTheDocument()
      expect(screen.getByText(/Grupos de Networking/i)).toBeInTheDocument()
    })

    it("renderiza o título com quebra de linha responsiva", () => {
      render(<LandingPage />)
      const br = document.querySelector("br")
      expect(br).toBeInTheDocument()
      expect(br).toHaveClass("hidden", "sm:block")
    })

    it("renderiza o formulário de intenção", () => {
      render(<LandingPage />)
      expect(screen.getByTestId("form-intention")).toBeInTheDocument()
    })
  })

  describe("Estrutura", () => {
    it("renderiza o Card container", () => {
      const { container } = render(<LandingPage />)
      const card = container.querySelector('[class*="mt-6"]')
      expect(card).toBeInTheDocument()
    })

    it("aplica as classes de responsividade corretas no container principal", () => {
      const { container } = render(<LandingPage />)
      const mainDiv = container.querySelector(".max-w-3xl")
      expect(mainDiv).toBeInTheDocument()
      expect(mainDiv).toHaveClass(
        "mx-auto",
        "px-4",
        "sm:px-6",
        "py-8",
        "sm:py-8"
      )
    })

    it("aplica estilos corretos no título", () => {
      const { container } = render(<LandingPage />)
      const title = screen.getByText(/Plataforma de Gestão para/i)
      expect(title).toHaveClass("md:text-4xl", "font-bold")
    })
  })

  describe("Layout", () => {
    it("tem estrutura de centralização no texto", () => {
      render(<LandingPage />)
      const textCenter = document.querySelector(".text-center")
      expect(textCenter).toBeInTheDocument()
    })

    it("renderiza o CardContent com FormIntention dentro", () => {
      render(<LandingPage />)
      const formIntention = screen.getByTestId("form-intention")
      expect(formIntention).toBeInTheDocument()
      expect(formIntention.textContent).toBe("Form Intention Mock")
    })
  })
})
