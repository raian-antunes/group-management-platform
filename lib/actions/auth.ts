"use server"

import { createSession, deleteSession, verifyPassword } from "@/lib/auth"
import { getUserByEmail, createUser } from "@/lib/dal/user"
import { redirect } from "next/navigation"
import { updateInviteAction } from "./invite"
import { ActionResponse } from "@/types"
import { SignInSchema, SignUpSchema } from "../schemas/auth"
import { Invite } from "@/drizzle/schema"
import { getIntention } from "../dal/intention"

export async function signInAction(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    const validationResult = SignInSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validação falhou",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const user = await getUserByEmail(data.email)
    if (!user) {
      return {
        success: false,
        message: "Email ou senha inválidos",
        errors: {
          email: ["Email ou senha inválidos"],
        },
      }
    }

    const isPasswordValid = await verifyPassword(data.password, user.password)
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Email ou senha inválidos",
        errors: {
          password: ["Email ou senha inválidos"],
        },
      }
    }

    await createSession(user.id, user.role)

    return {
      success: true,
      message: "Login bem-sucedido",
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return {
      success: false,
      message: "Ocorreu um erro ao fazer login",
      error: "Falha ao fazer login",
    }
  }
}

export async function signUpAction(
  formData: FormData,
  invite: Invite
): Promise<ActionResponse> {
  try {
    // Extract data from form
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }

    // Validate with Zod
    const validationResult = SignUpSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validação falhou",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const existingUser = await getUserByEmail(data.email)
    if (existingUser) {
      return {
        success: false,
        message: "Usuário com este email já existe",
        errors: {
          email: ["Usuário com este email já existe"],
        },
      }
    }

    const intention = await getIntention(invite.intentionId)

    if (!intention) {
      return {
        success: false,
        message: "Intenção não encontrada",
      }
    }

    const user = await createUser({
      name: intention.name,
      email: data.email,
      password: data.password,
      company: intention.company,
    })

    if (!user) {
      return {
        success: false,
        message: "Falha ao criar usuário",
        error: "Falha ao criar usuário",
      }
    }

    const updateInviteResult = await updateInviteAction({ invite })

    if (!updateInviteResult.success) {
      return updateInviteResult
    }

    await createSession(user.id, user.role)

    return {
      success: true,
      message: "Conta criada com sucesso",
    }
  } catch (error) {
    console.error("Sign up error:", error)
    return {
      success: false,
      message: "Ocorreu um erro ao criar sua conta",
      error: "Falha ao criar conta",
    }
  }
}

export async function signOutAction(): Promise<void> {
  try {
    await deleteSession()
  } catch (error) {
    console.error("Sign out error:", error)
    throw new Error("Failed to sign out")
  } finally {
    redirect("/")
  }
}
