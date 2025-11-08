import { validateInviteToken } from "@/lib/actions/invite"
import { getInvite } from "@/lib/dal/invite"
import { Invite } from "@/drizzle/schema"
import { useEffect, useState } from "react"

export default function useValidateToken(token: string) {
  const [invite, setInvite] = useState<Invite | null>(null)
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

        // const invite = await getInvite({ token })
        // if (!invite) {
        //   return
        // }

        // setInvite(invite)
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
    invite,
    isValidating,
    isValidToken,
  }
}
