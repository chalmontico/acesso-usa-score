'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, ArrowRight, Check, RotateCcw } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Reveal } from '@/components/Reveal'
import { ScoreRing } from '@/components/ScoreRing'
import {
  CALENDLY_URL,
  STORAGE_KEY,
  nivelInfo,
  passos,
  pontosPorCategoria,
  riscos,
  roadmap,
  whatsappLink,
  type Answers,
} from '@/lib/diagnostico'

type Stored = { score: number; nivel: string; answers: Answers }

export default function Resultado() {
  const router = useRouter()
  const [data, setData] = useState<Stored | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        router.replace('/quiz')
        return
      }
      setData(JSON.parse(raw))
    } catch {
      router.replace('/quiz')
    }
  }, [router])

  const view = useMemo(() => {
    if (!data) return null
    const { score, nivel, answers } = data
    return {
      score,
      answers,
      info: nivelInfo(nivel),
      categorias: pontosPorCategoria(answers),
      riscos: riscos(answers),
      passos: passos(answers),
      etapas: roadmap(answers),
    }
  }, [data])

  if (!view) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-acesso-cyan/20 border-t-acesso-cyan" style={{ animation: 'spin 1s linear infinite' }} />
      </main>
    )
  }

  const { score, answers, info, categorias, riscos: listaRiscos, passos: listaPassos, etapas } = view
  const primeiroNome = (answers.nome || '').trim().split(/\s+/)[0]
  const msgWhats = `Olá! Fiz o diagnóstico do Acesso USA Score${answers.empresa ? ` (${answers.empresa})` : ''} e meu resultado foi ${score}/100 — ${info.nome}. Quero conversar sobre o plano de entrada nos EUA.`

  return (
    <main className="pb-24">
      {/* topo */}
      <div className="container-acesso flex items-center justify-between pt-6">
        <Link href="/" className="focus-ring rounded" aria-label="Voltar ao início">
          <Logo className="h-5 w-auto" priority />
        </Link>
        <Link href="/quiz" className="btn-ghost btn-sm focus-ring">
          <RotateCcw className="h-3.5 w-3.5" />
          Refazer
        </Link>
      </div>

      <div className="container-acesso mt-12 max-w-[860px]">
        {/* herói do resultado */}
        <section className="text-center">
          <span className="eyebrow anim-up">
            <span className="dot" />
            {primeiroNome ? `Diagnóstico de ${primeiroNome}` : 'Seu diagnóstico'}
            {answers.empresa ? ` · ${answers.empresa}` : ''}
          </span>

          <div className="anim-up mt-10 flex justify-center" style={{ animationDelay: '100ms' }}>
            <ScoreRing score={score} color={info.cor} size={220} stroke={12} />
          </div>

          <div className="anim-up mt-7" style={{ animationDelay: '200ms' }}>
            <span
              className="inline-flex rounded-full border px-4 py-1.5 text-[0.74rem] font-bold uppercase tracking-[0.12em]"
              style={{ color: info.cor, borderColor: `${info.cor}66`, background: `${info.cor}18` }}
            >
              {info.nome}
            </span>
            <h1 className="mx-auto mt-6 max-w-2xl font-display text-[2rem] leading-[1.05] tracking-[-0.04em] text-balance sm:text-5xl">
              <span className="t-heavy text-white">{info.titulo}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[1.02rem] leading-relaxed text-acesso-gray-300">{info.resumo}</p>
          </div>
        </section>

        {/* categorias */}
        <Reveal className="mt-16">
          <div className="card p-6 sm:p-9">
            <div className="flex items-baseline justify-between">
              <span className="section-label">Score por categoria</span>
              <span className="text-[0.78rem] text-acesso-gray-500">{score} de 100 pontos</span>
            </div>
            <div className="mt-8 space-y-6">
              {categorias.map((c) => {
                const pct = Math.round(c.pct * 100)
                const cor = pct >= 70 ? '#22C55E' : pct >= 35 ? '#3B82F6' : '#F59E0B'
                return (
                  <div key={c.key}>
                    <div className="mb-2 flex items-baseline justify-between gap-4">
                      <div>
                        <span className="text-[0.95rem] font-semibold text-white">{c.label}</span>
                        <span className="ml-2 hidden text-[0.8rem] text-acesso-gray-500 sm:inline">{c.desc}</span>
                      </div>
                      <span className="flex-none text-[0.85rem] font-bold tabular-nums" style={{ color: cor }}>
                        {c.valor}/{c.max}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                      <div
                        className="h-full rounded-full transition-[width] duration-[1400ms] ease-out"
                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${cor}99, ${cor})` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Reveal>

        {/* riscos + próximos passos */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Reveal>
            <div className="card h-full p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-400/30 bg-red-500/10 text-red-300">
                  <AlertTriangle className="h-5 w-5" strokeWidth={1.9} />
                </span>
                <h2 className="font-display text-xl font-bold tracking-tight">Principais riscos</h2>
              </div>
              {listaRiscos.length ? (
                <ul className="mt-6 space-y-3">
                  {listaRiscos.map((r) => (
                    <li key={r} className="rounded-2xl border border-red-400/15 bg-red-500/[0.05] px-4 py-3.5 text-[0.92rem] leading-relaxed text-acesso-gray-300">
                      {r}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-[0.95rem] leading-relaxed text-acesso-gray-300">
                  Nenhum risco crítico apareceu nas suas respostas. O foco agora é execução e conexões certas.
                </p>
              )}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="card h-full p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
                  <Check className="h-5 w-5" strokeWidth={2.4} />
                </span>
                <h2 className="font-display text-xl font-bold tracking-tight">Próximos passos</h2>
              </div>
              <ul className="mt-6 space-y-3">
                {listaPassos.map((p) => (
                  <li key={p} className="rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.05] px-4 py-3.5 text-[0.92rem] leading-relaxed text-acesso-gray-300">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* roadmap */}
        <Reveal className="mt-16">
          <span className="section-label">Seu roadmap de internacionalização</span>
          <h2 className="mt-4 font-display text-[2rem] leading-[1.02] tracking-[-0.04em] sm:text-5xl">
            <span className="t-light text-acesso-gray-300">4 etapas, </span>
            <span className="t-heavy text-white">do seu jeito.</span>
          </h2>
        </Reveal>

        <div className="relative mt-10">
          <div className="absolute bottom-6 left-[19px] top-6 w-px bg-gradient-to-b from-acesso-cyan/70 via-acesso-blue-600/40 to-transparent" />
          <ol className="space-y-5">
            {etapas.map((e, i) => (
              <li key={e.n} className="relative pl-14">
                <Reveal delay={i * 80}>
                  <span
                    className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border bg-black text-sm font-bold"
                    style={{ color: e.cor, borderColor: `${e.cor}88`, boxShadow: `0 0 22px ${e.cor}40` }}
                  >
                    {i + 1}
                  </span>
                  <div className="card spot p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-display text-lg font-bold tracking-tight text-white">{e.titulo}</h3>
                      <span
                        className="rounded-full border px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.1em]"
                        style={{ color: e.cor, borderColor: `${e.cor}55`, background: `${e.cor}14` }}
                      >
                        {e.status}
                      </span>
                    </div>
                    <p className="mt-2 text-[0.92rem] text-acesso-gray-300">{e.desc}</p>
                    <p className="mt-2 text-[0.88rem] leading-relaxed text-acesso-gray-500">{e.nota}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA */}
        <Reveal className="mt-20">
          <div className="glass relative overflow-hidden rounded-[36px] p-7 text-center sm:p-14">
            <div className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-acesso-cyan/[0.14] blur-[90px]" />
            <div className="relative">
              <span className="section-label">Próximo passo</span>
              <h2 className="mx-auto mt-5 max-w-xl font-display text-[2rem] leading-[1.02] tracking-[-0.04em] sm:text-5xl">
                <span className="t-light block text-acesso-gray-300">Transforme este diagnóstico</span>
                <span className="t-heavy block text-white">em um plano real.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-md text-[1rem] leading-relaxed text-acesso-gray-300">
                <strong className="font-semibold text-white">Acesso USA Roadmap</strong> — uma reunião estratégica de 45 minutos com especialistas do Acesso, a partir do seu resultado.
              </p>

              <div className="mt-8">
                <div className="text-sm text-acesso-gray-500 line-through">US$297</div>
                <div className="grad-text font-display text-[4.6rem] font-extrabold leading-none tracking-[-0.05em] sm:text-[5.4rem]">US$197</div>
                <div className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-acesso-gray-500">por empresa · sessão única</div>
              </div>

              <div className="mx-auto mt-9 flex max-w-sm flex-col gap-3">
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-light focus-ring">
                  Agendar minha reunião
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                </a>
                <a href={whatsappLink(msgWhats)} target="_blank" rel="noopener noreferrer" className="btn-ghost focus-ring">
                  Falar com o Acesso no WhatsApp
                </a>
              </div>
              <p className="mt-5 text-[0.78rem] text-acesso-gray-500">Vagas limitadas · Sem juridiquês · Orientação estratégica real</p>
            </div>
          </div>
        </Reveal>

        <p className="mt-12 text-center text-[0.74rem] leading-relaxed text-acesso-gray-500">
          Este diagnóstico é uma orientação estratégica inicial e não constitui consultoria jurídica, contábil ou migratória.
          <br />
          Para registro de marca nos EUA, estrangeiros normalmente precisam de advogado licenciado perante o USPTO.
        </p>
      </div>
    </main>
  )
}
