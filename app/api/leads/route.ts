import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Body recebido:', JSON.stringify(body))

    // Aceita qualquer variação de nome dos campos
    const name = body.name || body.nome || body.fullName || ''
    const email = body.email || body.Email || ''
    const whatsapp = body.whatsapp || body.phone || body.telefone || body.celular || ''
    const score = body.score || body.pontuacao || 0
    const nivel = body.nivel || body.level || body.resultado || ''
    const respostas = body.respostas || body.answers || body.responses || null

    console.log('Dados extraídos:', { name, email, whatsapp, score, nivel })

    if (!name && !email) {
      console.log('ERRO: name e email vazios')
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios', bodyRecebido: body },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('leads')
      .insert([{
        name: name || 'Sem nome',
        email: email || 'sem@email.com',
        whatsapp: whatsapp || null,
        score: score || 0,
        nivel: nivel || null,
        respostas: respostas || null,
        created_at: new Date().toISOString(),
      }])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Erro Supabase: ' + error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: 'Erro interno: ' + String(err) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ leads: data })
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
