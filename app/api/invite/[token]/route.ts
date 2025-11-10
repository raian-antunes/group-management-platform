import { db } from "@/drizzle/config"
import { invites } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) => {
  try {
    const { token } = await params

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const [result] = await db
      .update(invites)
      .set({
        usedAt: new Date(),
      })
      .where(eq(invites.token, token))
      .returning()

    if (!result) {
      return NextResponse.json(
        { error: "Invite not found or failed to update" },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error("Error updating invite:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
