'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Logo } from '@/components/Logo'

const NAV = [
  { label: 'O que você recebe', href: '/#entrega' },
  { label: 'Como funciona', href: '/#como' },
  { label: 'Internacionalização', href: '/#mundo' },
  { label: 'Perguntas', href: '/#faq' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div
        className={`glass mx-auto flex max-w-[1180px] items-center justify-between rounded-full pl-5 pr-2 transition-all duration-500 ${
          scrolled ? 'h-[54px]' : 'h-[62px]'
        }`}
      >
        <a href="/" className="focus-ring shrink-0 rounded" aria-label="Acesso — início" onClick={() => setOpen(false)}>
          <Logo priority className="h-[20px] w-auto sm:h-[22px]" />
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="focus-ring whitespace-nowrap text-[13.5px] font-medium text-acesso-gray-300 transition-colors duration-300 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link href="/quiz" className="btn-light btn-sm focus-ring whitespace-nowrap">
            Fazer diagnóstico
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            className="focus-ring relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full lg:hidden"
          >
            <span className={`h-px w-5 bg-white transition-transform duration-300 ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
            <span className={`h-px w-5 bg-white transition-transform duration-300 ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="anim-in fixed inset-0 top-[80px] z-40 mx-3 flex flex-col justify-between rounded-[28px] border border-white/10 bg-acesso-black/95 px-6 pb-8 pt-6 backdrop-blur-2xl">
          <nav className="flex flex-col" aria-label="Menu">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="focus-ring border-b border-white/[0.07] py-4 text-[1.6rem] font-semibold tracking-tight text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Link href="/quiz" onClick={() => setOpen(false)} className="btn-light focus-ring w-full">
            Fazer meu diagnóstico
          </Link>
        </div>
      )}
    </header>
  )
}
