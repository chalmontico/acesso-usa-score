import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/plus-jakarta-sans'
import './globals.css'
import { LightField } from '@/components/LightField'

const title = 'Acesso USA Score — Seu diagnóstico de internacionalização'
const description =
  'Descubra em 3 minutos se sua empresa está pronta para o mercado americano: score de 0 a 100, riscos críticos, próximos passos e um roadmap de 4 etapas. Diagnóstico gratuito do Acesso.'

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL('https://acesso-usa-score.vercel.app'),
  icons: {
    icon: [{ url: '/acesso-icon-v2.png', type: 'image/png', sizes: '512x512' }],
    shortcut: '/acesso-icon-v2.png',
    apple: '/acesso-icon-v2.png',
  },
  openGraph: {
    title,
    description: 'Descubra em 3 minutos se sua empresa está pronta para os Estados Unidos.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Acesso',
  },
}

export const viewport: Viewport = {
  themeColor: '#030e26',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <LightField />
        {children}
      </body>
    </html>
  )
}
