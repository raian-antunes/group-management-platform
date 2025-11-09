import { db } from "@/drizzle/config"
import { announcements } from "@/drizzle/schema"
import { desc } from "drizzle-orm"
import { NextResponse } from "next/server"

export const GET = async () => {
  try {
    const result = await db.query.announcements.findMany({
      orderBy: desc(announcements.createdAt),
      with: {
        user: true,
      },
    })

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
