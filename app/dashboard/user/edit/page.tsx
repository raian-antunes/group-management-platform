import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FormUser from "@/components/form/formUser"
import { getCurrentUser } from "@/lib/dal"

export default async function EditUserPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Dados do usuário</CardTitle>
      </CardHeader>
      <CardContent>
        <FormUser user={user} />
      </CardContent>
    </Card>
  )
}
