"use server"

import { db } from "@/drizzle/config"
import { invites } from "@/drizzle/schema"
import { v4 as uuidv4 } from "uuid"

export type ActionResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  error?: string
}

export async function createInvite({
  intentionId,
}: {
  intentionId: string
}): Promise<ActionResponse> {
  const data = {
    token: uuidv4(),
    intentionId,
  }

  try {
    const [result] = await db.insert(invites).values(data).returning()

    console.log("Convite criado com sucesso:", result)

    return { success: true, message: "Convite criado com sucesso." }
  } catch (error) {
    console.error("Erro ao criar convite:", error)
    return {
      success: false,
      message: "Erro ao criar convite.",
      error: "Falha ao criar convite.",
    }
  }
}
