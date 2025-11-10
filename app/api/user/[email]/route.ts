import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { db } from "@/drizzle/config"
import { users } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) => {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      )
    }

    const { email } = await params

    const [result] = await db.select().from(users).where(eq(users.email, email))

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error("Error getting user by email:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
