import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== 'acesso2025') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    return NextResponse.json({ error: 'Missing env vars', url: !!url, key: !!key, data: [] }, { status: 500 })
  }

  try {
    const res = await fetch(`${url}/rest/v1/leads?order=created_at.desc`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    })
    const data = await res.json()
    return NextResponse.json({ data: Array.isArray(data) ? data : [] })
  } catch (err) {
    return NextResponse.json({ error: String(err), data: [] }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== 'acesso2025') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  try {
    const { id, status } = await req.json()
    const res = await fetch(`${url}/rest/v1/leads?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': key!,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ status })
    })
    const data = await res.json()
    return NextResponse.json({ success: true, data })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
