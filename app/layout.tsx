import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import './global-styles.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          {children}
        </MantineProvider>
        <Analytics />
      </body>
    </html>
  )
}
