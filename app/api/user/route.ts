import { NextResponse } from "next/server"
import { getSession, hashPassword } from "@/lib/auth"
import { db } from "@/drizzle/config"
import { USER_ROLE, users } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { createNewId } from "@/lib/utils"

export const GET = async () => {
  try {
    const session = await getSession()

    if (!session)
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      )

    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))

    if (!result) {
      return NextResponse.json(
        { error: "User not found or not authenticated" },
        { status: 401 }
      )
    }

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error("Error getting current user:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export const POST = async (request: Request) => {
  try {
    const data = await request.json()

    if (!data.name || !data.email || !data.password || !data.company) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(data.password)
    const id = createNewId()

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

    if (!result) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: result }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
