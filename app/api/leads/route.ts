import { NextRequest, NextResponse } from 'next/server'

// Usa as variáveis de ambiente da Vercel; o valor antigo fica só como reserva
// para não interromper a captação enquanto as variáveis não forem confirmadas.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gedqamkcflteuhlvrabo.supabase.co'
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZHFhbWtjZmx0ZXVobHZyYWJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg3NTc2MCwiZXhwIjoyMDk2NDUxNzYwfQ.TkmXya77xLJ1OEKaMGuOxPcKU7ZV82QD-JwNSki4qhw'

const NIVEIS = ['Pronto para Expandir', 'Em Desenvolvimento', 'Iniciando Jornada', 'Precisa Estruturar']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const answers = body?.answers && typeof body.answers === 'object' ? body.answers : null
    if (!answers) return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })

    const email = String(answers.email || '').trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
    }

    const score = Math.max(0, Math.min(100, Math.round(Number(body.score) || 0)))
    const nivel = NIVEIS.includes(body.nivel) ? body.nivel : null

    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name: String(answers.nome || 'Sem nome').trim(),
        email,
        whatsapp: answers.whatsapp ? String(answers.whatsapp).trim() : null,
        score,
        nivel,
        respostas: answers,
      }),
    })

    if (!res.ok) {
      const detail = await res.text()
      return NextResponse.json({ error: 'Não foi possível salvar.', detail }, { status: 502 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
