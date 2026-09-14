import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OT Tracker',
  description: 'Track your overtime hours',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body className="min-h-screen min-h-dvh antialiased overflow-x-hidden">{children}</body>
    </html>
  )
}