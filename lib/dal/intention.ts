import { db } from "@/drizzle/config"
import { Intention, intentions } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export const getIntentions = async (): Promise<Array<Intention>> => {
  try {
    const result = await db.select().from(intentions)
    return result
  } catch (error) {
    console.log("Error getting the intentions:", error)
    return []
  }
}

export const getIntention = async (id: string): Promise<Intention | null> => {
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
