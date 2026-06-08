'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const goQuiz = () => router.push('/quiz')

  return (
    <>
      {/* MOBILE MENU */}
      {mobileOpen && (
        <div style={{position:'fixed',inset:0,background:'rgba(6,8,16,0.98)',backdropFilter:'blur(16px)',zIndex:299,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'2.5rem'}}>
          <button onClick={() => setMobileOpen(false)} style={{position:'absolute',top:'1.5rem',right:'5vw',background:'none',border:'none',color:'rgba(240,244,255,0.7)',fontSize:'1.5rem',cursor:'pointer'}}>✕</button>
          {['#diagnostico','#como','#roadmap','#faq'].map((href, i) => (
            <a key={i} href={href} onClick={() => setMobileOpen(false)} style={{fontSize:'1.1rem',fontWeight:300,letterSpacing:'0.1em',textTransform:'uppercase',color:'rgba(240,244,255,0.7)',textDecoration:'none'}}>
              {['Diagnóstico','Como funciona','Roadmap','FAQ'][i]}
            </a>
          ))}
          <button className="btn-primary" onClick={() => { setMobileOpen(false); goQuiz() }}>Iniciar diagnóstico</button>
        </div>
      )}

      {/* NAV */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:200,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1.1rem 5vw',transition:'background 0.4s',background:scrolled?'rgba(6,8,16,0.95)':'transparent',backdropFilter:scrolled?'blur(12px)':'none',borderBottom:scrolled?'1px solid rgba(30,111,255,0.1)':'none'}}>
        <div style={{display:'flex',alignItems:'center',cursor:'pointer'}} onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>
          <span style={{fontFamily:'Inter,sans-serif',fontSize:'1.2rem',fontWeight:300,letterSpacing:'-0.02em',color:'#F0F4FF'}}>Acesso</span>
          <span style={{fontFamily:'Inter,sans-serif',fontSize:'1.2rem',fontWeight:600,letterSpacing:'-0.02em',background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginLeft:'0.3rem'}}>USA</span>
        </div>
        <ul style={{display:'flex',gap:'2rem',listStyle:'none',position:'absolute',left:'50%',transform:'translateX(-50%)'}}>
          {[['#diagnostico','Diagnóstico'],['#como','Como funciona'],['#roadmap','Roadmap'],['#faq','FAQ']].map(([href,label]) => (
            <li key={href}><a href={href} style={{fontSize:'0.68rem',fontWeight:400,letterSpacing:'0.15em',textTransform:'uppercase',color:'rgba(240,244,255,0.7)',textDecoration:'none'}}>{label}</a></li>
          ))}
        </ul>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <button className="btn-primary" style={{padding:'0.7rem 1.6rem',fontSize:'0.62rem'}} onClick={goQuiz}>Iniciar diagnóstico</button>
          <button onClick={() => setMobileOpen(true)} style={{display:'none',flexDirection:'column',gap:'5px',cursor:'pointer',background:'none',border:'none',padding:'4px'}} className="hamburger">
            <span style={{display:'block',width:'22px',height:'1.5px',background:'rgba(240,244,255,0.7)',borderRadius:'2px'}}></span>
            <span style={{display:'block',width:'22px',height:'1.5px',background:'rgba(240,244,255,0.7)',borderRadius:'2px'}}></span>
            <span style={{display:'block',width:'22px',height:'1.5px',background:'rgba(240,244,255,0.7)',borderRadius:'2px'}}></span>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{position:'relative',minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 5vw',overflow:'hidden'}}>
        {/* Flag scene */}
        <div style={{position:'absolute',right:0,top:0,bottom:0,width:'55%',zIndex:0,overflow:'hidden'}}>
          <svg viewBox="0 0 520 340" style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',opacity:0.2,animation:'flagWave 7s ease-in-out infinite',width:'100%',height:'auto'}}>
            <rect width="520" height="340" fill="#B22234"/>
            {[0,52.3,104.6,156.9,209.23,261.53,313.84].map((y,i) => <rect key={i} y={y} width="520" height="26.15" fill="#FFFFFF"/>)}
            {[26.15,78.46,130.76,183.07,235.38,287.69].map((y,i) => <rect key={i} y={y} width="520" height="26.15" fill="#B22234"/>)}
            <rect width="208" height="183.07" fill="#3C3B6E"/>
            <g fill="white" opacity="0.9">
              {[20,44,68,92,116,140,163].map((cy,ri) => 
                [20,52,84,116,148,180].filter((_,ci) => !(ri%2===1 && ci===5)).map((cx,ci) => (
                  ri%2===1 ? [36,68,100,132,164].includes(cx) && <circle key={`${ri}-${ci}`} cx={cx} cy={cy} r="5"/> : <circle key={`${ri}-${ci}`} cx={cx} cy={cy} r="5"/>
                ))
              )}
            </g>
          </svg>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(6,8,16,1) 0%,rgba(6,8,16,0.7) 35%,rgba(6,8,16,0.2) 70%,rgba(6,8,16,0.4) 100%)',zIndex:3}}></div>
          <div style={{position:'absolute',inset:0,background:'rgba(10,30,80,0.3)',zIndex:4}}></div>
        </div>

        {/* Grid */}
        <div style={{position:'absolute',inset:0,zIndex:1,backgroundImage:'linear-gradient(rgba(30,111,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(30,111,255,0.04) 1px,transparent 1px)',backgroundSize:'60px 60px',pointerEvents:'none'}}></div>

        {/* Glow */}
        <div style={{position:'absolute',width:'500px',height:'400px',background:'radial-gradient(ellipse,rgba(30,111,255,0.12) 0%,transparent 70%)',top:'10%',right:'8%',borderRadius:'50%',filter:'blur(100px)',animation:'pulseGlow 6s ease-in-out infinite alternate'}}></div>

        {/* Content */}
        <div style={{position:'relative',zIndex:10,maxWidth:'820px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'1rem',fontSize:'0.62rem',fontWeight:400,letterSpacing:'0.4em',textTransform:'uppercase',color:'#3FA9F5',marginBottom:'2rem',animation:'fadeUp 0.8s 0.3s both'}}>
            <span style={{display:'flex',gap:'6px'}}>
              {[0,300,600].map(d => <span key={d} style={{display:'block',width:'5px',height:'5px',borderRadius:'50%',background:'#1E6FFF',animation:`pulseDot 2s ${d}ms infinite`}}></span>)}
            </span>
            Diagnóstico estratégico · 100% gratuito · 3 minutos
          </div>

          <h1 style={{fontFamily:'Inter,sans-serif',fontSize:'clamp(2.4rem,6.5vw,6rem)',fontWeight:200,lineHeight:1.08,letterSpacing:'-0.04em',marginBottom:'1.8rem',animation:'fadeUp 0.9s 0.5s both'}}>
            Sua empresa está<br/>pronta para os<br/>
            <span style={{fontWeight:600,background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Estados Unidos?</span>
          </h1>

          <p style={{fontSize:'1rem',fontWeight:300,color:'rgba(240,244,255,0.7)',maxWidth:'500px',lineHeight:1.85,marginBottom:'3rem',animation:'fadeUp 0.9s 0.7s both'}}>
            Descubra em 3 minutos seu nível de preparação para proteger sua marca, abrir empresa e vender no mercado americano.
          </p>

          <div style={{display:'flex',gap:'1.2rem',flexWrap:'wrap',animation:'fadeUp 0.9s 0.9s both'}}>
            <button className="btn-primary" onClick={goQuiz}>Começar diagnóstico gratuito</button>
            <a href="#como" className="btn-ghost">Como funciona</a>
          </div>
        </div>

        {/* Scroll */}
        <div style={{position:'absolute',bottom:'3rem',left:'5vw',zIndex:10,display:'flex',alignItems:'center',gap:'1rem',animation:'fadeUp 0.9s 1.3s both'}}>
          <div style={{width:'1px',height:'50px',background:'linear-gradient(to bottom,transparent,#1E6FFF,transparent)',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:'-10px',left:0,width:'1px',height:'20px',background:'#3FA9F5',animation:'scrollDrop 1.5s ease-in-out infinite'}}></div>
          </div>
          <span style={{fontSize:'0.55rem',letterSpacing:'0.35em',textTransform:'uppercase',color:'rgba(240,244,255,0.35)',writingMode:'vertical-lr'}}>Scroll</span>
        </div>
      </section>

      {/* STATS */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',background:'#111420',borderTop:'1px solid rgba(30,111,255,0.15)',borderBottom:'1px solid rgba(30,111,255,0.08)'}}>
        {[['3','minutos para completar'],['6','dimensões avaliadas'],['100','pontos no score'],['4','níveis de preparação']].map(([n,l]) => (
          <div key={l} style={{padding:'3rem 1.5rem',textAlign:'center',borderRight:'1px solid rgba(30,111,255,0.08)'}}>
            <span style={{fontFamily:'Inter,sans-serif',fontSize:'clamp(2rem,3vw,3rem)',fontWeight:300,letterSpacing:'-0.03em',display:'block',lineHeight:1,marginBottom:'0.6rem',background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{n}</span>
            <span style={{fontSize:'0.6rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(240,244,255,0.35)'}}>{l}</span>
          </div>
        ))}
      </div>

      {/* PROBLEM */}
      <section id="diagnostico" style={{padding:'7rem 5vw',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'center',position:'relative',overflow:'hidden'}}>
        <div>
          <div style={{fontFamily:'Inter,sans-serif',fontSize:'clamp(1.5rem,3vw,2.8rem)',fontWeight:200,lineHeight:1.3,color:'#F0F4FF',borderLeft:'2px solid #1E6FFF',paddingLeft:'2rem'}}>
            Muitos empresários querem entrar nos EUA.<br/>
            <span style={{color:'#3FA9F5',fontWeight:600}}>Poucos sabem exatamente por onde começar.</span>
          </div>
        </div>
        <div>
          <div className="section-tag">Os principais riscos</div>
          <ul style={{listStyle:'none',marginTop:'1.5rem'}}>
            {[
              'Marca registrada por outra empresa nos EUA antes de você chegar ao mercado',
              'Estrutura jurídica inadequada para o modelo de negócio pretendido nos EUA',
              'Investimento em operação antes de validar produto e mercado americano',
              'Ausência de estratégia comercial adaptada à cultura e ao público americano'
            ].map((text, i) => (
              <li key={i} style={{display:'flex',alignItems:'flex-start',gap:'1rem',padding:'1.1rem 0',borderBottom:'1px solid rgba(30,111,255,0.07)'}}>
                <div style={{width:'32px',height:'32px',borderRadius:'6px',flexShrink:0,background:'rgba(30,111,255,0.08)',border:'1px solid rgba(30,111,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',marginTop:'2px'}}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#3FA9F5" strokeWidth="2"><path d="M8 2v8M8 13v1" strokeLinecap="round"/></svg>
                </div>
                <span style={{fontSize:'0.85rem',color:'rgba(240,244,255,0.7)',lineHeight:1.6}}>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* DELIVERS */}
      <section style={{padding:'7rem 5vw',background:'#111420',position:'relative',overflow:'hidden'}}>
        <div style={{maxWidth:'1060px',margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'start'}}>
            <div>
              <div className="section-tag">O que o diagnóstico entrega</div>
              <h2 style={{fontFamily:'Inter,sans-serif',fontSize:'clamp(1.7rem,4vw,3.5rem)',fontWeight:200,lineHeight:1.15,marginBottom:'1.2rem',letterSpacing:'-0.025em'}}>
                Em 3 minutos, um relatório <span style={{fontWeight:600,background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>completo da sua empresa</span>
              </h2>
              <p style={{fontSize:'0.9rem',lineHeight:1.9,color:'rgba(240,244,255,0.7)'}}>Análise personalizada por IA em 6 dimensões estratégicas. Cada resultado é único — gerado com base nas suas respostas.</p>
            </div>
            <div>
              {[
                ['01','Score 0–100','Avaliação em 6 dimensões com pontuação por categoria'],
                ['02','Principais riscos','Os 3 pontos críticos antes de entrar no mercado americano'],
                ['03','Próximos passos','Ações concretas e priorizadas para o seu momento atual'],
                ['04','Roadmap EUA','4 etapas personalizadas para entrada segura no mercado'],
                ['05','Reunião estratégica','Convite para aprofundar o plano com especialistas'],
              ].map(([n,t,d]) => (
                <div key={n} style={{display:'flex',alignItems:'flex-start',gap:'1.2rem',padding:'1.2rem 0',borderBottom:'1px solid rgba(30,111,255,0.07)'}}>
                  <span style={{fontSize:'0.7rem',fontWeight:600,color:'#3FA9F5',letterSpacing:'0.12em',width:'28px',flexShrink:0,marginTop:'2px'}}>{n}</span>
                  <div>
                    <h4 style={{fontSize:'0.72rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#F0F4FF',marginBottom:'0.25rem'}}>{t}</h4>
                    <p style={{fontSize:'0.8rem',color:'rgba(240,244,255,0.7)',lineHeight:1.6}}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="como" style={{padding:'7rem 5vw',position:'relative',overflow:'hidden'}}>
        <div style={{maxWidth:'1060px',margin:'0 auto'}}>
          <div className="section-tag">Como funciona</div>
          <h2 style={{fontFamily:'Inter,sans-serif',fontSize:'clamp(1.7rem,4vw,3.5rem)',fontWeight:200,lineHeight:1.15,marginBottom:'4rem',letterSpacing:'-0.025em'}}>
            Simples. Rápido. <span style={{fontWeight:600,background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Estrategicamente relevante.</span>
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'2px',background:'rgba(30,111,255,0.06)',border:'1px solid rgba(30,111,255,0.1)',borderRadius:'4px',overflow:'hidden'}}>
            {[
              ['01','Dados da empresa','Nome, segmento, faturamento e momento atual. Menos de 60 segundos.'],
              ['02','Estrutura e marca','CNPJ, registro de marca no Brasil e nos EUA, LLC, EIN e conta bancária.'],
              ['03','Capacidade comercial','Site, equipe, material em inglês e timing para entrada no mercado.'],
              ['04','Receba seu score','Pontuação + riscos + roadmap personalizado gerado por IA em segundos.'],
            ].map(([n,t,d]) => (
              <div key={n} style={{padding:'2.5rem 2rem',background:'#111420'}}>
                <span style={{fontFamily:'Inter,sans-serif',fontSize:'2rem',fontWeight:200,letterSpacing:'-0.04em',background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:'1.2rem',display:'block'}}>{n}</span>
                <div style={{fontSize:'0.72rem',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'#F0F4FF',marginBottom:'0.6rem'}}>{t}</div>
                <p style={{fontSize:'0.8rem',color:'rgba(240,244,255,0.7)',lineHeight:1.7}}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" style={{padding:'7rem 5vw',background:'#0D0F18',position:'relative',overflow:'hidden'}}>
        <div style={{maxWidth:'1060px',margin:'0 auto'}}>
          <div className="section-tag">Roadmap EUA</div>
          <h2 style={{fontFamily:'Inter,sans-serif',fontSize:'clamp(1.7rem,4vw,3.5rem)',fontWeight:200,lineHeight:1.15,marginBottom:'4rem',letterSpacing:'-0.025em'}}>
            As 4 etapas para entrar nos EUA <span style={{fontWeight:600,background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>com estratégia e segurança</span>
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2px',background:'rgba(30,111,255,0.08)',border:'1px solid rgba(30,111,255,0.1)',borderRadius:'4px',overflow:'hidden'}}>
            {[
              ['01','Proteção de Marca','Pesquisa no USPTO, avaliação de risco de conflito e conexão com advogado licenciado nos EUA quando necessário.'],
              ['02','Estrutura Americana','Definição entre LLC ou Corporation, abertura, EIN, endereço comercial e conta bancária nos EUA.'],
              ['03','Entrada Comercial','Posicionamento, site em inglês, oferta adaptada e estratégia de aquisição de clientes americanos.'],
              ['04','Conexões Estratégicas','Networking, eventos nos EUA, Acesso Black e rodadas de negócios com empresários americanos.'],
            ].map(([n,t,d]) => (
              <div key={n} style={{padding:'2.8rem 2.4rem',background:'#0D0F18'}}>
                <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.25em',textTransform:'uppercase',color:'#3FA9F5',marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.6rem'}}>
                  <span style={{display:'block',width:'16px',height:'1px',background:'#3FA9F5'}}></span>
                  Etapa {n}
                </div>
                <div style={{fontFamily:'Inter,sans-serif',fontSize:'1.15rem',fontWeight:300,color:'#F0F4FF',marginBottom:'0.8rem',letterSpacing:'-0.02em'}}>{t}</div>
                <p style={{fontSize:'0.8rem',color:'rgba(240,244,255,0.7)',lineHeight:1.7}}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFER */}
      <section style={{padding:'7rem 5vw',background:'#0D0F18',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',width:'600px',height:'400px',background:'radial-gradient(ellipse,rgba(30,111,255,0.1) 0%,transparent 70%)',top:'50%',left:'50%',transform:'translate(-50%,-50%)',filter:'blur(60px)',pointerEvents:'none'}}></div>
        <div style={{maxWidth:'720px',margin:'0 auto',textAlign:'center',position:'relative',zIndex:2}}>
          <div className="section-tag" style={{justifyContent:'center'}}>Próximo passo</div>
          <h2 style={{fontFamily:'Inter,sans-serif',fontSize:'clamp(1.7rem,4vw,3.5rem)',fontWeight:200,lineHeight:1.15,marginBottom:'1.2rem',letterSpacing:'-0.025em'}}>
            Transforme esse diagnóstico<br/>em um plano real
          </h2>
          <p style={{fontSize:'0.95rem',color:'rgba(240,244,255,0.7)',lineHeight:1.85,maxWidth:'500px',margin:'0 auto 2.5rem'}}>
            <strong style={{color:'#F0F4FF'}}>Acesso USA Roadmap</strong> — Reunião estratégica de 45 minutos com especialistas. Análise completa, plano de ação personalizado e próximos passos concretos.
          </p>
          <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'0.6rem',marginBottom:'2.5rem',textAlign:'left',maxWidth:'380px',margin:'0 auto 2.5rem'}}>
            {['Análise individual da sua empresa e do seu momento','Plano de ação personalizado para entrada nos EUA','Clareza sobre marca, estrutura e estratégia comercial','45 minutos com especialistas Acesso USA'].map(b => (
              <li key={b} style={{fontSize:'0.8rem',color:'rgba(240,244,255,0.7)',display:'flex',gap:'0.7rem',alignItems:'flex-start'}}>
                <span style={{color:'#3FA9F5',fontWeight:600,flexShrink:0}}>✓</span>{b}
              </li>
            ))}
          </ul>
          <div style={{fontSize:'0.85rem',color:'rgba(240,244,255,0.35)',textDecoration:'line-through',marginBottom:'0.5rem'}}>US$297</div>
          <div style={{fontFamily:'Inter,sans-serif',fontSize:'clamp(3rem,7vw,6rem)',fontWeight:200,letterSpacing:'-0.05em',lineHeight:1,background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:'0.5rem'}}>US$197</div>
          <div style={{fontSize:'0.7rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(240,244,255,0.35)',marginBottom:'3rem'}}>por empresa · sessão única</div>
          <button className="btn-primary" style={{fontSize:'0.68rem',padding:'1.1rem 3rem'}}>Agendar minha reunião</button>
          <p style={{marginTop:'1.2rem',fontSize:'0.72rem',color:'rgba(240,244,255,0.35)'}}>Vagas limitadas · Sem juridiquês · Orientação estratégica real</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{padding:'7rem 5vw',background:'#111420',position:'relative',overflow:'hidden'}}>
        <FaqSection />
      </section>

      {/* CTA FINAL */}
      <section style={{padding:'9rem 5vw',textAlign:'center',position:'relative',overflow:'hidden',background:'#0D0F18'}}>
        <div style={{position:'absolute',width:'700px',height:'400px',background:'radial-gradient(ellipse,rgba(30,111,255,0.09) 0%,transparent 70%)',top:'50%',left:'50%',transform:'translate(-50%,-50%)',filter:'blur(80px)',pointerEvents:'none'}}></div>
        <div style={{position:'relative',zIndex:2}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'2rem'}}>
            <span style={{fontFamily:'Inter,sans-serif',fontSize:'1.3rem',fontWeight:300,color:'#F0F4FF'}}>Acesso</span>
            <span style={{fontFamily:'Inter,sans-serif',fontSize:'1.3rem',fontWeight:600,background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginLeft:'0.3rem'}}>USA</span>
          </div>
          <h2 style={{fontFamily:'Inter,sans-serif',fontSize:'clamp(2rem,5vw,5rem)',fontWeight:200,lineHeight:1.1,letterSpacing:'-0.04em',marginBottom:'1.5rem'}}>
            Receba seu diagnóstico<br/>
            <span style={{fontWeight:600,background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>gratuito agora.</span>
          </h2>
          <p style={{fontSize:'0.95rem',color:'rgba(240,244,255,0.7)',maxWidth:'400px',margin:'0 auto 3rem',lineHeight:1.85}}>Sem compromisso. Sem juridiquês.<br/>Orientação estratégica real em 3 minutos.</p>
          <button className="btn-primary" style={{fontSize:'0.68rem',padding:'1.1rem 3rem'}} onClick={goQuiz}>Começar diagnóstico gratuito</button>
          <p style={{marginTop:'1.2rem',fontSize:'0.72rem',color:'rgba(240,244,255,0.35)'}}>Sem cadastro · Resultado imediato · 100% gratuito</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:'1px solid rgba(30,111,255,0.08)',padding:'2.5rem 5vw',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'1.5rem',background:'#060810'}}>
        <div style={{display:'flex',alignItems:'center'}}>
          <span style={{fontFamily:'Inter,sans-serif',fontSize:'1rem',fontWeight:300,color:'#F0F4FF'}}>Acesso</span>
          <span style={{fontFamily:'Inter,sans-serif',fontSize:'1rem',fontWeight:600,background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginLeft:'0.3rem'}}>USA</span>
        </div>
        <p style={{fontSize:'0.68rem',color:'rgba(240,244,255,0.35)',maxWidth:'520px',lineHeight:1.8,textAlign:'center'}}>
          © 2025 Acesso USA · Este diagnóstico é uma orientação estratégica inicial e não constitui consultoria jurídica, contábil ou migratória. Para registro de marca nos EUA, estrangeiros normalmente precisam de advogado licenciado perante o USPTO.
        </p>
        <div style={{fontSize:'0.68rem',color:'rgba(240,244,255,0.35)',letterSpacing:'0.1em'}}>acesso.com</div>
      </footer>
    </>
  )
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    ['O diagnóstico é realmente gratuito?','Sim, 100% gratuito e sem compromisso. Em menos de 3 minutos você recebe score completo, análise por categoria, riscos identificados e próximos passos personalizados para o seu momento.'],
    ['Isso substitui uma consultoria jurídica?','Não. O Acesso USA Score é orientação estratégica inicial. Para questões jurídicas, contábeis ou migratórias, recomendamos profissionais licenciados. Para registro de marca nos EUA, estrangeiros normalmente precisam de advogado licenciado perante o USPTO.'],
    ['Preciso ter empresa aberta nos EUA para participar?','Não. O diagnóstico avalia exatamente onde você está hoje — com ou sem estrutura americana. Um dos resultados é justamente descobrir se abrir empresa nos EUA faz sentido como parte da sua estratégia.'],
    ['Abrir empresa nos EUA é obrigatório para registrar marca?','Não. Abrir empresa nos EUA pode fazer sentido como parte de uma estratégia mais forte de entrada, operação e proteção da marca — mas não é um requisito para o registro de marca perante o USPTO.'],
    ['O que acontece depois do diagnóstico?','Você recebe score, análise por categoria, riscos, próximos passos e roadmap personalizado. Se quiser aprofundar, oferecemos uma reunião estratégica de 45 minutos com especialistas da Acesso USA.'],
  ]
  return (
    <div style={{maxWidth:'720px',margin:'0 auto'}}>
      <div className="section-tag">Dúvidas frequentes</div>
      <h2 style={{fontFamily:'Inter,sans-serif',fontSize:'clamp(1.7rem,4vw,3.5rem)',fontWeight:200,lineHeight:1.15,marginBottom:'3rem',letterSpacing:'-0.025em'}}>
        Perguntas <span style={{fontWeight:600,background:'linear-gradient(135deg,#0A3D91,#1E6FFF,#3FA9F5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>respondidas</span>
      </h2>
      {faqs.map(([q,a],i) => (
        <div key={i} style={{borderBottom:'1px solid rgba(30,111,255,0.08)',padding:'1.8rem 0',cursor:'pointer'}} onClick={() => setOpen(open===i?null:i)}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1.5rem',fontSize:'0.85rem',fontWeight:400,color:'#F0F4FF'}}>
            <span>{q}</span>
            <div style={{width:'28px',height:'28px',borderRadius:'50%',border:'1px solid rgba(30,111,255,0.25)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'#3FA9F5',fontSize:'1.1rem',transition:'all 0.3s',transform:open===i?'rotate(45deg)':'none',background:open===i?'rgba(30,111,255,0.1)':'transparent'}}>+</div>
          </div>
          {open===i && <div style={{fontSize:'0.82rem',color:'rgba(240,244,255,0.7)',lineHeight:1.85,marginTop:'1.2rem',fontWeight:300}}>{a}</div>}
        </div>
      ))}
    </div>
  )
}
