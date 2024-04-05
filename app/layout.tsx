import type { Metadata } from 'next';
import '@/app/ui/globals.css';
import { openSans } from './ui/fonts';
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: 'Dashboard - Pragmatica VR Speech and Language Therapy',
  description: 'Pragmatica VR Speech and Language Therapy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Pragmatica - Virtual Reality Speech and Language Therapy Solution</title>
      </head>
      <body className={openSans.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
