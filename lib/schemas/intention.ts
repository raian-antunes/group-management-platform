import { z } from "zod"

export const IntentionSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  company: z.string().optional(),
  motivation: z.string().min(1, "Motivação é obrigatória"),
})
