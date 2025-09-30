// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css'

import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core'

export const metadata: Metadata = {
  title: 'Math Practice App',
  description: '小学生向けの算数練習アプリ',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
        <Analytics />
      </body>
    </html>
  )
}
