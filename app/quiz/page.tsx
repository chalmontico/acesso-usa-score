'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Reveal } from '@/components/Reveal'
import { DRAFT_KEY, STORAGE_KEY, calcScore, getNivel, type Answers } from '@/lib/diagnostico'
import { asset } from '@/lib/base'

type Field = { key: string; label: string; ask: string; placeholder: string; type?: string; autoComplete?: string; inputMode?: 'text' | 'email' | 'tel' }
type Question = { key: string; label: string; hint?: string; options: string[] }
type Step =
  | { id: string; short: string; title: string; subtitle: string; type: 'form'; fields: Field[] }
  | { id: string; short: string; title: string; subtitle: string; type: 'questions'; questions: Question[] }

const SIM_NAO = ['Sim', 'Não']

const STEPS: Step[] = [
  {
    id: 'dados',
    short: 'Você',
    title: 'Vamos começar por você',
    subtitle: 'Para montar o diagnóstico e te enviar o resultado.',
    type: 'form',
    fields: [
      { key: 'nome', label: 'Seu nome', ask: 'Como podemos te chamar?', placeholder: 'João Silva', autoComplete: 'name' },
      { key: 'empresa', label: 'Nome da empresa', ask: 'Qual é o nome da sua empresa?', placeholder: 'Minha Empresa Ltda', autoComplete: 'organization' },
      { key: 'email', label: 'E-mail', ask: 'Qual é o seu melhor e-mail?', placeholder: 'joao@empresa.com.br', type: 'email', autoComplete: 'email', inputMode: 'email' },
      { key: 'whatsapp', label: 'WhatsApp', ask: 'E o seu WhatsApp?', placeholder: '(11) 99999-9999', type: 'tel', autoComplete: 'tel', inputMode: 'tel' },
      { key: 'segmento', label: 'Segmento', ask: 'Em que segmento a empresa atua?', placeholder: 'Ex.: tecnologia, moda, alimentos…' },
    ],
  },
  {
    id: 'momento',
    short: 'Mercado',
    title: 'Momento e mercado',
    subtitle: 'Entenda onde você está hoje em relação ao mercado americano.',
    type: 'questions',
    questions: [
      { key: 'faturamento', label: 'Qual o faturamento anual aproximado?', options: ['Menos de R$500 mil', 'R$500 mil a R$1 milhão', 'R$1 milhão a R$5 milhões', 'R$5 milhões a R$20 milhões', 'Acima de R$20 milhões'] },
      { key: 'vende_fora', label: 'A empresa já vende fora do Brasil?', options: SIM_NAO },
      { key: 'clientes_eua', label: 'Já tem clientes nos Estados Unidos?', options: SIM_NAO },
      { key: 'produto_americanos', label: 'Seu produto ou serviço poderia ser vendido para americanos?', options: ['Sim', 'Não', 'Não sei'] },
    ],
  },
  {
    id: 'estrutura',
    short: 'Estrutura',
    title: 'Estrutura e marca',
    subtitle: 'Sua base jurídica e de proteção, no Brasil e nos EUA.',
    type: 'questions',
    questions: [
      { key: 'cnpj', label: 'A empresa possui CNPJ ativo?', options: SIM_NAO },
      { key: 'marca_brasil', label: 'A marca já é registrada no Brasil?', options: ['Sim', 'Não', 'Em andamento', 'Não sei'] },
      { key: 'marca_pesquisou_eua', label: 'Já pesquisou se a marca está disponível nos EUA?', hint: 'A busca é feita no USPTO, o escritório de marcas e patentes dos EUA.', options: SIM_NAO },
      { key: 'empresa_eua', label: 'Já possui LLC, Corporation ou outra empresa nos EUA?', options: SIM_NAO },
      { key: 'ein', label: 'Já possui EIN?', hint: 'O EIN é o número de identificação fiscal da empresa nos EUA — o “CNPJ americano”.', options: SIM_NAO },
      { key: 'conta_eua', label: 'Já possui conta bancária nos EUA?', options: SIM_NAO },
    ],
  },
  {
    id: 'comercial',
    short: 'Operação',
    title: 'Operação comercial',
    subtitle: 'Sua capacidade de entrar e operar no mercado.',
    type: 'questions',
    questions: [
      { key: 'site_profissional', label: 'A empresa tem site profissional?', options: SIM_NAO },
      { key: 'equipe_comercial', label: 'Tem equipe comercial?', options: SIM_NAO },
      { key: 'material_ingles', label: 'Tem material de vendas em inglês?', options: SIM_NAO },
      { key: 'fala_ingles', label: 'Tem alguém que fala inglês na operação?', options: SIM_NAO },
      { key: 'visitou_eua', label: 'Já visitou os EUA com objetivo de negócios?', options: SIM_NAO },
      { key: 'prazo', label: 'Em quanto tempo pretende entrar nos EUA?', options: ['0 a 3 meses', '3 a 6 meses', '6 a 12 meses', 'Mais de 12 meses', 'Só quero entender'] },
    ],
  },
]

const ANALISE = [
  'Avaliando marca e proteção…',
  'Mapeando sua estrutura jurídica…',
  'Medindo a tração internacional…',
  'Montando o seu roadmap…',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function Quiz() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [sub, setSub] = useState(0) // campo atual dentro da etapa "Você" (um por vez)
  const [answers, setAnswers] = useState<Answers>({})
  const [invalid, setInvalid] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [analise, setAnalise] = useState(0)
  const topRef = useRef<HTMLDivElement>(null)

  const cur = STEPS[step]
  const total = STEPS.length

  // total de perguntas para a barra de progresso geral
  const totalCampos = useMemo(
    () => STEPS.reduce((n, s) => n + (s.type === 'form' ? s.fields.length : s.questions.length), 0),
    []
  )
  const respondidos = useMemo(
    () => Object.values(answers).filter((v) => v && String(v).trim() !== '').length,
    [answers]
  )
  const progresso = Math.min(100, Math.round((respondidos / totalCampos) * 100))

  // restaura rascunho (se a pessoa recarregar a página)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const d = JSON.parse(raw)
      if (d && typeof d === 'object') {
        setAnswers(d.answers || {})
        setStep(Math.min(Math.max(Number(d.step) || 0, 0), STEPS.length - 1))
        setSub(Math.max(Number(d.sub) || 0, 0))
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ answers, step, sub }))
    } catch {}
  }, [answers, step, sub])

  function setAns(key: string, val: string) {
    setAnswers((a) => ({ ...a, [key]: val }))
    setInvalid((i) => i.filter((k) => k !== key))
    setMessage('')
  }

  function chooseOption(q: Question, qi: number, val: string) {
    setAns(q.key, val)
    // leva a pessoa para a próxima pergunta ainda sem resposta
    if (cur.type !== 'questions') return
    const next = cur.questions.slice(qi + 1).find((x) => !answers[x.key])
    if (next) {
      setTimeout(() => {
        document.getElementById(`q-${next.key}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 220)
    }
  }

  function validate(): boolean {
    const bad: string[] = []
    if (cur.type === 'form') {
      for (const f of [cur.fields[Math.min(sub, cur.fields.length - 1)]]) {
        const v = (answers[f.key] || '').trim()
        if (!v) bad.push(f.key)
        else if (f.key === 'email' && !EMAIL_RE.test(v)) bad.push(f.key)
      }
    } else {
      for (const q of cur.questions) if (!answers[q.key]) bad.push(q.key)
    }
    setInvalid(bad)
    if (bad.length) {
      const emailOnly = bad.length === 1 && bad[0] === 'email' && (answers.email || '').trim()
      setMessage(
        emailOnly
          ? 'Confira o e-mail: parece que falta alguma parte.'
          : cur.type === 'form'
          ? 'Preencha este campo para continuar.'
          : 'Responda todas as perguntas para continuar.'
      )
      setTimeout(() => {
        const el = document.getElementById(`q-${bad[0]}`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 60)
      return false
    }
    setMessage('')
    return true
  }

  function goTo(n: number, subIdx = 0) {
    setStep(n)
    setSub(subIdx)
    setInvalid([])
    setMessage('')
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30)
  }

  async function enviar() {
    setLoading(true)
    const clean: Answers = {}
    Object.entries(answers).forEach(([k, v]) => (clean[k] = String(v).trim()))
    const score = calcScore(clean)
    const nivel = getNivel(score)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ score, nivel, answers: clean }))
    } catch {}

    // mensagens da análise (o mínimo de ~2,6s dá tempo de ler e cria expectativa)
    let i = 0
    const t = setInterval(() => {
      i = Math.min(i + 1, ANALISE.length - 1)
      setAnalise(i)
    }, 650)

    const salvar = async () => {
      const res = await fetch(asset('/api/leads'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, nivel, answers: clean }),
      })
      if (!res.ok) throw new Error('falha ao salvar')
    }
    const salvando = salvar().catch(() => salvar().catch(() => {}))

    await Promise.all([salvando, new Promise((r) => setTimeout(r, 2600))])
    clearInterval(t)
    try {
      sessionStorage.removeItem(DRAFT_KEY)
    } catch {}
    router.push('/resultado')
  }

  async function continuar() {
    if (!validate()) return
    if (cur.type === 'form' && sub < cur.fields.length - 1) {
      setSub(sub + 1)
      setMessage('')
      return
    }
    if (step < total - 1) goTo(step + 1)
    else await enviar()
  }

  function voltar() {
    if (cur.type === 'form' && sub > 0) {
      setSub(sub - 1)
      setInvalid([])
      setMessage('')
      return
    }
    const prev = STEPS[step - 1]
    goTo(step - 1, prev && prev.type === 'form' ? prev.fields.length - 1 : 0)
  }

  // ───────── tela de análise ─────────
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="relative h-28 w-28">
          <div className="absolute inset-0 rounded-full border border-acesso-cyan/15" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-acesso-cyan" style={{ animation: 'spin 1.1s linear infinite' }} />
          <div className="absolute inset-4 rounded-full border-2 border-transparent border-b-acesso-blue-600" style={{ animation: 'spin 1.8s linear infinite reverse' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Logo className="h-4 w-auto opacity-90" />
          </div>
        </div>
        <h1 className="mt-10 font-display text-3xl tracking-[-0.03em] sm:text-4xl">
          <span className="t-light text-acesso-gray-300">Analisando </span>
          <span className="t-heavy text-white">sua empresa</span>
        </h1>
        <p key={analise} className="anim-in mt-4 h-6 text-[0.95rem] text-acesso-cyan">
          {ANALISE[analise]}
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-36">
      {/* topo */}
      <div className="container-acesso flex items-center justify-between pt-6">
        <Link href="/" className="focus-ring rounded" aria-label="Voltar ao início">
          <Logo className="h-5 w-auto" priority />
        </Link>
        <span className="text-[0.78rem] font-semibold text-acesso-gray-500">{progresso}% concluído</span>
      </div>

      <div ref={topRef} className="container-acesso mt-8 max-w-[680px] scroll-mt-4">
        {/* stepper */}
        <ol className="flex items-center gap-2" aria-label="Etapas">
          {STEPS.map((s, i) => {
            const done = i < step
            const active = i === step
            return (
              <li key={s.id} className="flex flex-1 flex-col gap-2">
                <div className="h-[3px] overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-acesso-blue-600 to-acesso-cyan transition-all duration-700"
                    style={{ width: done ? '100%' : active ? (s.type === 'form' ? `${Math.round(((sub + 1) / s.fields.length) * 100)}%` : '55%') : '0%' }}
                  />
                </div>
                <span className={`text-[0.66rem] font-bold uppercase tracking-[0.14em] ${active ? 'text-acesso-cyan' : done ? 'text-acesso-gray-300' : 'text-acesso-gray-700'}`}>
                  {s.short}
                </span>
              </li>
            )
          })}
        </ol>

        {/* cartão da etapa */}
        <div key={cur.id} className="anim-up mt-8">
          <span className="section-label">
            Etapa {step + 1} de {total}
          </span>
          <h1 className="mt-3 font-display text-[2.2rem] leading-[1.02] tracking-[-0.04em] sm:text-5xl">
            <span className="t-heavy text-white">{cur.title}</span>
          </h1>
          <p className="mt-3 text-[1rem] leading-relaxed text-acesso-gray-300">{cur.subtitle}</p>

          <div className="card mt-8 p-5 sm:p-8">
            {cur.type === 'form' &&
              (() => {
                const f = cur.fields[Math.min(sub, cur.fields.length - 1)]
                return (
                  <div key={f.key} id={`q-${f.key}`} className="anim-up">
                    <span className="text-[0.7rem] font-bold tracking-[0.14em] text-acesso-cyan">
                      {String(sub + 1).padStart(2, '0')} / {String(cur.fields.length).padStart(2, '0')}
                    </span>
                    <label htmlFor={f.key} className="mt-3 block font-display text-[1.65rem] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-[2rem]">
                      {f.ask}
                    </label>
                    <input
                      id={f.key}
                      name={f.key}
                      autoFocus
                      enterKeyHint={sub === cur.fields.length - 1 ? 'done' : 'next'}
                      className={`field mt-6 !py-4 !text-[1.1rem] ${invalid.includes(f.key) ? 'invalid' : ''}`}
                      type={f.type || 'text'}
                      inputMode={f.inputMode}
                      autoComplete={f.autoComplete}
                      placeholder={f.placeholder}
                      value={answers[f.key] || ''}
                      onChange={(e) => setAns(f.key, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          continuar()
                        }
                      }}
                    />
                  </div>
                )
              })()}

            {cur.type === 'questions' &&
              cur.questions.map((q, qi) => {
                const bad = invalid.includes(q.key)
                const compact = q.options.length <= 3
                return (
                  <fieldset
                    key={q.key}
                    id={`q-${q.key}`}
                    className={`mb-9 scroll-mt-24 border-0 p-0 last:mb-0 ${bad ? 'rounded-2xl ring-1 ring-red-400/50 ring-offset-8 ring-offset-transparent' : ''}`}
                  >
                    <legend className="mb-4 text-[1rem] font-semibold leading-snug text-white">
                      <span className="mr-2 text-[0.7rem] font-bold tracking-[0.12em] text-acesso-cyan">{String(qi + 1).padStart(2, '0')}</span>
                      {q.label}
                    </legend>
                    {q.hint && <p className="-mt-2 mb-4 text-[0.82rem] leading-relaxed text-acesso-gray-500">{q.hint}</p>}
                    <div className={compact ? 'grid grid-cols-2 gap-2.5 sm:grid-cols-3' : 'grid gap-2.5'}>
                      {q.options.map((opt) => {
                        const sel = answers[q.key] === opt
                        return (
                          <button
                            key={opt}
                            type="button"
                            role="radio"
                            aria-checked={sel}
                            onClick={() => chooseOption(q, qi, opt)}
                            className={`opt focus-ring ${sel ? 'sel' : ''}`}
                          >
                            <span className="radio">{sel && <Check className="h-3 w-3 text-[#031018]" strokeWidth={3.5} />}</span>
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>
                )
              })}
          </div>

          {message && (
            <div role="alert" className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/[0.08] px-4 py-3 text-[0.88rem] text-red-200">
              {message}
            </div>
          )}

          <Reveal>
            <p className="mt-6 text-center text-[0.76rem] leading-relaxed text-acesso-gray-500">
              Suas informações são confidenciais e usadas apenas para gerar o seu diagnóstico.
            </p>
          </Reveal>
        </div>
      </div>

      {/* barra de navegação fixa */}
      <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="glass mx-auto flex max-w-[680px] items-center justify-between gap-3 rounded-full p-2">
          {step > 0 || sub > 0 ? (
            <button type="button" onClick={voltar} className="btn-ghost btn-sm focus-ring !px-5">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
          ) : (
            <Link href="/" className="btn-ghost btn-sm focus-ring !px-5">
              <ArrowLeft className="h-4 w-4" />
              Início
            </Link>
          )}
          <button type="button" onClick={continuar} className="btn-light focus-ring !px-6">
            {step === total - 1 ? 'Ver meu diagnóstico' : 'Continuar'}
            <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </main>
  )
}
