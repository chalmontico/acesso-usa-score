import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = 'https://gedqamkcfiteuhlvrabo.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZHFhbWtjZml0ZXVobHZyYWJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODkwMzMzMiwiZXhwIjoyMDY0NDc5MzMyfQ.hRwKBJTlAqfFVrIETqXBl1p-BEgZ0hECFTX2lxwTYhs'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== 'acesso2025') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads?order=created_at.desc`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  })

  const data = await res.json()
  return NextResponse.json({ data: Array.isArray(data) ? data : [] })
}

export async function PATCH(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== 'acesso2025') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, status } = await req.json()

  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ status })
  })

  const data = await res.json()
  return NextResponse.json({ success: true, data })
}
