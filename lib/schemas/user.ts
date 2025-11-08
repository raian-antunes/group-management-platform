import { z } from "zod"

export const UserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.email("Endereço de email inválido").min(1, "O email é obrigatório"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter ao menos 6 caracteres"),
  company: z.string().min(1, "Empresa é obrigatória"),
})
