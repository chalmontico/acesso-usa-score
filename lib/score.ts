export interface Answers {
  // Etapa 1 - Dados
  nome: string
  empresa: string
  email: string
  whatsapp: string
  cidade: string
  estado: string
  segmento: string
  site?: string
  instagram?: string
  // Etapa 2 - Momento
  faturamento: string
  vende_fora: string
  clientes_eua: string
  produto_americanos: string
  // Etapa 3 - Estrutura
  cnpj: string
  marca_brasil: string
  marca_pesquisou_eua: string
  empresa_eua: string
  ein: string
  conta_eua: string
  // Etapa 4 - Comercial
  site_profissional: string
  equipe_comercial: string
  material_ingles: string
  fala_ingles: string
  visitou_eua: string
  prazo: string
}

export interface ScoreResult {
  total: number
  marca: number
  estrutura: number
  financeiro: number
  produto: number
  comercial: number
  timing: number
  nivel: number
  nivel_label: string
  cor: string
}

export function calcScore(a: Answers): ScoreResult {
  // MARCA (20pts)
  let marca = 0
  if (a.marca_brasil === 'Sim') marca += 8
  else if (a.marca_brasil === 'Em andamento') marca += 4
  if (a.marca_pesquisou_eua === 'Sim') marca += 7
  if (a.empresa_eua === 'Sim') marca += 5

  // ESTRUTURA (20pts)
  let estrutura = 0
  if (a.cnpj === 'Sim') estrutura += 5
  if (a.empresa_eua === 'Sim') estrutura += 7
  if (a.ein === 'Sim') estrutura += 4
  if (a.conta_eua === 'Sim') estrutura += 4

  // FINANCEIRO (15pts)
  let financeiro = 0
  if (a.faturamento === 'Acima de R$20 milhões') financeiro = 15
  else if (a.faturamento === 'R$5 milhões a R$20 milhões') financeiro = 12
  else if (a.faturamento === 'R$1 milhão a R$5 milhões') financeiro = 9
  else if (a.faturamento === 'R$500 mil a R$1 milhão') financeiro = 5
  else financeiro = 2

  // PRODUTO (15pts)
  let produto = 0
  if (a.produto_americanos === 'Sim') produto += 8
  else if (a.produto_americanos === 'Não sei') produto += 3
  if (a.vende_fora === 'Sim') produto += 4
  if (a.clientes_eua === 'Sim') produto += 3

  // COMERCIAL (15pts)
  let comercial = 0
  if (a.site_profissional === 'Sim') comercial += 4
  if (a.equipe_comercial === 'Sim') comercial += 4
  if (a.material_ingles === 'Sim') comercial += 4
  if (a.fala_ingles === 'Sim') comercial += 3

  // TIMING (15pts)
  let timing = 0
  if (a.prazo === '0 a 3 meses') timing = 15
  else if (a.prazo === '3 a 6 meses') timing = 12
  else if (a.prazo === '6 a 12 meses') timing = 8
  else if (a.prazo === 'Mais de 12 meses') timing = 4
  else timing = 1
  if (a.visitou_eua === 'Sim') timing = Math.min(15, timing + 2)

  const total = marca + estrutura + financeiro + produto + comercial + timing

  let nivel = 1, nivel_label = 'Ideia Inicial', cor = '#EF4444'
  if (total > 75) { nivel = 4; nivel_label = 'Pronto para o Roadmap EUA'; cor = '#22C55E' }
  else if (total > 50) { nivel = 3; nivel_label = 'Potencial Real'; cor = '#3B82F6' }
  else if (total > 25) { nivel = 2; nivel_label = 'Preparação Necessária'; cor = '#F59E0B' }

  return { total, marca, estrutura, financeiro, produto, comercial, timing, nivel, nivel_label, cor }
}

export function getRiscos(a: Answers, s: ScoreResult): string[] {
  const riscos: string[] = []
  if (s.marca < 10) riscos.push('Sua marca pode estar vulnerável nos EUA — outra empresa pode registrá-la antes de você entrar no mercado.')
  if (s.estrutura < 10) riscos.push('Sem estrutura americana (LLC/Corp, EIN, conta bancária), fica difícil operar, faturar e receber nos EUA.')
  if (s.comercial < 8) riscos.push('A ausência de material em inglês e estrutura comercial pode comprometer a entrada antes do primeiro contato com clientes americanos.')
  if (s.financeiro < 6) riscos.push('O nível de faturamento atual pode limitar o investimento necessário para uma entrada estruturada nos EUA.')
  if (s.produto < 8) riscos.push('Ainda não está claro se o produto tem encaixe no mercado americano — isso precisa ser validado antes de qualquer investimento.')
  if (a.marca_pesquisou_eua === 'Não') riscos.push('Você ainda não pesquisou a disponibilidade da sua marca nos EUA. É um passo crítico antes de qualquer ação.')
  return riscos.slice(0, 3)
}

export function getPassos(a: Answers, s: ScoreResult): string[] {
  const passos: string[] = []
  if (s.marca < 10) passos.push('Iniciar pesquisa de disponibilidade da marca nos EUA no USPTO e avaliar risco de conflito com marcas existentes.')
  if (s.estrutura < 10) passos.push('Definir o tipo de estrutura americana adequada para o seu negócio (LLC ou Corporation) e iniciar o processo de abertura.')
  if (s.comercial < 8) passos.push('Criar ou adaptar o site e materiais institucionais para o mercado americano, com versão em inglês e proposta de valor clara.')
  if (s.produto < 8) passos.push('Validar o potencial do produto com pesquisa de mercado e conversas com potenciais clientes americanos.')
  if (s.financeiro < 9) passos.push('Avaliar o orçamento disponível para a expansão e criar um plano financeiro realista para os primeiros 12 meses nos EUA.')
  passos.push('Agendar uma reunião estratégica para transformar esse diagnóstico em um plano de ação personalizado.')
  return passos.slice(0, 3)
}
