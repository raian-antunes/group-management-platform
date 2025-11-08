import { db } from "@/drizzle/config"
import { eq } from "drizzle-orm"
import { invites } from "@/drizzle/schema"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    if (!token) {
      return NextResponse.json(
        { error: "Token query parameter is required" },
        { status: 400 }
      )
    }

    const [result] = await db
      .select()
      .from(invites)
      .where(eq(invites.token, token))
      .limit(1)

    if (!result) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 })
    }

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
