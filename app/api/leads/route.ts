import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import OpenAI from 'openai'
import { calcScore, getRiscos, getPassos, Answers } from '@/lib/score'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const answers: Answers = body.answers
    const supabase = getServiceClient()

    // 1. Salva o lead
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

    if (leadError) throw leadError

    // 2. Calcula score
    const score = calcScore(answers)
    const riscos = getRiscos(answers, score)
    const passos = getPassos(answers, score)

    // 3. Gera resumo com OpenAI
    let resumo_ia = ''
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 400,
        messages: [{
          role: 'system',
          content: 'Você é um especialista em internacionalização de empresas brasileiras para os EUA. Escreva em português brasileiro, de forma direta, profissional e estratégica. Sem juridiquês. Máximo 3 parágrafos curtos.'
        }, {
          role: 'user',
          content: `Analise esta empresa e escreva um resumo personalizado do diagnóstico:
Empresa: ${answers.empresa}
Segmento: ${answers.segmento}
Faturamento: ${answers.faturamento}
Score total: ${score.total}/100
Nível: ${score.nivel} - ${score.nivel_label}
Marca registrada no Brasil: ${answers.marca_brasil}
Pesquisou marca nos EUA: ${answers.marca_pesquisou_eua}
Já tem empresa nos EUA: ${answers.empresa_eua}
Já vende fora do Brasil: ${answers.vende_fora}
Tem clientes nos EUA: ${answers.clientes_eua}
Tem produto para americanos: ${answers.produto_americanos}
Prazo para entrar nos EUA: ${answers.prazo}
Scores: Marca ${score.marca}/20 | Estrutura ${score.estrutura}/20 | Financeiro ${score.financeiro}/15 | Produto ${score.produto}/15 | Comercial ${score.comercial}/15 | Timing ${score.timing}/15

Escreva um resumo analítico citando especificamente o segmento e os dados da empresa. Seja direto sobre o que está bom e o que precisa melhorar.`
        }]
      })
      resumo_ia = completion.choices[0]?.message?.content || ''
    } catch (e) {
      resumo_ia = `A empresa ${answers.empresa} está no ${score.nivel_label} com ${score.total} pontos. O diagnóstico identificou oportunidades claras de melhoria antes da entrada no mercado americano.`
    }

    // 4. Salva diagnóstico
    const { data: diagnostico, error: diagError } = await supabase
      .from('diagnosticos')
      .insert({
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
      .select()
      .single()

    if (diagError) throw diagError

    return NextResponse.json({
      success: true,
      lead_id: lead.id,
      diagnostico_id: diagnostico.id,
      score,
      resumo_ia,
      riscos,
      passos,
    })

  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
