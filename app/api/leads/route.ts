import { NextRequest, NextResponse } from 'next/server'
import { calcScore, getRiscos, getPassos, Answers } from '@/lib/score'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gedqamkcfiteuhlvrabo.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZHFhbWtjZml0ZXVobHZyYWJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODkwMzMzMiwiZXhwIjoyMDY0NDc5MzMyfQ.hRwKBJTlAqfFVrIETqXBl1p-BEgZ0hECFTX2lxwTYhs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const answers: Answers = body.answers
    const score = calcScore(answers)
    const riscos = getRiscos(answers, score)
    const passos = getPassos(answers, score)
    const resumo_ia = `A empresa ${answers.empresa} do segmento ${answers.segmento} obteve ${score.total} pontos. Nível ${score.nivel}: ${score.nivel_label}.`

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        nome: answers.nome,
        empresa: answers.empresa,
        email: answers.email,
        whatsapp: answers.whatsapp,
        cidade: answers.cidade || '',
        estado: answers.estado || '',
        segmento: answers.segmento,
        site: answers.site || '',
        instagram: answers.instagram || '',
      })
      .select()
      .single()

    if (leadError) throw new Error(leadError.message)

    await supabase.from('diagnosticos').insert({
      lead_id: lead.id,
      respostas: answers,
      score_total: score.total,
      score_marca: score.marca,
      score_estrutura: score.estrutura,
      score_financeiro: score.financeiro,
      score_produto: score.produto,
      score_comercial: score.comercial,
      score_timing: score.timing,
      nivel: score.nivel,
      nivel_label: score.nivel_label,
      resumo_ia,
      riscos_ia: riscos,
      passos_ia: passos,
    })

    return NextResponse.json({
      success: true,
      lead_id: lead.id,
      score,
      resumo_ia,
      riscos,
      passos,
      answers,
    })

  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
