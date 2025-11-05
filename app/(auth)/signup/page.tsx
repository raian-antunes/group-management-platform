"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import Link from "next/link"
import FormSignUp from "@/components/layout/form/formSignUp"

const SignupPage = () => {
  return (
    <Card className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Crie uma nova conta</CardTitle>
        <CardDescription>
          Insira seu email e uma senha abaixo para criar uma nova conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormSignUp />
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Já tem uma conta?{" "}
          <Link
            href="/signin"
            className="font-medium text-gray-900 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Entre aqui
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default SignupPage
