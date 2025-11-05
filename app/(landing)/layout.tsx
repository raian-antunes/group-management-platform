import { Button } from "@/components/ui/button"
import Link from "next/link"

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 dark:border-dark-border-subtle">
        <div className="flex flex-auto justify-end space-x-4 p-4">
          <Link href="/signin">
            <Button>Entrar</Button>
          </Link>
          <Link href="/signup">
            <Button>Inscrever-se</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-200 dark:border-dark-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2025 Mode. Built for Next.js Fundamentals.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
export default LandingLayout
