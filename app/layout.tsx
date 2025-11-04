import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Group Management Platform",
  description: "Platform for managing groups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
