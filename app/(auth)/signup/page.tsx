"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import FormSignUp from "@/components/layout/form/formSignUp"
import { useSearchParams } from "next/navigation"

import useValidateToken from "@/hooks/useValidateToken"

const SignupPage = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") as string
  const { invite, isValidToken, isValidating } = useValidateToken(token)

  if (isValidating || !isValidToken) {
    return (
      <Card className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            {isValidating && <h1 className="text-2xl">Validando convite...</h1>}
            {!isValidating && !isValidToken && (
              <h1 className="text-2xl">Convite inválido</h1>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Crie uma nova conta</CardTitle>
        <CardDescription>
          Insira seu email e uma senha abaixo para criar uma nova conta
        </CardDescription>
      </CardHeader>
      <CardContent>{invite && <FormSignUp invite={invite} />}</CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}

export default SignupPage
