"use client"

import { updateUserAction } from "@/lib/actions/user"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { toast } from "sonner"
import { User } from "@/drizzle/schema"
import { ActionResponse } from "@/types"
import ErrorMessage from "@/components/errorMessage"

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

      const result = await updateUserAction(user.id, data)

      if (result.success) {
        toast("Dados atualizados com sucesso!")
        router.refresh()
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
            defaultValue={user.email}
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
            defaultValue={user.company || ""}
            required
            disabled={isPending}
            className={state?.errors?.company ? "border-red-500" : ""}
          />
          <ErrorMessage id="company-error" message={state?.errors?.company} />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          Editar dados
        </Button>
      </div>
    </form>
  )
}
