"use client"

import { createIntentionAction } from "@/lib/actions/intention"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { ActionResponse } from "@/types"
import ErrorMessage from "@/components/errorMessage"

const initialState: ActionResponse = {
  success: false,
  message: "",
}

export default function FormIntention() {
  const [state, formAction, isPending] = useActionState<
    ActionResponse,
    FormData
  >(async (prevState: ActionResponse, formData: FormData) => {
    try {
      const result = await createIntentionAction(formData)

      if (result.success) {
        toast("Intenção enviada com sucesso!")
      } else {
        toast.error(
          result.message || "Ocorreu um erro. Por favor, tente novamente."
        )
      }

      return result
    } catch (error) {
      return {
        success: false,
        message:
          (error as Error).message ||
          "Ocorreu um erro. Por favor, tente novamente.",
      }
    }
  }, initialState)

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome"
            required
            disabled={isPending}
            className={state?.errors?.name ? "border-red-500" : ""}
          />
          <ErrorMessage id="name-error" message={state?.errors?.name} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="email@dominio.com"
            required
            disabled={isPending}
            className={state?.errors?.email ? "border-red-500" : ""}
          />
          <ErrorMessage id="email-error" message={state?.errors?.email} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="company">Empresa</Label>
          <Input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Nome da empresa"
            required
            disabled={isPending}
            className={state?.errors?.company ? "border-red-500" : ""}
          />
          <ErrorMessage id="company-error" message={state?.errors?.company} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="motivation">Por que você quer participar?</Label>
          <Textarea
            id="motivation"
            name="motivation"
            placeholder="Sua motivação"
            required
            disabled={isPending}
            className={state?.errors?.motivation ? "border-red-500" : ""}
          />
          <ErrorMessage
            id="motivation-error"
            message={state?.errors?.motivation}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          Quero participar
        </Button>
      </div>
    </form>
  )
}
