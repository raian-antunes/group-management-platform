import { Suspense } from "react"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#121212]">
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  )
}
export default AuthLayout
