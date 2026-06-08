import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Acesso USA Score – Diagnóstico Estratégico Gratuito',
  description: 'Descubra em 3 minutos se sua empresa está pronta para expandir para os Estados Unidos. Score de preparação, riscos e roadmap personalizado.',
  openGraph: {
    title: 'Acesso USA Score – Diagnóstico Estratégico Gratuito',
    description: 'Descubra em 3 minutos se sua empresa está pronta para os EUA.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
