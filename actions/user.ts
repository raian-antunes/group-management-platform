"use server"

import { z } from "zod"
import { db } from "@/drizzle/config"
import { users } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

const UserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.email("Endereço de email inválido").min(1, "O email é obrigatório"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter ao menos 6 caracteres"),
  company: z.string().min(1, "Empresa é obrigatória"),
})

export type UserData = z.infer<typeof UserSchema>

export type ActionResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  error?: string
}

export async function updateUser(
  userId: string,
  formData: Partial<UserData>
): Promise<ActionResponse> {
  try {
    const UpdateIssueSchema = UserSchema.partial()
    const validationResult = UpdateIssueSchema.safeParse(formData)

    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Type safe update object with validated data
    const validatedData = validationResult.data
    const updateData: Record<string, unknown> = {}

    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.email !== undefined)
      updateData.email = validatedData.email
    if (validatedData.password !== undefined)
      updateData.password = validatedData.password
    if (validatedData.company !== undefined)
      updateData.company = validatedData.company

    // Update user
    await db.update(users).set(updateData).where(eq(users.id, userId))

    return { success: true, message: "Usuário atualizado com sucesso" }
  } catch (error) {
    return {
      success: false,
      message:
        (error as Error).message ||
        "Ocorreu um erro. Por favor, tente novamente.",
    }
  }
}
