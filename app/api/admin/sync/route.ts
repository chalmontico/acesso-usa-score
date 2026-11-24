import { NextRequest, NextResponse } from 'next/server'
import { sendToAcessoOs } from '@/lib/crm'

// Envia ao CRM do Acesso OS todos os leads que já estavam no banco do Score.
// Uso único. Mesma senha do painel admin. Não reenvia leads já marcados como enviados.
export async function POST(req: NextRequest) {
  if (req.headers.get('x-admin-secret') !== 'acesso2025') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key || !process.env.SCORE_SYNC_KEY) {
    return NextResponse.json({ error: 'Faltam variáveis de ambiente (banco ou CRM).' }, { status: 500 })
  }
  const res = await fetch(`${url}/rest/v1/leads?order=created_at.asc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })
  const leads = await res.json()
  if (!Array.isArray(leads)) return NextResponse.json({ error: 'Não foi possível ler os leads.' }, { status: 502 })

  const seen = new Set<string>()
  let enviados = 0
  let falhas = 0
  for (const l of leads) {
    const email = String(l.email || '').trim().toLowerCase()
    if (!email || seen.has(email)) continue // um por e-mail (o mais antigo)
    seen.add(email)
    const ok = await sendToAcessoOs({
      nome: l.name,
      email: l.email,
      whatsapp: l.whatsapp,
      score: l.score,
      nivel: l.nivel,
      respostas: l.respostas,
    })
    ok ? enviados++ : falhas++
  }
  return NextResponse.json({ total: leads.length, enviados, falhas })
}
