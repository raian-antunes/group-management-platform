"use server"

import { db } from "@/drizzle/config"
import { User, users } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { ActionResponse } from "@/types"
import { UserSchema } from "../schemas/user"

export async function updateUserAction(
  userId: Pick<User, "id">["id"],
  formData: Omit<User, "id" | "password" | "role" | "createdAt">
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
