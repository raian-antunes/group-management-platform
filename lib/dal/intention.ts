import { db } from "@/drizzle/config"
import { Intention, intentions } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { createNewId } from "../utils"

export const createIntention = async (
  data: Omit<Intention, "id" | "createdAt" | "status">
): Promise<Intention | null> => {
  try {
    const [result] = await db
      .insert(intentions)
      .values({
        id: createNewId(),
        name: data.name,
        email: data.email,
        company: data.company,
        motivation: data.motivation,
      })
      .returning()

    return result
  } catch (error) {
    console.log("Error creating the intention:", error)
    return null
  }
}

export const updateIntentionStatus = async ({
  id,
  status,
}: Pick<Intention, "id" | "status">): Promise<Intention | null> => {
  try {
    const [result] = await db
      .update(intentions)
      .set({ status: status })
      .where(eq(intentions.id, id))
      .returning()

    return result
  } catch (error) {
    console.log("Error updating the intention:", error)
    return null
  }
}

export const getIntentions = async (): Promise<Array<Intention>> => {
  try {
    const result = await db.select().from(intentions)
    return result
  } catch (error) {
    console.log("Error getting the intentions:", error)
    return []
  }
}

export const getIntention = async (
  id: Pick<Intention, "id">["id"]
): Promise<Intention | null> => {
  try {
    const [result] = await db
      .select()
      .from(intentions)
      .where(eq(intentions.id, id))

    return result || null
  } catch (error) {
    console.log("Error getting the intention:", error)
    return null
  }
}
