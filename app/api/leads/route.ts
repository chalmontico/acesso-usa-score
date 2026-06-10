import { NextRequest, NextResponse } from 'next/server'
import { calcScore, getRiscos, getPassos, Answers } from '@/lib/score'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const answers: Answers = body.answers

    const score = calcScore(answers)
    const riscos = getRiscos(answers, score)
    const passos = getPassos(answers, score)

    const resumo_ia = `A empresa ${answers.empresa} do segmento ${answers.segmento} obteve ${score.total} pontos. Nível ${score.nivel}: ${score.nivel_label}.`

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const { data: lead } = await supabase
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

      if (lead) {
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
      }
    } catch (dbError) {
      console.log('DB Error (non-fatal):', dbError)
    }

    return NextResponse.json({
      success: true,
      lead_id: 'temp-' + Date.now(),
      diagnostico_id: 'temp-' + Date.now(),
      score,
      resumo_ia,
      riscos,
      passos,
      answers,
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
