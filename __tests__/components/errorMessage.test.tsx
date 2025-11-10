import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import "@testing-library/jest-dom"
import ErrorMessage from "../../components/errorMessage"

describe("Componente Error Message", () => {
  it("renderiza corretamente", () => {
    render(
      <ErrorMessage id={"error-name"} message={["Sou mensagem de error"]} />
    )

    const errorElement = screen.getByRole("paragraph")

    expect(errorElement).toBeInTheDocument()
    expect(errorElement["id"]).toBe("error-name")
    expect(errorElement.textContent).toBe("Sou mensagem de error")
  })

  it("não renderiza quando message é undefined", () => {
    render(<ErrorMessage id={"error-name"} message={undefined} />)
    const errorElement = screen.queryByRole("paragraph")
    expect(errorElement).not.toBeInTheDocument()
  })

  it("não renderiza quando message é array vazio", () => {
    render(<ErrorMessage id={"error-name"} message={[]} />)
    const errorElement = screen.queryByRole("paragraph")
    expect(errorElement).not.toBeInTheDocument()
  })
})
