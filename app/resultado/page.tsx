'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Resultado() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('acesso_resultado')
    if (!stored) { router.push('/quiz'); return }
    setData(JSON.parse(stored))
  }, [])

  if (!data) return (
    <div style={{minHeight:'100vh',background:'#060810',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{width:'40px',height:'40px',border:'2px solid rgba(30,111,255,0.2)',borderTopColor:'#1E6FFF',borderRadius:'50%',animation:'spin 1s linear infinite'}}></div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const { score, nivel, answers } = data
  const s = {
    black:'#060810', surface:'#111420', blue:'#1E6FFF',
    blueLight:'#3FA9F5', white:'#F0F4FF',
    whiteDim:'rgba(240,244,255,0.7)', whiteMuted:'rgba(240,244,255,0.35)'
  }

  const getCor = (n: string) => {
    if (n === 'Pronto para Expandir') return '#22C55E'
    if (n === 'Em Desenvolvimento') return '#3B82F6'
    if (n === 'Iniciando Jornada') return '#F59E0B'
    return '#EF4444'
  }
  const cor = getCor(nivel)
  const circ = 2 * Math.PI * 44
  const dash = circ - (score / 100) * circ

  const sim = (k: string) => answers?.[k] === 'Sim'
  const marcaScore = (sim('marca_brasil') ? 7 : 0) + (sim('marca_pesquisou_eua') ? 13 : 0)
  const estruturaScore = (sim('empresa_eua') ? 12 : 0) + (sim('ein') ? 4 : 0) + (sim('conta_eua') ? 4 : 0)
  const financeiroScore = answers?.faturamento === 'Acima de R$20 milhões' ? 15 : answers?.faturamento === 'R$5 milhões a R$20 milhões' ? 12 : answers?.faturamento === 'R$1 milhão a R$5 milhões' ? 8 : answers?.faturamento === 'R$500 mil a R$1 milhão' ? 4 : 0
  const produtoScore = (sim('vende_fora') ? 5 : 0) + (sim('clientes_eua') ? 5 : 0) + (answers?.produto_americanos === 'Sim' ? 5 : 0)
  const comercialScore = (sim('site_profissional') ? 4 : 0) + (sim('equipe_comercial') ? 3 : 0) + (sim('material_ingles') ? 4 : 0) + (sim('fala_ingles') ? 4 : 0)
  const timingScore = (sim('visitou_eua') ? 8 : 0) + (answers?.prazo === '0 a 3 meses' ? 7 : answers?.prazo === '3 a 6 meses' ? 5 : 3)

  const categories: [string, number, number][] = [
    ['Marca e Proteção', marcaScore, 20],
    ['Estrutura Americana', estruturaScore, 20],
    ['Cap. Financeira', Math.min(financeiroScore, 15), 15],
    ['Produto Internacional', Math.min(produtoScore, 15), 15],
    ['Estrutura Comercial', Math.min(comercialScore, 15), 15],
    ['Timing e Intenção', Math.min(timingScore, 15), 15],
  ]

  const riscos: string[] = []
  if (!sim('marca_brasil')) riscos.push('Marca não registrada no Brasil — risco de conflito ao expandir para os EUA.')
  if (!sim('marca_pesquisou_eua')) riscos.push('Disponibilidade da marca nos EUA não verificada — pode haver conflito com marcas existentes.')
  if (!sim('empresa_eua')) riscos.push('Sem estrutura jurídica nos EUA — necessário abrir LLC ou Corporation para operar legalmente.')
  if (!sim('conta_eua')) riscos.push('Sem conta bancária nos EUA — dificulta recebimentos e operações financeiras americanas.')
  if (!sim('material_ingles')) riscos.push('Sem materiais em inglês — limita a capacidade de conquistar clientes americanos.')

  const passos: string[] = []
  if (!sim('marca_pesquisou_eua')) passos.push('Pesquise a disponibilidade da sua marca no USPTO (uspto.gov) antes de qualquer investimento.')
  if (!sim('empresa_eua')) passos.push('Abra uma LLC nos EUA — processo pode ser feito remotamente em 2-4 semanas.')
  if (!sim('ein')) passos.push('Solicite o EIN (número fiscal americano) junto ao IRS — necessário para abrir conta bancária.')
  if (!sim('material_ingles')) passos.push('Crie versões em inglês do seu site e materiais de vendas adaptados ao mercado americano.')
  passos.push('Agende uma reunião estratégica com a Acesso USA para definir seu plano de entrada personalizado.')

  const roadmap: [string, string, string][] = [
    ['01','Proteção de Marca','Pesquisa no USPTO, avaliação de risco e conexão com advogado licenciado nos EUA.'],
    ['02','Estrutura Americana','Definição entre LLC ou Corporation, abertura, EIN e conta bancária nos EUA.'],
    ['03','Entrada Comercial','Posicionamento, site em inglês, oferta adaptada e estratégia de aquisição de clientes.'],
    ['04','Conexões Estratégicas','Networking, eventos nos EUA, Acesso Black e rodadas de negócios com empresários americanos.'],
  ]

  const card = {
    background: s.surface,
    border: '1px solid rgba(30,111,255,0.1)',
    borderRadius: '8px',
    padding: 'clamp(1.2rem, 4vw, 2rem)',
    marginBottom: '1rem',
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #060810; color: #F0F4FF; font-family: 'DM Sans', sans-serif; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .cat-label { font-size: 0.75rem; color: rgba(240,244,255,0.7); flex-shrink: 0; }
        @media (max-width: 480px) {
          .cat-label { font-size: 0.68rem; width: 110px !important; }
          .resultado-header { font-size: clamp(1.2rem, 6vw, 1.8rem) !important; }
        }
      `}</style>

      <div style={{minHeight:'100vh',background:s.black,padding:'1.5rem 1rem'}}>
        <div style={{maxWidth:'720px',margin:'0 auto'}}>

          {/* Header */}
          <div style={{textAlign:'center',marginBottom:'2rem'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'1.5rem'}}>
              <span style={{fontFamily:'Inter,sans-serif',fontSize:'1.1rem',fontWeight:300,color:s.white}}>Acesso</span>
              <span style={{fontFamily:'Inter,sans-serif',fontSize:'1.1rem',fontWeight:600,background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginLeft:'0.3rem'}}>USA</span>
            </div>
            <p style={{fontSize:'0.6rem',letterSpacing:'0.35em',textTransform:'uppercase',color:s.whiteMuted,marginBottom:'0.6rem',marginTop:0}}>Diagnóstico completo</p>
            <h1 className="resultado-header" style={{fontFamily:'Inter,sans-serif',fontSize:'clamp(1.4rem,5vw,2.4rem)',fontWeight:200,letterSpacing:'-0.03em',marginBottom:'0.4rem',marginTop:0}}>{answers?.nome || answers?.empresa}</h1>
            <p style={{fontSize:'0.75rem',color:s.whiteMuted,marginTop:0}}>{answers?.segmento} · {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          {/* Score ring */}
          <div style={{...card,textAlign:'center'}}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'1.2rem'}}>
              <div style={{position:'relative',width:'160px',height:'160px'}}>
                <svg width="160" height="160" style={{transform:'rotate(-90deg)'}}>
                  <circle cx="80" cy="80" r="44" fill="none" stroke="rgba(30,111,255,0.08)" strokeWidth="8"/>
                  <circle cx="80" cy="80" r="44" fill="none" stroke={cor} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circ} strokeDashoffset={dash} style={{transition:'stroke-dashoffset 2s ease'}}/>
                </svg>
                <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                  <span style={{fontFamily:'Inter,sans-serif',fontSize:'2.6rem',fontWeight:200,letterSpacing:'-0.05em',color:s.white,lineHeight:1}}>{score}</span>
                  <span style={{fontSize:'0.6rem',letterSpacing:'0.2em',textTransform:'uppercase',color:s.whiteMuted}}>score</span>
                </div>
              </div>
              <div style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',padding:'0.4rem 1rem',borderRadius:'100px',border:`1px solid ${cor}40`,background:`${cor}15`,fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:cor}}>
                {nivel}
              </div>
            </div>
          </div>

          {/* Score bars */}
          <div style={card}>
            <p style={{fontSize:'0.6rem',letterSpacing:'0.25em',textTransform:'uppercase',color:s.whiteMuted,marginBottom:'1.2rem',marginTop:0}}>Score por categoria</p>
            {categories.map(([label, val, max]) => (
              <div key={label} style={{display:'flex',alignItems:'center',gap:'0.8rem',marginBottom:'0.9rem'}}>
                <span className="cat-label" style={{width:'150px'}}>{label}</span>
                <div style={{flex:1,height:'2px',background:'rgba(255,255,255,0.06)',borderRadius:'1px',overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${(val/max)*100}%`,background:'linear-gradient(90deg,#1252CC,#2178FF)',borderRadius:'1px',transition:'width 1.4s ease'}}></div>
                </div>
                <span style={{fontSize:'0.72rem',color:s.blueLight,fontWeight:500,width:'34px',textAlign:'right',flexShrink:0}}>{val}/{max}</span>
              </div>
            ))}
          </div>

          {/* Riscos */}
          {riscos.length > 0 && (
            <div style={card}>
              <p style={{fontSize:'0.6rem',letterSpacing:'0.25em',textTransform:'uppercase',color:s.whiteMuted,marginBottom:'1rem',marginTop:0}}>⚠ Principais riscos identificados</p>
              {riscos.map((r, i) => (
                <div key={i} style={{borderLeft:'2px solid #EF4444',background:'rgba(239,68,68,0.05)',borderRadius:'0 4px 4px 0',padding:'0.9rem 1rem',marginBottom:'0.6rem'}}>
                  <p style={{fontSize:'0.82rem',color:s.whiteDim,lineHeight:1.6,margin:0}}>{r}</p>
                </div>
              ))}
            </div>
          )}

          {/* Passos */}
          <div style={card}>
            <p style={{fontSize:'0.6rem',letterSpacing:'0.25em',textTransform:'uppercase',color:s.whiteMuted,marginBottom:'1rem',marginTop:0}}>✓ Próximos passos recomendados</p>
            {passos.map((p, i) => (
              <div key={i} style={{borderLeft:'2px solid #22C55E',background:'rgba(34,197,94,0.05)',borderRadius:'0 4px 4px 0',padding:'0.9rem 1rem',marginBottom:'0.6rem'}}>
                <p style={{fontSize:'0.82rem',color:s.whiteDim,lineHeight:1.6,margin:0}}>{p}</p>
              </div>
            ))}
          </div>

          {/* Roadmap */}
          <div style={card}>
            <p style={{fontSize:'0.6rem',letterSpacing:'0.25em',textTransform:'uppercase',color:s.whiteMuted,marginBottom:'1.8rem',marginTop:0}}>🗺 Seu roadmap para os EUA</p>
            {roadmap.map(([n,t,d], i) => (
              <div key={n} style={{display:'flex',gap:'1rem',marginBottom:i<roadmap.length-1?'1.8rem':'0',position:'relative'}}>
                {i < roadmap.length-1 && <div style={{position:'absolute',left:'15px',top:'34px',bottom:'-1.8rem',width:'1px',background:'linear-gradient(to bottom,rgba(30,111,255,0.3),transparent)'}}></div>}
                <div style={{width:'30px',height:'30px',minWidth:'30px',borderRadius:'50%',background:'linear-gradient(135deg,#1252CC,#2178FF)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.58rem',fontWeight:700,color:'white',zIndex:1}}>{n}</div>
                <div style={{paddingTop:'4px'}}>
                  <div style={{fontWeight:500,fontSize:'0.88rem',marginBottom:'0.3rem'}}>{t}</div>
                  <p style={{fontSize:'0.78rem',color:s.whiteDim,lineHeight:1.6,margin:0}}>{d}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{borderRadius:'8px',padding:'clamp(1.5rem,5vw,3rem) clamp(1rem,4vw,2rem)',textAlign:'center',background:'linear-gradient(135deg,rgba(30,111,255,0.1),rgba(30,111,255,0.05))',border:'1px solid rgba(30,111,255,0.2)',marginBottom:'2rem',position:'relative',overflow:'hidden'}}>
            <div style={{fontSize:'0.6rem',letterSpacing:'0.25em',textTransform:'uppercase',color:s.blueLight,marginBottom:'0.8rem'}}>Próximo passo</div>
            <h2 style={{fontFamily:'Inter,sans-serif',fontSize:'clamp(1.2rem,4vw,2rem)',fontWeight:200,letterSpacing:'-0.03em',marginBottom:'0.8rem',marginTop:0}}>Quer transformar esse diagnóstico em um plano real?</h2>
            <p style={{fontSize:'0.85rem',color:s.whiteDim,lineHeight:1.7,marginBottom:'0.4rem'}}><strong style={{color:s.white}}>Acesso USA Roadmap</strong> — Reunião estratégica de 45 minutos</p>
            <p style={{fontSize:'0.78rem',color:s.whiteMuted,marginBottom:'1.5rem'}}>Análise da sua empresa · Plano de ação · Próximos passos concretos</p>
            <div style={{marginBottom:'1.2rem'}}>
              <div style={{fontSize:'0.82rem',color:s.whiteMuted,textDecoration:'line-through'}}>US$297</div>
              <div style={{fontFamily:'Inter,sans-serif',fontSize:'clamp(2rem,8vw,3rem)',fontWeight:200,letterSpacing:'-0.05em',background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',lineHeight:1}}>US$197</div>
            </div>
            <a href="https://calendly.com/acessoo/45" target="_blank" rel="noopener noreferrer" style={{display:'inline-block',background:'linear-gradient(135deg,#0A3D91,#1E6FFF)',border:'none',borderRadius:'4px',padding:'1rem 2rem',color:'white',fontFamily:'DM Sans,sans-serif',fontSize:'0.75rem',letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer',textDecoration:'none',WebkitTapHighlightColor:'transparent'}}>
              Agendar minha reunião →
            </a>
            <p style={{marginTop:'0.8rem',fontSize:'0.68rem',color:s.whiteMuted}}>Vagas limitadas · Sem juridiquês · Orientação estratégica real</p>
          </div>

          <p style={{textAlign:'center',fontSize:'0.65rem',color:s.whiteMuted,lineHeight:1.8,paddingBottom:'2rem'}}>
            Este diagnóstico é uma orientação estratégica inicial e não constitui consultoria jurídica, contábil ou migratória.<br/>
            Para registro de marca nos EUA, estrangeiros normalmente precisam de advogado licenciado perante o USPTO.
          </p>
        </div>
      </div>
    </>
  )
}
