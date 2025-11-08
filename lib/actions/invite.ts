"use server"

import { getInvite, createInvite as createInviteDal } from "@/lib/dal/invite"

export type ActionResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  error?: string
}

export async function createInviteAction({
  intentionId,
}: {
  intentionId: string
}): Promise<ActionResponse> {
  try {
    const result = await createInviteDal({ intentionId })

    if (!result) {
      return { success: false, message: "Erro ao criar convite." }
    }

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

export async function updateInviteAction({
  token,
}: {
  token: string
}): Promise<ActionResponse> {
  try {
    const result = await getInvite({ token })

    if (!result) {
      return { success: false, message: "Token de convite inválido." }
    }

    if (result.usedAt !== null) {
      return { success: false, message: "Token de convite já foi usado." }
    }

    await updateInviteAction({ token })

    return { success: true, message: "Convite atualizado com sucesso." }
  } catch (error) {
    console.error("Erro ao atualizar convite:", error)
    return {
      success: false,
      message: "Erro ao atualizar convite.",
      error: "Falha ao atualizar convite.",
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
