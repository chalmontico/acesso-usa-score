import Link from 'next/link'
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Compass,
  Gauge,
  Landmark,
  ListChecks,
  Route,
  ShieldAlert,
  Wallet,
} from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'
import { ScoreRing } from '@/components/ScoreRing'
import { WorldMap } from '@/components/WorldMap'
import { Faq, type FaqItem } from '@/components/Faq'
import { CALENDLY_URL, whatsappLink } from '@/lib/diagnostico'
import { asset } from '@/lib/base'

const STATS = [
  { value: '28', label: 'anos de experiência em negócios' },
  { value: '300+', label: 'empresas atendidas nos EUA' },
  { value: '6', label: 'países com presença Acesso' },
  { value: '3', label: 'minutos para o seu score' },
]

const RISKS = [
  { icon: ShieldAlert, title: 'Marca registrada por outra empresa', text: 'Nos EUA, alguém pode ter chegado antes de você ao registro da sua marca.' },
  { icon: Landmark, title: 'Estrutura inadequada ao modelo', text: 'A empresa certa para o seu negócio nem sempre é a primeira que vem à cabeça.' },
  { icon: Wallet, title: 'Investir antes de validar', text: 'Abrir operação sem validar produto e mercado é o jeito mais caro de aprender.' },
  { icon: Compass, title: 'Estratégia que não fala americano', text: 'Oferta, preço e abordagem precisam ser adaptados à cultura e ao público local.' },
]

const FLOW = [
  { n: '01', title: 'Dados da empresa', text: 'Quem você é, o segmento e como falar com você.' },
  { n: '02', title: 'Momento e mercado', text: 'Faturamento, vendas fora do Brasil e potencial nos EUA.' },
  { n: '03', title: 'Estrutura e marca', text: 'CNPJ, registro de marca, LLC, EIN e conta bancária.' },
  { n: '04', title: 'Operação comercial', text: 'Site, equipe, inglês e o seu prazo de entrada.' },
  { n: '05', title: 'Seu diagnóstico', text: 'Score, riscos, próximos passos e roadmap na hora.' },
]

const PATH = [
  { title: 'Diagnóstico e planejamento', short: 'Entendemos o negócio e definimos objetivos e prioridades.' },
  { title: 'Estruturação', short: 'Empresa, contabilidade, documentos e análise da marca.' },
  { title: 'Preparação para funcionar', short: 'Licenças, autorizações e recursos da operação.' },
  { title: 'Inserção e acompanhamento', short: 'Conexões comerciais, adaptação e orientação estratégica.' },
]

const ECOSYSTEM = ['Internacionalização', 'Acesso Club', 'Acesso Black', 'Eventos', 'Acesso OS']

const ROW_A = ['galeria-01', 'galeria-02', 'galeria-06', 'evento', 'aviao', 'galeria-01']
const ROW_B = ['galeria-03', 'galeria-04', 'galeria-05', 'galeria-08', 'galeria-10', 'black']

const FAQ: FaqItem[] = [
  { q: 'O diagnóstico é realmente gratuito?', a: 'Sim, 100% gratuito e sem compromisso. Em cerca de 3 minutos você recebe o score completo, a análise por categoria, os riscos identificados, os próximos passos e o roadmap da sua entrada.' },
  { q: 'Ele serve só para os Estados Unidos?', a: 'O score avalia a prontidão para o mercado americano, onde fica a matriz do Acesso, em Orlando. O Acesso também atua em Portugal, Paraguai, Dubai e China — se o seu interesse for outro destino, é só falar com a gente.' },
  { q: 'Isso substitui uma consultoria jurídica?', a: 'Não. O Acesso USA Score é uma orientação estratégica inicial. Para questões jurídicas, contábeis ou migratórias, recomendamos profissionais licenciados.' },
  { q: 'Preciso ter empresa aberta nos EUA para participar?', a: 'Não. O diagnóstico avalia exatamente onde você está hoje, com ou sem estrutura americana.' },
  { q: 'Abrir empresa nos EUA é obrigatório para registrar marca?', a: 'Não. Abrir empresa nos EUA pode fazer sentido como parte de uma estratégia mais forte, mas não é um requisito para registrar uma marca.' },
  { q: 'O que acontece depois do diagnóstico?', a: 'Você recebe o resultado na hora. Se quiser aprofundar, oferecemos o Acesso USA Roadmap: uma reunião estratégica de 45 minutos para transformar o diagnóstico em um plano sob medida.' },
]

function Photo({ name, tall }: { name: string; tall?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset(`/images/${name}.jpg`)}
      alt="Momentos da comunidade Acesso"
      loading="lazy"
      decoding="async"
      className={`${tall ? 'h-[300px] sm:h-[360px]' : 'h-[210px] sm:h-[260px]'} w-auto flex-none rounded-[22px] border border-white/10 object-cover`}
    />
  )
}

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* ───────────── HERO ───────────── */}
        <section className="relative overflow-hidden pb-16 pt-[118px] sm:pt-[150px] lg:pb-24">
          <div className="pointer-events-none absolute -right-[10%] top-[8%] h-[520px] w-[520px] rounded-full bg-[#1e6fff]/[0.16] blur-[120px]" />
          <div className="container-acesso relative grid items-center gap-14 lg:grid-cols-[1.12fr_0.88fr]">
            <div>
              <span className="eyebrow anim-up">
                <span className="dot" />
                Diagnóstico de internacionalização · 3 minutos · gratuito
              </span>

              <h1 className="anim-up mt-7 font-display text-[12.4vw] leading-[0.96] tracking-[-0.045em] sm:text-[5rem] lg:text-[4.6rem] xl:text-[5.2rem]" style={{ animationDelay: '80ms' }}>
                <span className="t-light block text-acesso-gray-300">Sua empresa está pronta</span>
                <span className="t-heavy block text-white">para os Estados Unidos?</span>
              </h1>

              <p className="anim-up mt-7 max-w-xl text-balance text-[1.05rem] leading-relaxed text-acesso-gray-300 sm:text-lg" style={{ animationDelay: '170ms' }}>
                Descubra o seu score de internacionalização, os riscos que quase ninguém conta e o caminho para entrar no maior mercado do mundo — com quem já abriu essa porta para mais de 300 empresas.
              </p>

              <div className="anim-up mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '260ms' }}>
                <Link href="/quiz" className="btn-light focus-ring">
                  Fazer meu diagnóstico
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                </Link>
                <a href="#como" className="btn-ghost focus-ring">
                  Como funciona
                </a>
              </div>

              <p className="anim-up mt-6 text-[0.8rem] text-acesso-gray-500" style={{ animationDelay: '340ms' }}>
                Resultado imediato · 100% gratuito · leva cerca de 3 minutos
              </p>
            </div>

            {/* sample result card */}
            <div className="anim-up relative mx-auto w-full max-w-[470px]" style={{ animationDelay: '220ms' }}>
              <div className="glass float-y rounded-[34px] p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="section-label">Seu diagnóstico</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.68rem] font-semibold text-acesso-gray-300">
                    Exemplo
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-6">
                  <ScoreRing score={82} color="#22C55E" size={132} stroke={9} />
                  <div>
                    <span className="inline-flex rounded-full border border-[#22C55E]/40 bg-[#22C55E]/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-[#22C55E]">
                      Pronto para Expandir
                    </span>
                    <p className="mt-3 text-sm leading-snug text-acesso-gray-300">Base sólida. Hora de transformar prontidão em plano.</p>
                  </div>
                </div>

                <div className="mt-7 space-y-4">
                  {[
                    ['Marca e proteção', 90],
                    ['Estrutura jurídica', 72],
                    ['Operação comercial', 81],
                  ].map(([label, pct]) => (
                    <div key={label as string}>
                      <div className="mb-1.5 flex justify-between text-[0.78rem]">
                        <span className="text-acesso-gray-300">{label}</span>
                        <span className="font-semibold text-white">{pct}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                        <div className="h-full rounded-full bg-gradient-to-r from-acesso-blue-600 to-acesso-cyan" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* floating route chip */}
              <div className="glass absolute -bottom-5 -left-2 flex items-center gap-2 rounded-full py-2 pl-2 pr-4 sm:-left-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/flags/br.svg")} alt="" className="h-7 w-7 rounded-full object-cover" />
                <ArrowRight className="h-4 w-4 text-acesso-cyan" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/flags/us.svg")} alt="" className="h-7 w-7 rounded-full object-cover" />
                <span className="ml-1 text-[0.78rem] font-semibold text-white">Brasil → EUA</span>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────── STATS ───────────── */}
        <section className="container-acesso">
          <Reveal>
            <div className="glass grid grid-cols-2 gap-y-8 rounded-[30px] px-6 py-8 md:grid-cols-4 md:px-10">
              {STATS.map((s) => (
                <div key={s.label} className="text-center md:text-left">
                  <div className="font-display text-[2.6rem] font-extrabold leading-none tracking-[-0.04em] text-white sm:text-5xl">{s.value}</div>
                  <div className="mx-auto mt-2 max-w-[150px] text-[0.8rem] leading-snug text-acesso-gray-500 md:mx-0">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ───────────── PROBLEMA ───────────── */}
        <section className="py-24 sm:py-32">
          <div className="container-acesso grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
            <Reveal>
              <h2 className="font-display text-[9.6vw] leading-[1] tracking-[-0.04em] sm:text-6xl lg:text-[3.6rem]">
                <span className="t-light block text-acesso-gray-300">Muitos querem entrar nos EUA.</span>
                <span className="t-heavy block text-white">Poucos sabem por onde começar.</span>
              </h2>
              <p className="mt-7 max-w-md text-[1.02rem] leading-relaxed text-acesso-gray-300">
                Internacionalizar é construir as condições para atuar e crescer lá fora: entender o mercado, definir a estrutura certa, proteger a marca e criar os relacionamentos que sustentam a operação. O primeiro passo é saber exatamente onde você está.
              </p>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {RISKS.map((r, i) => (
                <Reveal key={r.title} delay={i * 80}>
                  <div className="card spot h-full p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-acesso-cyan/25 bg-acesso-cyan/[0.08] text-acesso-cyan">
                      <r.icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-white">{r.title}</h3>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-acesso-gray-500">{r.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── O QUE VOCÊ RECEBE ───────────── */}
        <section id="entrega" className="scroll-mt-24 pb-24 sm:pb-32">
          <div className="container-acesso">
            <Reveal className="max-w-3xl">
              <span className="section-label">O que o diagnóstico entrega</span>
              <h2 className="mt-5 font-display text-[10vw] leading-[1] tracking-[-0.04em] sm:text-6xl lg:text-[3.8rem]">
                <span className="t-light text-acesso-gray-300">Em 3 minutos, </span>
                <span className="t-heavy text-white">um mapa completo da sua prontidão.</span>
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-4 md:grid-cols-6">
              <Reveal className="md:col-span-3">
                <div className="card spot h-full p-7">
                  <Gauge className="h-6 w-6 text-acesso-cyan" strokeWidth={1.8} />
                  <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">Score de 0 a 100</h3>
                  <p className="mt-2 max-w-sm text-[0.95rem] leading-relaxed text-acesso-gray-500">
                    Avaliação em 6 dimensões, com pontuação por categoria e um nível claro de preparação.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {[
                      ['Pronto para Expandir', '#22C55E'],
                      ['Em Desenvolvimento', '#3B82F6'],
                      ['Iniciando Jornada', '#F59E0B'],
                      ['Precisa Estruturar', '#EF4444'],
                    ].map(([n, c]) => (
                      <span key={n} className="rounded-full border px-3 py-1 text-[0.7rem] font-semibold" style={{ color: c, borderColor: `${c}55`, background: `${c}14` }}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={80} className="md:col-span-3">
                <div className="card spot h-full p-7">
                  <ShieldAlert className="h-6 w-6 text-acesso-cyan" strokeWidth={1.8} />
                  <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">Riscos críticos</h3>
                  <p className="mt-2 max-w-sm text-[0.95rem] leading-relaxed text-acesso-gray-500">
                    Os pontos que mais pesam antes de entrar no mercado americano, identificados a partir das suas respostas.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={40} className="md:col-span-2">
                <div className="card spot h-full p-7">
                  <ListChecks className="h-6 w-6 text-acesso-cyan" strokeWidth={1.8} />
                  <h3 className="mt-5 font-display text-xl font-bold tracking-tight">Próximos passos</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-acesso-gray-500">Ações concretas e priorizadas para o seu momento atual.</p>
                </div>
              </Reveal>

              <Reveal delay={120} className="md:col-span-2">
                <div className="card spot h-full p-7">
                  <Route className="h-6 w-6 text-acesso-cyan" strokeWidth={1.8} />
                  <h3 className="mt-5 font-display text-xl font-bold tracking-tight">Roadmap em 4 etapas</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-acesso-gray-500">O caminho de entrada, com o status de cada etapa para a sua empresa.</p>
                </div>
              </Reveal>

              <Reveal delay={200} className="md:col-span-2">
                <div className="card spot h-full p-7">
                  <CalendarCheck className="h-6 w-6 text-acesso-cyan" strokeWidth={1.8} />
                  <h3 className="mt-5 font-display text-xl font-bold tracking-tight">Reunião estratégica</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-acesso-gray-500">Convite opcional para aprofundar o plano com especialistas.</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ───────────── COMO FUNCIONA ───────────── */}
        <section id="como" className="scroll-mt-24 border-y border-white/[0.06] bg-black/40 py-24 sm:py-32">
          <div className="container-acesso">
            <Reveal className="max-w-3xl">
              <span className="section-label">Como funciona</span>
              <h2 className="mt-5 font-display text-[10vw] leading-[1] tracking-[-0.04em] sm:text-6xl lg:text-[3.8rem]">
                <span className="t-light text-acesso-gray-300">Simples. Rápido. </span>
                <span className="t-heavy text-white">Estrategicamente relevante.</span>
              </h2>
            </Reveal>

            <div className="relative mt-16">
              <div className="absolute bottom-2 left-[19px] top-2 w-px bg-gradient-to-b from-acesso-cyan/70 via-acesso-blue-600/40 to-transparent lg:bottom-auto lg:left-0 lg:right-0 lg:top-[19px] lg:h-px lg:w-auto lg:bg-gradient-to-r" />
              <ol className="grid gap-10 lg:grid-cols-5 lg:gap-6">
                {FLOW.map((s, i) => (
                  <li key={s.n} className="relative pl-14 lg:pl-0 lg:pt-14">
                    <Reveal delay={i * 90}>
                      <span
                        className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border bg-black text-sm font-bold ${
                          i === FLOW.length - 1
                            ? 'border-acesso-cyan bg-acesso-cyan text-[#031018] shadow-[0_0_28px_rgba(53,208,255,0.55)]'
                            : 'border-acesso-cyan/60 text-acesso-cyan shadow-[0_0_24px_rgba(53,208,255,0.25)]'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <h3 className="font-display text-lg font-bold tracking-tight text-white">{s.title}</h3>
                      <p className="mt-2 max-w-[250px] text-[0.92rem] leading-relaxed text-acesso-gray-500">{s.text}</p>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>

            <Reveal className="mt-14">
              <Link href="/quiz" className="btn-light focus-ring">
                Começar agora
                <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ───────────── MUNDO ───────────── */}
        <section id="mundo" className="relative scroll-mt-24 py-24 sm:py-32">
          <div className="container-acesso flex flex-col items-center text-center">
            <Reveal>
              <h2 className="max-w-4xl font-display text-[11vw] leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-[4.6rem]">
                <span className="t-light block text-acesso-gray-300">O mundo pode ser o próximo mercado</span>
                <span className="t-heavy block text-white">da sua empresa.</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-8 max-w-2xl text-balance text-[1.05rem] leading-relaxed text-acesso-gray-300 sm:text-lg">
                O Acesso conecta empresários, empresas e oportunidades entre Brasil, Estados Unidos, Portugal, Paraguai, Dubai e China. A matriz fica em Orlando, no coração do mercado que você quer acessar.
              </p>
            </Reveal>

            <Reveal delay={160} className="w-full">
              <div className="relative -mx-5 mt-14 overflow-hidden border-y border-white/[0.08] bg-[#02050c] shadow-[0_30px_90px_rgba(0,0,0,0.6)] sm:mx-auto sm:max-w-[1180px] sm:rounded-[36px] sm:border">
                <div className="overflow-x-auto [scrollbar-width:none] sm:overflow-visible [&::-webkit-scrollbar]:hidden">
                  <div className="relative aspect-[1600/745] w-[820px] max-w-none overflow-hidden sm:w-full">
                    <WorldMap className="h-full w-full" />
                  </div>
                </div>
              </div>
            </Reveal>

            {/* the path */}
            <div className="relative mt-20 w-full max-w-[1180px] text-left">
              <div className="absolute bottom-2 left-[19px] top-2 w-px bg-gradient-to-b from-acesso-cyan/70 via-acesso-blue-600/40 to-transparent lg:bottom-auto lg:left-0 lg:right-0 lg:top-[19px] lg:h-px lg:w-auto lg:bg-gradient-to-r" />
              <ol className="grid gap-10 lg:grid-cols-4 lg:gap-8">
                {PATH.map((step, i) => (
                  <li key={step.title} className="relative pl-14 lg:pl-0 lg:pt-14">
                    <Reveal delay={i * 100}>
                      <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-acesso-cyan/60 bg-black text-sm font-bold text-acesso-cyan shadow-[0_0_24px_rgba(53,208,255,0.35)]">
                        {i + 1}
                      </span>
                      <h3 className="font-display text-xl font-bold tracking-tight text-white">{step.title}</h3>
                      <p className="mt-2 max-w-[260px] text-[0.95rem] leading-relaxed text-acesso-gray-500">{step.short}</p>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ───────────── COMUNIDADE ───────────── */}
        <section className="overflow-hidden pb-24 sm:pb-32">
          <div className="container-acesso">
            <Reveal className="max-w-3xl">
              <span className="section-label">Ecossistema Acesso</span>
              <h2 className="mt-5 font-display text-[10vw] leading-[1] tracking-[-0.04em] sm:text-6xl lg:text-[3.8rem]">
                <span className="t-light text-acesso-gray-300">Mais que um diagnóstico. </span>
                <span className="t-heavy text-white">Uma porta de entrada.</span>
              </h2>
              <div className="mt-7 flex flex-wrap gap-2">
                {ECOSYSTEM.map((e) => (
                  <span key={e} className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[0.82rem] font-semibold text-acesso-ice">
                    {e}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="marquee-wrap marquee-mask mt-14 space-y-4">
            <div className="overflow-hidden">
              <div className="marquee items-end">
                {[...ROW_A, ...ROW_A].map((n, i) => (
                  <Photo key={`a-${i}`} name={n} />
                ))}
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="marquee rev items-start">
                {[...ROW_B, ...ROW_B].map((n, i) => (
                  <Photo key={`b-${i}`} name={n} tall />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ───────────── REUNIÃO ───────────── */}
        <section id="reuniao" className="scroll-mt-24 pb-24 sm:pb-32">
          <div className="container-acesso">
            <Reveal>
              <div className="glass relative overflow-hidden rounded-[36px] p-7 sm:p-12 lg:p-16">
                <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-acesso-cyan/[0.12] blur-[100px]" />
                <div className="relative grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                  <div>
                    <span className="section-label">Próximo passo</span>
                    <h2 className="mt-5 font-display text-[9.4vw] leading-[1] tracking-[-0.04em] sm:text-5xl lg:text-[3.4rem]">
                      <span className="t-light block text-acesso-gray-300">Do diagnóstico</span>
                      <span className="t-heavy block text-white">ao plano de entrada.</span>
                    </h2>
                    <p className="mt-6 max-w-lg text-[1.02rem] leading-relaxed text-acesso-gray-300">
                      <strong className="font-semibold text-white">Acesso USA Roadmap</strong> — uma reunião estratégica de 45 minutos com especialistas do Acesso, a partir do seu resultado.
                    </p>
                    <ul className="mt-7 space-y-3">
                      {[
                        'Análise individual da sua empresa',
                        'Plano de ação personalizado para os EUA',
                        'Clareza sobre marca, estrutura e estratégia',
                      ].map((b) => (
                        <li key={b} className="flex items-center gap-3 text-[0.95rem] text-acesso-gray-300">
                          <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-acesso-cyan/15 text-acesso-cyan">
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-center lg:text-left">
                    <div className="text-sm text-acesso-gray-500 line-through">US$297</div>
                    <div className="grad-text font-display text-[5.2rem] font-extrabold leading-none tracking-[-0.05em] sm:text-[6rem]">US$197</div>
                    <div className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-acesso-gray-500">por empresa · sessão única</div>
                    <div className="mt-8 flex flex-col gap-3">
                      <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn-light focus-ring">
                        Agendar minha reunião
                        <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                      </a>
                      <a
                        href={whatsappLink('Olá! Quero saber mais sobre o Acesso USA Roadmap.')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost focus-ring"
                      >
                        Falar no WhatsApp
                      </a>
                    </div>
                    <p className="mt-5 text-[0.78rem] text-acesso-gray-500">Vagas limitadas · Sem juridiquês · Orientação estratégica real</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────────── FAQ ───────────── */}
        <section id="faq" className="scroll-mt-24 pb-24 sm:pb-32">
          <div className="container-acesso grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Reveal>
              <span className="section-label">Dúvidas frequentes</span>
              <h2 className="mt-5 font-display text-[10vw] leading-[1] tracking-[-0.04em] sm:text-6xl lg:text-[3.4rem]">
                <span className="t-light block text-acesso-gray-300">Perguntas</span>
                <span className="t-heavy block text-white">respondidas.</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <Faq items={FAQ} />
            </Reveal>
          </div>
        </section>

        {/* ───────────── CTA FINAL ───────────── */}
        <section className="relative overflow-hidden pb-28 pt-8 sm:pb-40">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1e6fff]/[0.14] blur-[120px]" />
          <div className="container-acesso relative flex flex-col items-center text-center">
            <Reveal>
              <h2 className="font-display text-[12vw] leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-[5.4rem]">
                <span className="t-light block text-acesso-gray-300">Descubra onde</span>
                <span className="t-heavy block text-white">sua empresa está.</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mx-auto mt-7 max-w-md text-[1.05rem] leading-relaxed text-acesso-gray-300">
                Sem compromisso. Sem juridiquês. Orientação estratégica real em 3 minutos.
              </p>
              <div className="mt-10 flex justify-center">
                <Link href="/quiz" className="btn-light focus-ring !px-9 !py-4 !text-base">
                  Fazer meu diagnóstico gratuito
                  <ArrowRight className="h-5 w-5" strokeWidth={2.4} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
