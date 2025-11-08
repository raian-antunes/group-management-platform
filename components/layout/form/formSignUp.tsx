"use client"

import { signUpAction } from "@/lib/actions/auth"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { toast } from "sonner"
import { ActionResponse } from "@/types"
import ErrorMessage from "@/components/errorMessage"
import { Invite } from "@/drizzle/schema"

const initialState: ActionResponse = {
  success: false,
  message: "",
}

export default function FormSignUp({ invite }: { invite: Invite }) {
  const router = useRouter()

  const [state, formAction, isPending] = useActionState<
    ActionResponse,
    FormData
  >(async (prevState: ActionResponse, formData: FormData) => {
    try {
      const result = await signUpAction(formData, invite)

      if (result.success) {
        toast("Conta criada com sucesso! Por favor, faça login.")
        router.push("/")
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
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            disabled={isPending}
            className={state?.errors?.password ? "border-red-500" : ""}
          />
          <ErrorMessage id="password-error" message={state?.errors?.password} />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
          </div>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="confirmPassword"
            disabled={isPending}
            required
            className={state?.errors?.confirmPassword ? "border-red-500" : ""}
          />
          <ErrorMessage
            id="confirm-password-error"
            message={state?.errors?.confirmPassword}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          Criar conta
        </Button>
      </div>
    </form>
  )
}
