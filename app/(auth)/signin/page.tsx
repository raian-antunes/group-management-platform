"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import FormSignIn from "@/components/layout/form/formSignIn"

export default function SignInPage() {
  return (
    <Card className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Entre na sua conta</CardTitle>
        <CardDescription>
          Insira seu email abaixo para entrar na sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormSignIn />
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Não tem uma conta?{" "}
          <Link
            href="/"
            className="font-medium text-gray-900 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Envie uma intenção e avaliaremos
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
