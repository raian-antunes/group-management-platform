import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getAnnouncements } from "@/lib/dal/announcement"

export default async function AnnouncementPage() {
  const items = await getAnnouncements()

  console.log(items)

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="mb-6 text-4xl font-bold justify-center flex">
        Avisos e Comunicados
      </h1>

      <div className="flex flex-col gap-4 mb-8">
        {items.data.map((item, index) => (
          <Card key={item.id} className="w-full max-w">
            <CardHeader>
              <CardTitle>Aviso {index + 1}</CardTitle>
              <CardDescription>
                <div>
                  Autor: {item.user.name} - Data da postagem:{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>{" "}
              </CardDescription>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>{item.message}</CardContent>
            <CardFooter />
          </Card>
        ))}
      </div>
    </div>
  )
}
