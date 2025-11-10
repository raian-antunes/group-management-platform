import { db } from "@/drizzle/config"
import { eq } from "drizzle-orm"
import { invites } from "@/drizzle/schema"
import { NextRequest, NextResponse } from "next/server"
import { createNewId } from "@/lib/utils"

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

    const [result] = await db.query.invites.findMany({
      where: eq(invites.token, token),
      with: {
        intention: true,
      },
      limit: 1,
    })

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

export const POST = async (request: NextRequest) => {
  try {
    const { intentionId } = await request.json()

    if (!intentionId) {
      return NextResponse.json(
        { error: "intentionId is required" },
        { status: 400 }
      )
    }

    const [result] = await db
      .insert(invites)
      .values({ id: createNewId(), token: createNewId(), intentionId })
      .returning()

    if (!result) {
      return NextResponse.json(
        { error: "Failed to create invite" },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: result }, { status: 201 })
  } catch (error) {
    console.error("Error creating invite:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
