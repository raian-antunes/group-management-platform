import { db } from "@/drizzle/config"
import { intentions } from "@/drizzle/schema"
import { createNewId } from "@/lib/utils"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json()

    if (!data.name || !data.email || !data.company || !data.motivation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const [result] = await db
      .insert(intentions)
      .values({
        id: createNewId(),
        name: data.name,
        email: data.email,
        company: data.company,
        motivation: data.motivation,
      })
      .returning()

    return NextResponse.json({ data: result }, { status: 201 })
  } catch (error) {
    console.error("Error creating the intention:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export const GET = async () => {
  try {
    const result = await db.select().from(intentions)
    return NextResponse.json({ data: result }, { status: 200 })
  } catch (error) {
    console.error("Error getting the intentions:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
