import { Intention } from "@/drizzle/schema"
import { apiClient } from "../apiClient"

export const createIntention = async (
  data: Omit<Intention, "id" | "createdAt" | "status">
): Promise<Intention | null> => {
  try {
    const intention = await apiClient
      .post("/intention", data)
      .then((res) => res.data)

    return intention
  } catch (error) {
    console.error("Error creating the intention:", error)
    return null
  }
}

export const updateIntentionStatus = async ({
  id,
  status,
}: Pick<Intention, "id" | "status">): Promise<Intention | null> => {
  try {
    const intention = await apiClient
      .put(`/intention/${id}`, { status })
      .then((res) => res.data)

    return intention
  } catch (error) {
    console.error("Error updating the intention:", error)
    return null
  }
}

export const getIntentions = async (): Promise<Array<Intention>> => {
  try {
    const result = await apiClient.get("/intention").then((res) => res.data)
    return result
  } catch (error) {
    console.error("Error getting the intentions:", error)
    return []
  }
}

export const getIntention = async (
  id: Pick<Intention, "id">["id"]
): Promise<Intention | null> => {
  try {
    const result = await apiClient
      .get(`/intention/${id}`)
      .then((res) => res.data)

    return result
  } catch (error) {
    console.error("Error getting the intention:", error)
    return null
  }
}
