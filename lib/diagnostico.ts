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

// ---------------------------------------------------------------------------
// Leitura avançada do diagnóstico (não altera o score: só interpreta as respostas)
// ---------------------------------------------------------------------------

type Item = {
  key: string
  pts: number
  ok: (a: Answers) => boolean
  forte: string // frase quando já está resolvido
  falta: string // nome curto da lacuna
  acao: string // título da ação
  como: string // como resolver, em uma frase
  etapa: string // etapa do roadmap onde isso se resolve
  categoria: string
}

// Cada item vale exatamente o que vale em CATEGORIAS — assim "+N pts" é sempre verdadeiro.
const ITENS: Item[] = [
  { key: 'empresa_eua', pts: 10, ok: (a) => sim(a, 'empresa_eua'), forte: 'Já tem empresa constituída nos EUA', falta: 'Empresa nos EUA', acao: 'Abrir a empresa nos EUA (LLC ou Corporation)', como: 'A escolha do formato e do estado define impostos, proteção e custos. Dá para abrir 100% à distância.', etapa: 'Estruturação', categoria: 'juridico' },
  { key: 'vende_fora', pts: 10, ok: (a) => sim(a, 'vende_fora'), forte: 'Já vende fora do Brasil', falta: 'Venda internacional', acao: 'Fazer a primeira venda internacional', como: 'Comece por um cliente-piloto: ele valida preço, logística e comunicação antes de escalar.', etapa: 'Inserção', categoria: 'tracao' },
  { key: 'clientes_eua', pts: 10, ok: (a) => sim(a, 'clientes_eua'), forte: 'Já tem clientes nos EUA', falta: 'Clientes nos EUA', acao: 'Conquistar os primeiros clientes americanos', como: 'Mire um nicho estreito, com uma oferta clara em inglês e acesso direto ao decisor.', etapa: 'Inserção', categoria: 'tracao' },
  { key: 'produto_americanos', pts: 8, ok: (a) => a.produto_americanos === 'Sim', forte: 'Seu produto ou serviço tem apelo para o público americano', falta: 'Encaixe de produto', acao: 'Validar o encaixe do produto no mercado americano', como: 'Teste a oferta com 5 a 10 potenciais clientes antes de investir em estrutura.', etapa: 'Diagnóstico', categoria: 'tracao' },
  { key: 'cnpj', pts: 5, ok: (a) => sim(a, 'cnpj'), forte: 'CNPJ ativo e operação formal no Brasil', falta: 'CNPJ ativo', acao: 'Regularizar o CNPJ no Brasil', como: 'É a base formal de qualquer expansão: contratos, bancos e parceiros pedem isso primeiro.', etapa: 'Estruturação', categoria: 'juridico' },
  { key: 'ein', pts: 5, ok: (a) => sim(a, 'ein'), forte: 'Já possui EIN', falta: 'EIN', acao: 'Solicitar o EIN (CNPJ americano)', como: 'Sem o EIN não há conta bancária, nem emissão de nota, nem declaração de impostos.', etapa: 'Estruturação', categoria: 'juridico' },
  { key: 'conta_eua', pts: 5, ok: (a) => sim(a, 'conta_eua'), forte: 'Já possui conta bancária nos EUA', falta: 'Conta bancária', acao: 'Abrir a conta bancária americana', como: 'Permite receber em dólar, pagar fornecedores e dar credibilidade perante clientes.', etapa: 'Estruturação', categoria: 'juridico' },
  { key: 'marca_brasil', pts: 5, ok: (a) => sim(a, 'marca_brasil'), forte: 'Marca registrada no Brasil', falta: 'Registro da marca no Brasil', acao: 'Registrar a marca no INPI', como: 'O registro de origem é o ponto de partida para proteger a marca fora do país.', etapa: 'Estruturação', categoria: 'marca' },
  { key: 'marca_pesquisou_eua', pts: 5, ok: (a) => sim(a, 'marca_pesquisou_eua'), forte: 'Marca já pesquisada nos EUA', falta: 'Busca de marca nos EUA', acao: 'Pesquisar a disponibilidade da marca no USPTO', como: 'Uma busca prévia evita investir em um nome que já tenha dono nos EUA.', etapa: 'Estruturação', categoria: 'marca' },
  { key: 'material_ingles', pts: 4, ok: (a) => sim(a, 'material_ingles'), forte: 'Material de vendas em inglês', falta: 'Material em inglês', acao: 'Criar site e material de vendas em inglês', como: 'Adapte a mensagem ao comprador americano; tradução literal não converte.', etapa: 'Preparação', categoria: 'comercial' },
  { key: 'fala_ingles', pts: 4, ok: (a) => sim(a, 'fala_ingles'), forte: 'Tem alguém que fala inglês na operação', falta: 'Inglês na operação', acao: 'Ter alguém fluente no atendimento e nas vendas', como: 'Primeiro contato e proposta precisam sair em inglês natural, sem ruído.', etapa: 'Preparação', categoria: 'comercial' },
  { key: 'equipe_comercial', pts: 4, ok: (a) => sim(a, 'equipe_comercial'), forte: 'Equipe comercial estruturada', falta: 'Equipe comercial', acao: 'Definir quem conduz as vendas nos EUA', como: 'Pode ser o sócio, um representante ou uma operação local. O importante é ter dono.', etapa: 'Preparação', categoria: 'comercial' },
  { key: 'site_profissional', pts: 4, ok: (a) => sim(a, 'site_profissional'), forte: 'Site profissional no ar', falta: 'Site profissional', acao: 'Profissionalizar o site', como: 'É a primeira checagem que um cliente americano faz antes de responder.', etapa: 'Preparação', categoria: 'comercial' },
  { key: 'visitou_eua', pts: 4, ok: (a) => sim(a, 'visitou_eua'), forte: 'Já visitou os EUA com foco em negócios', falta: 'Vivência de mercado', acao: 'Fazer uma imersão de negócios nos EUA', como: 'Ver o mercado de perto e conhecer gente certa acelera decisões que levariam meses.', etapa: 'Inserção', categoria: 'timing' },
]

export type Acao = { titulo: string; como: string; pts: number; etapa: string }

// Plano priorizado: o que mais pontua e destrava vem primeiro.
export function acoes(a: Answers, limite = 5): Acao[] {
  const prioridade = (i: Item) => i.pts + (['empresa_eua', 'ein', 'conta_eua', 'cnpj'].includes(i.key) ? 0.5 : 0)
  return ITENS.filter((i) => !i.ok(a))
    .sort((x, y) => prioridade(y) - prioridade(x))
    .slice(0, limite)
    .map((i) => ({ titulo: i.acao, como: i.como, pts: i.pts, etapa: i.etapa }))
}

export function potencial(a: Answers, limite = 5): number {
  return acoes(a, limite).reduce((s, x) => s + x.pts, 0)
}

export function pontosFortes(a: Answers): string[] {
  const f = ITENS.filter((i) => i.ok(a)).sort((x, y) => y.pts - x.pts).map((i) => i.forte)
  if (a.faturamento === 'Acima de R$20 milhões' || a.faturamento === 'R$5 milhões a R$20 milhões') {
    f.push('Faturamento que sustenta um investimento de entrada')
  }
  return f.slice(0, 5)
}

// O que falta, por categoria (para mostrar junto da barra)
export function lacunas(a: Answers): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const i of ITENS) if (!i.ok(a)) (out[i.categoria] ||= []).push(i.falta)
  return out
}

export type Severidade = 'Crítico' | 'Alto' | 'Moderado'
export type Risco = { texto: string; sev: Severidade }

export function riscosDetalhados(a: Answers): Risco[] {
  const r: Risco[] = []
  if (!sim(a, 'cnpj')) r.push({ sev: 'Crítico', texto: 'Sem CNPJ ativo: a base formal do negócio no Brasil precisa estar resolvida antes de qualquer expansão.' })
  if (!sim(a, 'empresa_eua')) r.push({ sev: 'Alto', texto: 'Sem empresa nos EUA (LLC ou Corporation): operar, contratar e receber localmente fica muito mais difícil, e o patrimônio pessoal fica mais exposto.' })
  if (!sim(a, 'marca_pesquisou_eua')) r.push({ sev: 'Alto', texto: 'A marca ainda não foi pesquisada nos EUA: outra empresa pode já ter registrado algo parecido, e trocar de nome depois custa caro.' })
  if (!sim(a, 'marca_brasil') || a.marca_brasil === 'Não sei') r.push({ sev: 'Moderado', texto: 'Marca sem registro confirmado no Brasil: a proteção internacional parte da marca de origem.' })
  if (!sim(a, 'ein') || !sim(a, 'conta_eua')) r.push({ sev: 'Alto', texto: 'Sem EIN ou conta bancária americana: isso trava recebimentos, contratos e a operação do dia a dia.' })
  if (a.regulamentacao === 'Sim') r.push({ sev: 'Alto', texto: 'Seu produto ou serviço exige licença ou regulamentação específica: isso define prazo e custo da entrada e deve ser mapeado antes de qualquer investimento.' })
  if (a.regulamentacao === 'Não sei') r.push({ sev: 'Moderado', texto: 'Você ainda não sabe se o seu negócio exige licença nos EUA: vale confirmar antes de investir em estrutura.' })
  if (!sim(a, 'vende_fora') && !sim(a, 'clientes_eua')) r.push({ sev: 'Moderado', texto: 'Sem experiência de venda internacional: o mercado americano exige adaptar oferta, preço e abordagem comercial.' })
  if (!sim(a, 'material_ingles') || !sim(a, 'fala_ingles')) r.push({ sev: 'Moderado', texto: 'Comunicação em inglês ainda limitada: site, materiais e atendimento precisam falar com o cliente americano.' })
  if (a.orcamento === 'Ainda não defini' && a.prazo && a.prazo !== 'Só quero entender') r.push({ sev: 'Moderado', texto: 'Há um prazo de entrada, mas ainda não há orçamento definido: sem isso o plano não fecha.' })
  const ordem: Record<Severidade, number> = { Crítico: 0, Alto: 1, Moderado: 2 }
  return r.sort((x, y) => ordem[x.sev] - ordem[y.sev]).slice(0, 4)
}

// Leitura do prazo desejado frente à prontidão real
export function leituraPrazo(a: Answers, score: number): { titulo: string; texto: string; tom: 'ok' | 'atencao' | 'neutro' } | null {
  const p = a.prazo
  if (!p) return null
  if (p === 'Só quero entender') return { titulo: 'Fase de entendimento', texto: 'Sem pressa de prazo: o melhor uso agora é montar o plano e o orçamento, para decidir com segurança.', tom: 'neutro' }
  const curto = p === '0 a 3 meses'
  const medio = p === '3 a 6 meses'
  if (curto && score < 60) return { titulo: 'Prazo ambicioso', texto: `Entrar em ${p.toLowerCase()} com este nível de prontidão é possível só se as ações críticas forem tratadas em paralelo. Sem isso, o risco é gastar antes de estar pronto.`, tom: 'atencao' }
  if (curto) return { titulo: 'Prazo realista', texto: `Com a base que você já tem, entrar em ${p.toLowerCase()} é viável, desde que a estrutura pendente comece agora.`, tom: 'ok' }
  if (medio && score < 40) return { titulo: 'Prazo apertado', texto: `Para ${p.toLowerCase()}, a estruturação precisa começar já. Hoje ainda há bastante a resolver antes de operar.`, tom: 'atencao' }
  return { titulo: 'Prazo compatível', texto: `Em ${p.toLowerCase()} dá para estruturar com calma e entrar com segurança, na ordem certa.`, tom: 'ok' }
}

export type Insight = { titulo: string; texto: string }

// Pontos de atenção do perfil de entrada (perguntas sem peso no score)
export function insightsPerfil(a: Answers): Insight[] {
  const out: Insight[] = []
  switch (a.orcamento) {
    case 'Ainda não defini':
      out.push({ titulo: 'Orçamento', texto: 'Definir quanto investir no primeiro ano é a decisão que ordena todas as outras. Comece por uma faixa realista.' })
      break
    case 'Até US$10 mil':
      out.push({ titulo: 'Orçamento enxuto', texto: 'Com esse orçamento, a entrada deve ser faseada: estrutura mínima, um cliente-piloto e crescimento a partir da receita.' })
      break
    case 'US$10 mil a US$50 mil':
      out.push({ titulo: 'Orçamento', texto: 'Faixa que comporta estrutura básica, marca e um início de operação comercial, desde que bem priorizada.' })
      break
    default:
      out.push({ titulo: 'Orçamento', texto: 'Faixa de investimento que permite estruturar com solidez e acelerar a conquista de clientes.' })
  }
  if (a.modelo_venda === 'Para empresas (B2B)') out.push({ titulo: 'Modelo B2B', texto: 'Vendas para empresas dependem de relacionamento e credibilidade. Conexões certas pesam mais do que anúncios.' })
  else if (a.modelo_venda === 'Para consumidor final (B2C)') out.push({ titulo: 'Modelo B2C', texto: 'Consumidor final exige marca protegida, meio de pagamento americano e canal de aquisição testado antes de escalar.' })
  else if (a.modelo_venda === 'Os dois') out.push({ titulo: 'Modelo B2B e B2C', texto: 'Começar por um dos dois públicos acelera a validação. O outro entra quando o primeiro estiver rodando.' })
  else if (a.modelo_venda) out.push({ titulo: 'Franquia, licenciamento ou distribuição', texto: 'Esse modelo pede contratos bem estruturados e proteção de marca. É onde uma estrutura jurídica sólida mais pesa.' })
  if (a.parceiro_eua === 'Não') out.push({ titulo: 'Rede local', texto: 'Sem sócio ou parceiro nos EUA, o caminho passa por construir conexões locais: é aí que o relacionamento encurta o tempo.' })
  else if (a.parceiro_eua === 'Estou buscando') out.push({ titulo: 'Parceiro em busca', texto: 'Você já busca alguém nos EUA. Escolher bem e formalizar a parceria protege os dois lados.' })
  else if (a.parceiro_eua === 'Sim') out.push({ titulo: 'Parceiro nos EUA', texto: 'Ter parceiro local é uma vantagem real. O ponto agora é formalizar papéis, participação e propriedade da marca.' })
  return out.slice(0, 4)
}
