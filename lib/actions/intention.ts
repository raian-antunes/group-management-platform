"use server"

import { Intention } from "@/drizzle/schema"
import { createInviteAction } from "./invite"
import { createIntention, updateIntentionStatus } from "../dal/intention"
import { ActionResponse } from "@/types"
import { IntentionSchema } from "../schemas/intention"

export async function createIntentionAction(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      motivation: formData.get("motivation") as string,
    }

    const validationResult = IntentionSchema.safeParse(data)

    if (!validationResult.success) {
      return {
        success: false,
        message: "Erro de validação",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const result = await createIntention({
      ...data,
    })

    if (!result) {
      return {
        success: false,
        message: "Erro ao criar intenção",
      }
    }

    return {
      success: true,
      message: "Intenção criada com sucesso",
    }
  } catch {
    return {
      success: false,
      message: "Erro ao criar intenção",
      error: "Falha ao criar intenção",
    }
  }
}

export async function updateIntentionStatusAction({
  id,
  status,
}: Pick<Intention, "id" | "status">): Promise<ActionResponse> {
  try {
    const result = await updateIntentionStatus({ id, status })

    if (!result) {
      return {
        success: false,
        message: "Erro ao atualizar status da intenção",
      }
    }

    await createInviteAction({ intentionId: result.id })

    return {
      success: true,
      message: "Status da intenção atualizado com sucesso",
    }
  } catch {
    return {
      success: false,
      message: "Erro ao atualizar status da intenção",
      error: "Falha ao atualizar status da intenção",
    }
  }
}
