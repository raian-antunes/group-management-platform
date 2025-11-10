"use server"

import { Invite } from "@/drizzle/schema"
import { getInvite, createInvite, updateInvite } from "@/lib/dal/invite"
import { ActionResponse } from "@/types"

export async function createInviteAction({
  intentionId,
}: Pick<Invite, "intentionId">): Promise<ActionResponse> {
  try {
    const result = await createInvite({ intentionId })

    if (!result) {
      return { success: false, message: "Erro ao criar convite." }
    }

    console.warn(
      "------------------------------------------------------------------------------------------------------------------"
    )
    console.warn(
      "| Acesse-se URL com token para cadastro:",
      process.env.NEXT_PUBLIC_BASE_URL + "/signup?token=" + result.token + " | "
    )
    console.warn(
      "------------------------------------------------------------------------------------------------------------------"
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
  invite,
}: {
  invite: Invite
}): Promise<ActionResponse> {
  try {
    const result = await getInvite({ token: invite.token })

    if (!result) {
      return { success: false, message: "Token de convite inválido." }
    }

    if (result.usedAt !== null) {
      return { success: false, message: "Token de convite já foi usado." }
    }

    await updateInvite({ token: invite.token })

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
  token: Pick<Invite, "token">["token"]
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
