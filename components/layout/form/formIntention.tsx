"use client"

import { ActionResponse, createIntention } from "@/lib/actions/intention"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

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
      const result = await createIntention(formData)

      if (result.success) {
        toast("Intenção enviada com sucesso!")
        // router.refresh()
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
          {state?.errors?.name && (
            <p id="name-error" className="text-sm text-red-500">
              {state.errors.name[0]}
            </p>
          )}
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
          {state?.errors?.email && (
            <p id="email-error" className="text-sm text-red-500">
              {state.errors.email[0]}
            </p>
          )}
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
          {state?.errors?.company && (
            <p id="company-error" className="text-sm text-red-500">
              {state.errors.company[0]}
            </p>
          )}
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
          {state?.errors?.motivation && (
            <p id="motivation-error" className="text-sm text-red-500">
              {state.errors.motivation[0]}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          Quero participar
        </Button>
      </div>
    </form>
  )
}
