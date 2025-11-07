"use server"

import { db } from "@/drizzle/config"
import { invites } from "@/drizzle/schema"
import { getInvite } from "@/lib/dal/invite"
import { createNewId } from "../utils"

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
    id: createNewId(),
    token: createNewId(),
    intentionId,
  }

  try {
    const [result] = await db.insert(invites).values(data).returning()

    console.log("Convite criado com sucesso:", result)
    console.log(
      "Acesse-se URL com token para cadastro:",
      process.env.NEXT_PUBLIC_BASE_URL + "/signUp?token=" + result.token
    )

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

export async function validateInviteToken(
  token: string
): Promise<ActionResponse> {
  try {
    const result = await getInvite({ token })

    if (!result) {
      return { success: false, message: "Token de convite inválido." }
    }

    if (result.usedAt !== null) {
      return { success: false, message: "Token de convite já foi usado." }
    }

    return { success: true, message: "Token de convite válido." }
  } catch (error) {
    console.error("Erro ao criar convite:", error)
    return {
      success: false,
      message: "Erro ao criar convite.",
      error: "Falha ao criar convite.",
    }
  }
}
