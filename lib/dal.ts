import { db } from "@/drizzle/config"
import { users } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export const getUserByEmail = async (email: string) => {
  try {
    const result = await db.select().from(users).where(eq(users.email, email))

    return result[0]
  } catch {
    return null
  }
}
