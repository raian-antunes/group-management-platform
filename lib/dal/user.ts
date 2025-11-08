import { db } from "@/drizzle/config"
import { User, users, USER_ROLE } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { getSession, hashPassword } from "../auth"
import { createNewId } from "../utils"
import { cache } from "react"

export async function createUser(
  data: Omit<User, "id" | "createdAt" | "role">
): Promise<User | null> {
  const hashedPassword = await hashPassword(data.password)
  const id = createNewId()

  try {
    const [result] = await db
      .insert(users)
      .values({
        id,
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: USER_ROLE.user.value,
        company: data.company,
      })
      .returning()

    return result || null
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const session = await getSession()

  if (!session) return null

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))

    return result[0] || null
  } catch (error) {
    console.error("Error getting the user:", error)
    return null
  }
})

export const getUserByEmail = async (
  email: Pick<User, "email">["email"]
): Promise<User | null> => {
  try {
    const [result] = await db.select().from(users).where(eq(users.email, email))

    return result
  } catch (error) {
    console.error("Error getting the user by email:", error)
    return null
  }
}
