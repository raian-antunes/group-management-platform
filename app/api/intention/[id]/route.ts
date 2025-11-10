import { db } from "@/drizzle/config"
import { intentions } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params
    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const [result] = await db
      .update(intentions)
      .set({ status: status })
      .where(eq(intentions.id, id))
      .returning()

    if (!result) {
      return NextResponse.json(
        { error: "Intention not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: result }, { status: 200 })
  } catch (error) {
    console.error("Error updating the intention:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params

    const [result] = await db
      .select()
      .from(intentions)
      .where(eq(intentions.id, id))

    if (!result) {
      return NextResponse.json(
        { error: "Intention not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: result }, { status: 200 })
  } catch (error) {
    console.error("Error getting the intention:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
