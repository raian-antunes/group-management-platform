import { Intention, Invite } from "@/drizzle/schema"
import { apiClient } from "../apiClient"

export type InviteWithIntention = Invite & {
  intention: Intention
}

export const getInvite = async ({
  token,
}: {
  token: Pick<Invite, "token">["token"]
}): Promise<InviteWithIntention | null> => {
  try {
    const result = await apiClient
      .get(`/invite?token=${token}`)
      .then((res) => res.data)

    return result
  } catch (error) {
    console.error("Error getting the invite:", error)
    return null
  }
}

export const createInvite = async ({
  intentionId,
}: {
  intentionId: Pick<Invite, "intentionId">["intentionId"]
}): Promise<Invite | null> => {
  try {
    const result = await apiClient
      .post(`/invite`, {
        intentionId: intentionId,
      })
      .then((res) => res.data)

    return result || null
  } catch (error) {
    console.error("Error creating the invite:", error)
    return null
  }
}

export const updateInvite = async ({
  token,
}: {
  token: Pick<Invite, "token">["token"]
}): Promise<Invite | null> => {
  try {
    const result = await apiClient
      .put(`/invite/${token}`, {})
      .then((res) => res.data)

    return result || null
  } catch (error) {
    console.error("Error updating the invite:", error)
    return null
  }
}
