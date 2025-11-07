import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getIntentions } from "@/lib/dal/intention"
import { Intention, INTENTIONS_STATUS } from "@/drizzle/schema"

async function getData(): Promise<Intention[]> {
  const data = await getIntentions()

  return data.map((item) => ({
    ...item,
    status: INTENTIONS_STATUS[item.status].label as Intention["status"],
  }))
}

export default async function IntentionsPage() {
  const data = await getData()

  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold justify-center flex">
        Lista de Intenções
      </h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
