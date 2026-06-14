import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = 'https://gedqamkcflteuhlvrabo.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZHFhbWtjZmx0ZXVobHZyYWJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg3NTc2MCwiZXhwIjoyMDk2NDUxNzYwfQ.TkmXya77xLJ1OEKaMGuOxPcKU7ZV82QD-JwNSki4qhw'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const answers = body.answers || body

    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: answers.nome || answers.name || 'Sem nome',
        email: answers.email || 'sem@email.com',
        whatsapp: answers.whatsapp || null,
        score: body.score || 0,
        nivel: body.nivel || null,
        respostas: answers,
        created_at: new Date().toISOString(),
      })
    })

    const data = await res.json()
    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function GET() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads?order=created_at.desc`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  })
  const data = await res.json()
  return NextResponse.json({ leads: data })
}
