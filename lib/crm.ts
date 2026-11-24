// Envia o lead do Score para o CRM do Acesso OS (matriz).
// O Score não guarda a chave do CRM: envia ao site (acessousa.com/api/score-lead),
// que repassa ao Acesso OS. Variável na Vercel: SCORE_SYNC_KEY (a mesma nos dois projetos).
// Nunca lança erro: o diagnóstico deve funcionar mesmo se o CRM estiver fora do ar.

type LeadScore = {
  nome?: string
  email: string
  whatsapp?: string | null
  score: number
  nivel?: string | null
  respostas?: Record<string, unknown> | null
}

const ROTULOS: [string, string][] = [
  ['empresa', 'Empresa'],
  ['segmento', 'Segmento'],
  ['faturamento', 'Faturamento'],
  ['vende_fora', 'Vende fora'],
  ['clientes_eua', 'Clientes nos EUA'],
  ['cnpj', 'CNPJ'],
  ['marca_brasil', 'Marca no Brasil'],
  ['marca_pesquisou_eua', 'Pesquisou marca nos EUA'],
  ['empresa_eua', 'Empresa nos EUA'],
  ['ein', 'EIN'],
  ['conta_eua', 'Conta nos EUA'],
  ['site_profissional', 'Site profissional'],
  ['equipe_comercial', 'Equipe comercial'],
  ['material_ingles', 'Material em inglês'],
  ['fala_ingles', 'Fala inglês'],
  ['visitou_eua', 'Visitou os EUA'],
  ['prazo', 'Prazo para entrar nos EUA'],
]

export function montarPayload(l: LeadScore) {
  const r = (l.respostas || {}) as Record<string, unknown>
  const detalhes = ROTULOS.map(([k, n]) => (r[k] ? `${n}: ${String(r[k])}` : '')).filter(Boolean)
  return {
    nome: l.nome || String(r.nome || ''),
    email: l.email,
    telefone: l.whatsapp || String(r.whatsapp || ''),
    cargo: String(r.empresa || ''),
    conheceu: `ACESSO USA SCORE — diagnóstico (${l.score}/100 · ${l.nivel || 'sem nível'})`,
    objetivo: [`Score ${l.score}/100 — ${l.nivel || 'sem nível'}`, ...detalhes].join(' | '),
    origem: 'acessousa.com/score (diagnóstico)',
  }
}

export async function sendToAcessoOs(l: LeadScore): Promise<boolean> {
  const url = process.env.SCORE_CRM_URL || 'https://acessousa.com/api/score-lead'
  const secret = process.env.SCORE_SYNC_KEY
  if (!secret) return false
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-score-chave': secret },
      body: JSON.stringify(montarPayload(l)),
    })
    if (!res.ok) console.error('[acesso-os] CRM respondeu', res.status)
    return res.ok
  } catch (err) {
    console.error('[acesso-os] falha ao enviar', err)
    return false
  }
}
