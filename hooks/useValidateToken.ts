import { validateInviteToken } from "@/lib/actions/invite"
import { useEffect, useState } from "react"

export default function useValidateToken(token: string) {
  const [isValidating, setIsValidating] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)

  useEffect(() => {
    async function validateToken(token: string) {
      try {
        setIsValidating(true)

        if (!token) {
          return
        }

        const result = await validateInviteToken(token)

        if (!result.success) {
          return
        }

        setIsValidToken(true)
      } catch (error) {
        console.error("Error validating token:", error)
      } finally {
        setIsValidating(false)
      }
    }

    validateToken(token)
  }, [token])

  return {
    isValidating,
    isValidToken,
  }
}
