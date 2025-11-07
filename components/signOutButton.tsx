"use client"

import { useTransition } from "react"
import { signOut } from "@/lib/actions/auth"
import { Button } from "./ui/button"
import { Spinner } from "./ui/spinner"

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut()
    })
  }

  return (
    <Button
      variant="outline"
      onClick={handleSignOut}
      disabled={isPending}
      className="mb-2"
    >
      {isPending ? (
        <>
          <Spinner />
          <span>Saindo...</span>
        </>
      ) : (
        <span>Sair</span>
      )}
    </Button>
  )
}
