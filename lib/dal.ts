import { db } from "@/drizzle/config"
import { intentions, users } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { getSession } from "./auth"
import { cache } from "react"

export const getIntentions = async () => {
  try {
    const result = await db.select().from(intentions)
    return result
  } catch {
    return []
  }
}

export const getIntention = async (id: string) => {
  try {
    const result = await db
      .select()
      .from(intentions)
      .where(eq(intentions.id, id))
    return result[0] || null
  } catch {
    return null
  }
}

export const getUserByEmail = async (email: string) => {
  try {
    const result = await db.select().from(users).where(eq(users.email, email))

    return result[0]
  } catch {
    return null
  }
}

export const getCurrentUser = cache(async () => {
  const session = await getSession()

  if (!session) return null

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))

    return result[0] || null
  } catch {
    return null
  }
})
