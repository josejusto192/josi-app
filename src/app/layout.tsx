import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Viver Bem — by Josiane Szewczuk',
  description: 'Vivendo o hoje, cultivando o melhor de mim. Bem-estar, equilíbrio e propósito com Josiane Szewczuk.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2F4A3B',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Lato:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Lato', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
