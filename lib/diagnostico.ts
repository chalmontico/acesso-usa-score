// Fonte única de verdade do diagnóstico: pontuação, níveis, riscos, passos e roadmap.
// O quiz calcula o score aqui e a página de resultado lê exatamente as mesmas regras,
// então as barras por categoria sempre somam o score total.

export type Answers = Record<string, string>

export const STORAGE_KEY = 'acesso_resultado'
export const DRAFT_KEY = 'acesso_quiz_draft'

export const WHATSAPP_NUMBER = '14074089712' // +1 (407) 408-9712
export const CALENDLY_URL = 'https://calendly.com/acessoo/45'

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

const sim = (a: Answers, k: string) => a[k] === 'Sim'

// ---------------------------------------------------------------------------
// Categorias (somam 100 pontos)
// ---------------------------------------------------------------------------
export type Categoria = {
  key: string
  label: string
  desc: string
  max: number
  pts: (a: Answers) => number
}

export const CATEGORIAS: Categoria[] = [
  {
    key: 'financeiro',
    label: 'Capacidade financeira',
    desc: 'Fôlego para sustentar a entrada',
    max: 15,
    pts: (a) => {
      switch (a.faturamento) {
        case 'Acima de R$20 milhões': return 15
        case 'R$5 milhões a R$20 milhões': return 12
        case 'R$1 milhão a R$5 milhões': return 8
        case 'R$500 mil a R$1 milhão': return 4
        default: return 0
      }
    },
  },
  {
    key: 'tracao',
    label: 'Tração internacional',
    desc: 'Experiência e produto para o mercado americano',
    max: 28,
    pts: (a) =>
      (sim(a, 'vende_fora') ? 10 : 0) +
      (sim(a, 'clientes_eua') ? 10 : 0) +
      (a.produto_americanos === 'Sim' ? 8 : 0),
  },
  {
    key: 'marca',
    label: 'Marca e proteção',
    desc: 'Registro no Brasil e busca nos EUA',
    max: 10,
    pts: (a) => (sim(a, 'marca_brasil') ? 5 : 0) + (sim(a, 'marca_pesquisou_eua') ? 5 : 0),
  },
  {
    key: 'juridico',
    label: 'Estrutura jurídica',
    desc: 'CNPJ, empresa, EIN e conta nos EUA',
    max: 25,
    pts: (a) =>
      (sim(a, 'cnpj') ? 5 : 0) +
      (sim(a, 'empresa_eua') ? 10 : 0) +
      (sim(a, 'ein') ? 5 : 0) +
      (sim(a, 'conta_eua') ? 5 : 0),
  },
  {
    key: 'comercial',
    label: 'Operação comercial',
    desc: 'Site, equipe, material e inglês',
    max: 16,
    pts: (a) =>
      (sim(a, 'site_profissional') ? 4 : 0) +
      (sim(a, 'equipe_comercial') ? 4 : 0) +
      (sim(a, 'material_ingles') ? 4 : 0) +
      (sim(a, 'fala_ingles') ? 4 : 0),
  },
  {
    key: 'timing',
    label: 'Prontidão e timing',
    desc: 'Vivência no mercado e urgência',
    max: 6,
    pts: (a) => (sim(a, 'visitou_eua') ? 4 : 0) + (a.prazo === '0 a 3 meses' ? 2 : 0),
  },
]

export function pontosPorCategoria(a: Answers) {
  return CATEGORIAS.map((c) => ({ ...c, valor: c.pts(a), pct: c.pts(a) / c.max }))
}

export function calcScore(a: Answers): number {
  const total = CATEGORIAS.reduce((acc, c) => acc + c.pts(a), 0)
  return Math.max(0, Math.min(100, total))
}

// ---------------------------------------------------------------------------
// Níveis (os nomes são gravados no banco e usados no painel admin — não renomear)
// ---------------------------------------------------------------------------
export type NivelInfo = {
  nome: string
  cor: string
  titulo: string
  resumo: string
}

export function getNivel(score: number): string {
  if (score >= 75) return 'Pronto para Expandir'
  if (score >= 50) return 'Em Desenvolvimento'
  if (score >= 25) return 'Iniciando Jornada'
  return 'Precisa Estruturar'
}

export function nivelInfo(nome: string): NivelInfo {
  switch (nome) {
    case 'Pronto para Expandir':
      return {
        nome,
        cor: '#22C55E',
        titulo: 'Sua empresa já tem base para atuar lá fora.',
        resumo:
          'Você reúne estrutura, tração e clareza que a maioria só constrói depois de tropeçar. O próximo passo é transformar prontidão em plano: definir a entrada, proteger o que importa e abrir as portas certas.',
      }
    case 'Em Desenvolvimento':
      return {
        nome,
        cor: '#3B82F6',
        titulo: 'Você está a meio caminho — e já sabe o que falta.',
        resumo:
          'Há fundamentos sólidos no seu negócio e alguns pontos que pedem atenção antes de investir pesado nos Estados Unidos. Resolver a ordem certa das coisas é o que separa uma entrada segura de uma cara.',
      }
    case 'Iniciando Jornada':
      return {
        nome,
        cor: '#F59E0B',
        titulo: 'O começo é aqui — e começar bem muda tudo.',
        resumo:
          'Sua empresa ainda tem bastante a estruturar para o mercado americano, e isso é normal. Com prioridades claras, cada etapa vira um passo concreto em vez de um risco.',
      }
    default:
      return {
        nome: 'Precisa Estruturar',
        cor: '#EF4444',
        titulo: 'Antes de cruzar a fronteira, vale fortalecer a base.',
        resumo:
          'O diagnóstico mostra que há fundamentos importantes a organizar antes de pensar na operação americana. Saber disso agora economiza tempo e dinheiro — e define por onde começar.',
      }
  }
}

// ---------------------------------------------------------------------------
// Riscos e próximos passos personalizados
// ---------------------------------------------------------------------------
export function riscos(a: Answers): string[] {
  const r: string[] = []
  if (!sim(a, 'cnpj')) r.push('Sem CNPJ ativo: a base formal do negócio no Brasil precisa estar resolvida antes de qualquer expansão.')
  if (!sim(a, 'marca_pesquisou_eua')) r.push('A disponibilidade da sua marca nos EUA ainda não foi verificada — outra empresa pode já ter registrado algo parecido.')
  if (!sim(a, 'marca_brasil') || a.marca_brasil === 'Não sei') r.push('Marca sem registro confirmado no Brasil: a proteção internacional começa pela marca de origem.')
  if (!sim(a, 'empresa_eua')) r.push('Sem estrutura jurídica nos EUA (LLC ou Corporation): operar, contratar e receber localmente fica muito mais difícil.')
  if (!sim(a, 'conta_eua') || !sim(a, 'ein')) r.push('Sem EIN ou conta bancária americana: isso trava recebimentos, contratos e a operação do dia a dia.')
  if (!sim(a, 'vende_fora') && !sim(a, 'clientes_eua')) r.push('Sem experiência de venda internacional: o mercado americano exige adaptar oferta, preço e abordagem comercial.')
  if (!sim(a, 'material_ingles') || !sim(a, 'fala_ingles')) r.push('Comunicação em inglês ainda limitada: site, materiais e atendimento precisam falar com o cliente americano.')
  return r.slice(0, 3)
}

export function passos(a: Answers): string[] {
  const p: string[] = []
  if (!sim(a, 'marca_pesquisou_eua')) p.push('Pesquise a disponibilidade da sua marca no USPTO (uspto.gov) antes de qualquer investimento.')
  if (!sim(a, 'empresa_eua')) p.push('Defina o formato da sua empresa nos EUA (LLC ou Corporation) — a abertura pode ser feita remotamente.')
  if (!sim(a, 'ein')) p.push('Solicite o EIN, o número fiscal americano, necessário para abrir conta bancária e operar.')
  if (!sim(a, 'material_ingles')) p.push('Crie versões em inglês do seu site e materiais de venda, adaptadas ao público americano.')
  if (!sim(a, 'equipe_comercial')) p.push('Desenhe quem vai conduzir as vendas e o relacionamento com clientes nos EUA.')
  if (!sim(a, 'visitou_eua')) p.push('Planeje uma imersão de negócios nos EUA: ver o mercado de perto acelera decisões.')
  const base = p.slice(0, 3)
  base.push('Converse com o Acesso para transformar este diagnóstico em um plano de entrada sob medida.')
  return base
}

// ---------------------------------------------------------------------------
// Roadmap: as 4 etapas oficiais da internacionalização, com status personalizado
// ---------------------------------------------------------------------------
export type EtapaRoadmap = {
  n: string
  titulo: string
  desc: string
  nota: string
  status: string
  cor: string
}

function statusDe(pct: number) {
  if (pct >= 0.7) return { status: 'Em dia', cor: '#22C55E' }
  if (pct >= 0.35) return { status: 'Em andamento', cor: '#3B82F6' }
  return { status: 'Para começar', cor: '#F59E0B' }
}

export function roadmap(a: Answers): EtapaRoadmap[] {
  const c = Object.fromEntries(pontosPorCategoria(a).map((x) => [x.key, x])) as Record<string, ReturnType<typeof pontosPorCategoria>[number]>
  const soma = (keys: string[]) => keys.reduce((s, k) => s + c[k].valor, 0) / keys.reduce((s, k) => s + c[k].max, 0)

  const prazo = a.prazo
  const nota1 =
    prazo && prazo !== 'Só quero entender'
      ? `Janela desejada de entrada: ${prazo.toLowerCase()}. O plano parte do que é inegociável para esse prazo.`
      : 'Você está em fase de entendimento — o planejamento define o que priorizar primeiro.'

  return [
    {
      n: '01',
      titulo: 'Diagnóstico e planejamento',
      desc: 'Entender o negócio e definir objetivos e prioridades.',
      nota: nota1,
      status: 'Feito aqui',
      cor: '#35D0FF',
    },
    {
      n: '02',
      titulo: 'Estruturação',
      desc: 'Empresa, contabilidade, documentos e análise da marca.',
      nota:
        sim(a, 'empresa_eua') && sim(a, 'marca_pesquisou_eua')
          ? 'Boa parte da base já existe. Falta revisar e organizar os detalhes.'
          : 'É aqui que estão suas maiores oportunidades de ganhar segurança.',
      ...statusDe(soma(['marca', 'juridico'])),
    },
    {
      n: '03',
      titulo: 'Preparação para funcionar',
      desc: 'Licenças, autorizações e recursos da operação.',
      nota:
        sim(a, 'material_ingles') && sim(a, 'fala_ingles')
          ? 'Sua comunicação já fala inglês — o foco vira licenças e rotina operacional.'
          : 'Preparar o negócio para atender o cliente americano em inglês é parte central.',
      ...statusDe(soma(['comercial', 'financeiro'])),
    },
    {
      n: '04',
      titulo: 'Inserção e acompanhamento',
      desc: 'Conexões comerciais, adaptação ao mercado e orientação estratégica.',
      nota:
        sim(a, 'clientes_eua')
          ? 'Você já tem clientes nos EUA: dá para acelerar com conexões estratégicas.'
          : 'Conexões e relacionamento certos encurtam o caminho até os primeiros clientes.',
      ...statusDe(soma(['tracao', 'timing'])),
    },
  ]
}
