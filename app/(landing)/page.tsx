import { Button } from "@/components/ui/button"
import Link from "next/link"

const LandingPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Plataforma de Gestão para <br className="hidden sm:block" />
          Grupos de Networking
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          Centralize sua rede, maximize suas oportunidades.
        </p>
        <div className="mt-10">
          <Link href="/signup">
            <Button>Comece agora</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
