import { describe, it, expect } from "vitest"
import { cn, createNewId } from "../../lib/utils"

describe("utils", () => {
  describe("cn", () => {
    it("mescla nomes de classes", () => {
      const result = cn("text-red-500", "bg-blue-500")
      expect(result).toBe("text-red-500 bg-blue-500")
    })

    it("trata classes condicionais", () => {
      const result = cn("base", true && "active", false && "hidden")
      expect(result).toBe("base active")
    })

    it("mescla classes conflitantes", () => {
      const result = cn("px-2 py-1", "px-4")
      expect(result).toBe("py-1 px-4")
    })
  })

  describe("createNewId", () => {
    it("gera um UUID v4 válido", () => {
      const id = createNewId()
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      expect(id).toMatch(uuidRegex)
    })

    it("gera IDs únicos", () => {
      const id1 = createNewId()
      const id2 = createNewId()
      expect(id1).not.toBe(id2)
    })
  })
})
