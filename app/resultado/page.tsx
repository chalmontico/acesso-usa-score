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

  const { score, resumo_ia, riscos, passos, answers } = data
  const s = { black:'#060810',dark:'#0D0F18',surface:'#111420',blue:'#1E6FFF',blueLight:'#3FA9F5',white:'#F0F4FF',whiteDim:'rgba(240,244,255,0.7)',whiteMuted:'rgba(240,244,255,0.35)' }

  const nivelColors: Record<number,string> = { 1:'#EF4444', 2:'#F59E0B', 3:'#3B82F6', 4:'#22C55E' }
  const cor = nivelColors[score.nivel] || s.blue
  const circ = 2 * Math.PI * 44
  const dash = circ - (score.total / 100) * circ

  const roadmap = [
    ['01','Proteção de Marca','Pesquisa no USPTO, avaliação de risco de conflito e conexão com advogado licenciado nos EUA quando necessário.'],
    ['02','Estrutura Americana','Definição entre LLC ou Corporation, abertura, EIN, endereço comercial e conta bancária nos EUA.'],
    ['03','Entrada Comercial','Posicionamento, site em inglês, oferta adaptada e estratégia de aquisição de clientes americanos.'],
    ['04','Conexões Estratégicas','Networking, eventos nos EUA, Acesso Black e rodadas de negócios com empresários americanos.'],
  ]

  const categories = [
    ['Marca e Proteção', score.marca, 20],
    ['Estrutura Americana', score.estrutura, 20],
    ['Cap. Financeira', score.financeiro, 15],
    ['Produto Internacional', score.produto, 15],
    ['Estrutura Comercial', score.comercial, 15],
    ['Timing e Intenção', score.timing, 15],
  ]

  return (
    <div style={{minHeight:'100vh',background:s.black,padding:'2rem 1.5rem'}}>
      {/* Header */}
      <div style={{textAlign:'center',marginBottom:'3rem',maxWidth:'720px',margin:'0 auto 3rem'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'2rem'}}>
          <span style={{fontFamily:'Inter,sans-serif',fontSize:'1.1rem',fontWeight:300,color:s.white}}>Acesso</span>
          <span style={{fontFamily:'Inter,sans-serif',fontSize:'1.1rem',fontWeight:600,background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginLeft:'0.3rem'}}>USA</span>
        </div>
        <p style={{fontSize:'0.6rem',letterSpacing:'0.35em',textTransform:'uppercase',color:s.whiteMuted,marginBottom:'0.8rem'}}>Diagnóstico completo</p>
        <h1 style={{fontFamily:'Inter,sans-serif',fontSize:'clamp(1.6rem,4vw,2.8rem)',fontWeight:200,letterSpacing:'-0.03em',marginBottom:'0.5rem'}}>{answers?.empresa}</h1>
        <p style={{fontSize:'0.75rem',color:s.whiteMuted}}>{answers?.segmento} · {new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      <div style={{maxWidth:'720px',margin:'0 auto'}}>
        {/* Score ring */}
        <div style={{background:s.surface,border:'1px solid rgba(30,111,255,0.1)',borderRadius:'4px',padding:'2.5rem 2rem',textAlign:'center',marginBottom:'1rem'}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'1.5rem'}}>
            <div style={{position:'relative',width:'180px',height:'180px'}}>
              <svg width="180" height="180" style={{transform:'rotate(-90deg)'}}>
                <circle cx="90" cy="90" r="44" fill="none" stroke="rgba(30,111,255,0.08)" strokeWidth="8"/>
                <circle cx="90" cy="90" r="44" fill="none" stroke={cor} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={circ} strokeDashoffset={dash} style={{transition:'stroke-dashoffset 2s ease'}}/>
              </svg>
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <span style={{fontFamily:'Inter,sans-serif',fontSize:'2.8rem',fontWeight:200,letterSpacing:'-0.05em',color:s.white,lineHeight:1}}>{score.total}</span>
                <span style={{fontSize:'0.6rem',letterSpacing:'0.2em',textTransform:'uppercase',color:s.whiteMuted}}>score</span>
              </div>
            </div>
            <div style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',padding:'0.4rem 1rem',borderRadius:'100px',border:`1px solid ${cor}40`,background:`${cor}15`,fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:cor}}>
              Nível {score.nivel}: {score.nivel_label}
            </div>
            {resumo_ia && <p style={{fontSize:'0.85rem',color:s.whiteDim,lineHeight:1.8,maxWidth:'540px',textAlign:'center'}}>{resumo_ia}</p>}
          </div>
        </div>

        {/* Score bars */}
        <div style={{background:s.surface,border:'1px solid rgba(30,111,255,0.1)',borderRadius:'4px',padding:'2rem',marginBottom:'1rem'}}>
          <p style={{fontSize:'0.6rem',letterSpacing:'0.25em',textTransform:'uppercase',color:s.whiteMuted,marginBottom:'1.5rem'}}>Score por categoria</p>
          {categories.map(([label, val, max]) => (
            <div key={label as string} style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1rem'}}>
              <span style={{fontSize:'0.75rem',color:s.whiteDim,width:'170px',flexShrink:0}}>{label as string}</span>
              <div style={{flex:1,height:'2px',background:'rgba(255,255,255,0.06)',borderRadius:'1px',overflow:'hidden'}}>
                <div style={{height:'100%',width:`${(Number(val)/Number(max))*100}%`,background:'linear-gradient(90deg,#1252CC,#2178FF)',borderRadius:'1px',transition:'width 1.4s ease'}}></div>
              </div>
              <span style={{fontSize:'0.72rem',color:s.blueLight,fontWeight:500,width:'34px',textAlign:'right'}}>{val}/{max}</span>
            </div>
          ))}
        </div>

        {/* Riscos */}
        <div style={{background:s.surface,border:'1px solid rgba(30,111,255,0.1)',borderRadius:'4px',padding:'2rem',marginBottom:'1rem'}}>
          <p style={{fontSize:'0.6rem',letterSpacing:'0.25em',textTransform:'uppercase',color:s.whiteMuted,marginBottom:'1.2rem'}}>⚠ Principais riscos identificados</p>
          {riscos?.map((r: string, i: number) => (
            <div key={i} style={{borderLeft:'2px solid #EF4444',background:'rgba(239,68,68,0.05)',borderRadius:'0 2px 2px 0',padding:'1rem 1.2rem',marginBottom:'0.7rem'}}>
              <p style={{fontSize:'0.82rem',color:s.whiteDim,lineHeight:1.6}}>{r}</p>
            </div>
          ))}
        </div>

        {/* Passos */}
        <div style={{background:s.surface,border:'1px solid rgba(30,111,255,0.1)',borderRadius:'4px',padding:'2rem',marginBottom:'1rem'}}>
          <p style={{fontSize:'0.6rem',letterSpacing:'0.25em',textTransform:'uppercase',color:s.whiteMuted,marginBottom:'1.2rem'}}>✓ Próximos passos recomendados</p>
          {passos?.map((p: string, i: number) => (
            <div key={i} style={{borderLeft:'2px solid #22C55E',background:'rgba(34,197,94,0.05)',borderRadius:'0 2px 2px 0',padding:'1rem 1.2rem',marginBottom:'0.7rem'}}>
              <p style={{fontSize:'0.82rem',color:s.whiteDim,lineHeight:1.6}}>{p}</p>
            </div>
          ))}
        </div>

        {/* Roadmap */}
        <div style={{background:s.surface,border:'1px solid rgba(30,111,255,0.1)',borderRadius:'4px',padding:'2rem',marginBottom:'2rem'}}>
          <p style={{fontSize:'0.6rem',letterSpacing:'0.25em',textTransform:'uppercase',color:s.whiteMuted,marginBottom:'2rem'}}>🗺 Seu roadmap para os EUA</p>
          {roadmap.map(([n,t,d], i) => (
            <div key={n} style={{display:'flex',gap:'1.2rem',marginBottom:i<roadmap.length-1?'2rem':'0',position:'relative'}}>
              {i < roadmap.length-1 && <div style={{position:'absolute',left:'16px',top:'36px',bottom:'-2rem',width:'1px',background:'linear-gradient(to bottom,rgba(30,111,255,0.3),transparent)'}}></div>}
              <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#1252CC,#2178FF)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'0.6rem',fontWeight:700,color:'white',zIndex:1}}>0{i+1}</div>
              <div style={{paddingTop:'6px'}}>
                <div style={{fontWeight:500,fontSize:'0.9rem',marginBottom:'0.4rem'}}>{t}</div>
                <p style={{fontSize:'0.78rem',color:s.whiteDim,lineHeight:1.6}}>{d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{borderRadius:'4px',padding:'3rem 2rem',textAlign:'center',background:'linear-gradient(135deg,rgba(30,111,255,0.1),rgba(30,111,255,0.05))',border:'1px solid rgba(30,111,255,0.2)',marginBottom:'2rem',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',width:'400px',height:'300px',background:'radial-gradient(ellipse,rgba(30,111,255,0.1) 0%,transparent 70%)',top:'-100px',right:'-100px',filter:'blur(60px)',pointerEvents:'none'}}></div>
          <div style={{position:'relative',zIndex:1}}>
            <div style={{fontSize:'0.6rem',letterSpacing:'0.25em',textTransform:'uppercase',color:s.blueLight,marginBottom:'1rem'}}>Próximo passo</div>
            <h2 style={{fontFamily:'Inter,sans-serif',fontSize:'clamp(1.4rem,3vw,2.2rem)',fontWeight:200,letterSpacing:'-0.03em',marginBottom:'1rem'}}>Quer transformar esse diagnóstico em um plano real?</h2>
            <p style={{fontSize:'0.85rem',color:s.whiteDim,lineHeight:1.8,marginBottom:'0.5rem'}}><strong style={{color:s.white}}>Acesso USA Roadmap</strong> — Reunião estratégica de 45 minutos</p>
            <p style={{fontSize:'0.78rem',color:s.whiteMuted,marginBottom:'2rem'}}>Análise da sua empresa · Plano de ação · Próximos passos concretos</p>
            <div style={{marginBottom:'1.5rem'}}>
              <div style={{fontSize:'0.82rem',color:s.whiteMuted,textDecoration:'line-through'}}>US$297</div>
              <div style={{fontFamily:'Inter,sans-serif',fontSize:'3rem',fontWeight:200,letterSpacing:'-0.05em',background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',lineHeight:1}}>US$197</div>
            </div>
            <button className="btn-primary" style={{fontSize:'0.68rem',padding:'1rem 2.5rem'}}>Agendar minha reunião →</button>
            <p style={{marginTop:'1rem',fontSize:'0.68rem',color:s.whiteMuted}}>Vagas limitadas · Sem juridiquês · Orientação estratégica real</p>
          </div>
        </div>

        <p style={{textAlign:'center',fontSize:'0.65rem',color:s.whiteMuted,lineHeight:1.8,paddingBottom:'3rem'}}>
          Este diagnóstico é uma orientação estratégica inicial e não constitui consultoria jurídica, contábil ou migratória.<br/>
          Para registro de marca nos EUA, estrangeiros normalmente precisam de advogado licenciado perante o USPTO.
        </p>
      </div>
    </div>
  )
}
