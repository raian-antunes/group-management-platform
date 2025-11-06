"use server"

import { db } from "@/drizzle/config"
import { intentions } from "@/drizzle/schema"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"

const IntentionSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  company: z.string().optional(),
  motivation: z.string().min(1, "Motivação é obrigatória"),
})

export type IntentionData = z.infer<typeof IntentionSchema>

export type ActionResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  error?: string
}

export async function createIntention(
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

    await db.insert(intentions).values({
      id: uuidv4(),
      name: data.name,
      email: data.email,
      company: data.company,
      motivation: data.motivation,
    })

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
