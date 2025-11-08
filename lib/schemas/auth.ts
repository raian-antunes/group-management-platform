import { z } from "zod"

export const SignInSchema = z.object({
  email: z.email("Endereço de email inválido").min(1, "O email é obrigatório"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter ao menos 6 caracteres"),
})

export const SignUpSchema = z
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
