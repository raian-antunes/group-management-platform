import { db } from "@/drizzle/config"
import { invites } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export const getInvite = async ({ token }: { token: string }) => {
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
