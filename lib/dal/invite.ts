import { db } from "@/drizzle/config"
import { Invite, invites } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { createNewId } from "../utils"

export const getInvite = async ({
  token,
}: {
  token: string
}): Promise<Invite | null> => {
  try {
    const [result] = await db
      .select()
      .from(invites)
      .where(eq(invites.token, token))

    return result || null
  } catch (error) {
    console.log("Error getting the invite:", error)
    return null
  }
}

export const createInvite = async ({
  intentionId,
}: {
  intentionId: string
}): Promise<Invite | null> => {
  try {
    const [result] = await db
      .insert(invites)
      .values({ id: createNewId(), token: createNewId(), intentionId })
      .returning()

    return result || null
  } catch (error) {
    console.log("Error creating the invite:", error)
    return null
  }
}

export const updateInvite = async ({
  token,
}: {
  token: string
}): Promise<Invite | null> => {
  try {
    const [result] = await db
      .update(invites)
      .set({
        usedAt: new Date(),
      })
      .where(eq(invites.token, token))
      .returning()

    return result || null
  } catch (error) {
    console.log("Error updating the invite:", error)
    return null
  }
}
