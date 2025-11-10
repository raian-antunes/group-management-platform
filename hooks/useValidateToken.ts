import { validateInviteToken } from "@/lib/actions/invite"
import { useEffect, useState } from "react"
import { InviteWithIntention } from "@/lib/dal/invite"

export default function useValidateToken(token: string) {
  const [invite, setInvite] = useState<InviteWithIntention | null>(null)
  const [isValidating, setIsValidating] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function validateToken(token: string) {
      try {
        setIsValidating(true)

        if (!token) {
          return
        }

        const result = await validateInviteToken(token)

        if (!result.success) {
          setMessage(result.message)
          return
        }

        const invite = await fetch("/api/invite?token=" + token)
        const inviteData = await invite.json()
        setInvite(inviteData.data)

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
    message,
    isValidating,
    isValidToken,
  }
}
