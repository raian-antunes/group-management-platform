import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Group Management Platform",
  description: "Platform for managing groups",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  )
}
