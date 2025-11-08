import { getIntention } from "@/lib/dal/intention"
import { notFound, redirect } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { INTENTIONS_STATUS } from "@/drizzle/schema"
import { updateIntentionStatusAction } from "@/lib/actions/intention"

export default async function IntentionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const intention = await getIntention(id)

  if (!intention) {
    notFound()
  }

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    approved: "bg-green-500/20 text-green-700 dark:text-green-400",
    rejected: "bg-red-500/20 text-red-700 dark:text-red-400",
  }

  const statusLabels = {
    pending: "Pendente",
    approved: "Aprovado",
    rejected: "Rejeitado",
  }

  async function handleApprove() {
    "use server"
    await updateIntentionStatusAction({ id, status: "approved" })
    redirect("/dashboard/intentions")
  }

  async function handleReject() {
    "use server"
    await updateIntentionStatusAction({ id, status: "rejected" })
    redirect("/dashboard/intentions")
  }
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Detalhes da Intenção</CardTitle>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusColors[intention.status]
              }`}
            >
              {statusLabels[intention.status]}
            </span>
          </div>
          <CardDescription>
            Enviado em{" "}
            {new Date(intention.createdAt).toLocaleDateString("pt-BR")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={intention.name} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={intention.email} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input id="company" value={intention.company} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivation">Motivação</Label>
              <Textarea id="motivation" value={intention.motivation} disabled />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/intentions">Voltar</Link>
          </Button>
          {intention.status === INTENTIONS_STATUS.pending.value && (
            <>
              <form action={handleReject}>
                <Button type="submit" variant="destructive">
                  Reprovar
                </Button>
              </form>
              <form action={handleApprove}>
                <Button type="submit">Aprovar</Button>
              </form>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
