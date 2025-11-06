import FormIntention from "@/components/layout/form/formIntention"
import { Card, CardContent } from "@/components/ui/card"

const LandingPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-8">
      <div className="text-center pb-2">
        <h1 className="md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          Plataforma de Gestão para <br className="hidden sm:block" />
          Grupos de Networking
        </h1>
      </div>
      <Card className="mt-6">
        <CardContent>
          <FormIntention />
        </CardContent>
      </Card>
    </div>
  )
}

export default LandingPage
