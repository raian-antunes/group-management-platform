"use client"

import { ActionResponse, updateUser } from "@/actions/user"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { toast } from "sonner"
import { User } from "@/drizzle/schema"

const initialState: ActionResponse = {
  success: false,
  message: "",
}

export default function FormUser({ user }: { user: User }) {
  const router = useRouter()

  const [state, formAction, isPending] = useActionState<
    ActionResponse,
    FormData
  >(async (prevState: ActionResponse, formData: FormData) => {
    try {
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        company: formData.get("company") as string,
      }

      const result = await updateUser(user.id, data)

      if (result.success) {
        toast("Dados atualizados com sucesso!")
        router.refresh()
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
          <Label htmlFor="id">ID</Label>
          <Input
            id="id"
            name="id"
            type="text"
            defaultValue={user.id}
            required
            disabled
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome"
            defaultValue={user.name}
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
            defaultValue={user.email}
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
          <Label htmlFor="company">Companhia</Label>
          <Input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Nome da companhia"
            defaultValue={user.company}
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
        <Button type="submit" className="w-full" disabled={isPending}>
          Editar dados
        </Button>
      </div>
    </form>
  )
}
