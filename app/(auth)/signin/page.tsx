"use client"

import { ActionResponse, signIn } from "@/actions/auth"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import Link from "next/link"

const initialState: ActionResponse = {
  success: false,
  message: "",
}

export default function SignInPage() {
  const router = useRouter()

  const [state, formAction, isPending] = useActionState<
    ActionResponse,
    FormData
  >(async (prevState: ActionResponse, formData: FormData) => {
    try {
      const result = await signIn(formData)

      console.log("Result:", result)

      if (result.success) {
        alert("Login efetuado com sucesso!.")
        router.push("/intention")
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
    <Card className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Entre na sua conta</CardTitle>
        <CardDescription>
          Insira seu email abaixo para entrar na sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              {state?.errors?.email && (
                <p id="email-error" className="text-sm text-red-500">
                  {state.errors.email[0]}
                </p>
              )}
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
              {state?.errors?.password && (
                <p id="password-error" className="text-sm text-red-500">
                  {state.errors.password[0]}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              Entrar
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Não tem uma conta?{" "}
          <Link
            href="/signup"
            className="font-medium text-gray-900 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Inscreva-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
