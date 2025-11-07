"use server"

import { createSession, deleteSession, verifyPassword } from "@/lib/auth"
import { z } from "zod"
import { getUserByEmail, createUser } from "@/lib/dal/user"
import { redirect } from "next/navigation"

const SignInSchema = z.object({
  email: z.email("Endereço de email inválido").min(1, "O email é obrigatório"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter ao menos 6 caracteres"),
})

const SignUpSchema = z
  .object({
    email: z
      .email("Endereço de email inválido")
      .min(1, "O email é obrigatório"),
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(6, "Senha deve ter ao menos 6 caracteres"),
    confirmPassword: z
      .string()
      .min(1, "Confirmação de senha é obrigatória")
      .min(6, "Confirmação de senha deve ter ao menos 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export type SignInData = z.infer<typeof SignInSchema>
export type SignUpData = z.infer<typeof SignUpSchema>

export type ActionResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  error?: string
}

export async function signIn(formData: FormData): Promise<ActionResponse> {
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

    await createSession(user.id)

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

export async function signUp(
  formData: FormData,
  token: string
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

    // Check if user already exists
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

    // Create new user
    const user = await createUser(data.email, data.password)
    if (!user) {
      return {
        success: false,
        message: "Falha ao criar usuário",
        error: "Falha ao criar usuário",
      }
    }

    // Create session for the newly registered user
    await createSession(user.id)

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

export async function signOut(): Promise<void> {
  try {
    await deleteSession()
  } catch (error) {
    console.error("Sign out error:", error)
    throw new Error("Failed to sign out")
  } finally {
    redirect("/")
  }
}
