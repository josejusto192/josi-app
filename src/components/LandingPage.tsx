'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('lp-visible'); observer.unobserve(e.target) }
      })
    }, { threshold: 0.12 })
    document.querySelectorAll('.lp-reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const toggleFaq = (el: HTMLButtonElement) => {
    const item = el.closest('.lp-faq-item') as HTMLElement
    const isOpen = item.classList.contains('open')
    document.querySelectorAll('.lp-faq-item').forEach(i => i.classList.remove('open'))
    if (!isOpen) item.classList.add('open')
  }

  return (
    <>
      <style>{`
        .lp-root *, .lp-root *::before, .lp-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .lp-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #F5EDE3; color: #4A2E22; overflow-x: hidden;
        }
        .lp-root a { text-decoration: none; }

        /* HEADER */
        .lp-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          background: rgba(253,248,243,0.92); backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(232,216,204,0.6);
          padding: 0 24px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .lp-logo {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 22px; font-weight: 700;
          background: linear-gradient(135deg,#C9826B,#D4A96A);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .lp-nav { display: flex; gap: 28px; align-items: center; }
        .lp-nav a { font-size: 14px; font-weight: 500; color: #8A6A5A; transition: color .2s; }
        .lp-nav a:hover { color: #C9826B; }
        .lp-btn {
          display: inline-flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg,#C9826B,#D4A96A); color: #FDF8F3;
          font-size: 14px; font-weight: 600; padding: 10px 22px; border-radius: 100px;
          border: none; cursor: pointer;
          box-shadow: 0 4px 16px rgba(201,130,107,0.35);
          transition: transform .18s, box-shadow .18s;
        }
        .lp-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,130,107,0.45); }
        .lp-btn-outline {
          background: transparent; border: 1.5px solid #C9826B; color: #C9826B; box-shadow: none;
        }
        .lp-btn-outline:hover { background: rgba(201,130,107,0.06); box-shadow: none; }
        .lp-btn-lg { font-size: 16px; padding: 15px 36px; }
        .lp-btn-white { background: #FDF8F3; color: #C9826B; box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
        @media(max-width:680px){ .lp-nav { display: none; } }

        /* HERO */
        .lp-hero {
          min-height: 100svh; padding: 96px 24px 80px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; position: relative; overflow: hidden;
        }
        .lp-hero::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,130,107,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 80% 80%, rgba(212,169,106,0.14) 0%, transparent 60%);
          pointer-events: none;
        }
        .lp-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(201,130,107,0.12); border: 1px solid rgba(201,130,107,0.28);
          color: #C9826B; font-size: 12px; font-weight: 600;
          padding: 5px 14px; border-radius: 100px; margin-bottom: 24px;
          letter-spacing: 0.04em; text-transform: uppercase;
        }
        .lp-h1 {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(36px, 7vw, 68px); font-weight: 700; line-height: 1.1;
          color: #4A2E22; max-width: 720px; margin-bottom: 20px;
        }
        .lp-h1 em {
          font-style: italic;
          background: linear-gradient(135deg,#C9826B,#D4A96A);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .lp-hero p {
          font-size: clamp(15px, 2.2vw, 18px); color: #8A6A5A;
          max-width: 520px; line-height: 1.65; margin-bottom: 36px;
        }
        .lp-hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
        .lp-social {
          margin-top: 52px; font-size: 13px; color: #8A6A5A;
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center;
        }
        .lp-avatars { display: flex; }
        .lp-avatars span {
          width: 32px; height: 32px; border-radius: 50%;
          border: 2px solid #FDF8F3; margin-left: -8px;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg,#C9826B,#D4A96A);
          color: #FDF8F3; font-size: 13px; font-weight: 700;
        }
        .lp-avatars span:first-child { margin-left: 0; }
        .lp-deco {
          position: absolute; border-radius: 50%; pointer-events: none; opacity: 0.35;
          animation: lpFloat 8s ease-in-out infinite;
        }
        .lp-d1 { width:300px;height:300px;background:radial-gradient(circle,rgba(201,130,107,0.25),transparent 70%);top:10%;left:-6%; }
        .lp-d2 { width:200px;height:200px;background:radial-gradient(circle,rgba(212,169,106,0.22),transparent 70%);top:20%;right:-4%;animation-delay:3s; }
        .lp-d3 { width:150px;height:150px;background:radial-gradient(circle,rgba(201,130,107,0.18),transparent 70%);bottom:15%;left:10%;animation-delay:5s; }
        @keyframes lpFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }

        /* SECTIONS */
        .lp-section { padding: 96px 24px; }
        .lp-section-inner { max-width: 1100px; margin: 0 auto; }
        .lp-section-bg { background: #FDF8F3; }
        .lp-label { font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#C9826B;margin-bottom:12px; }
        .lp-h2 {
          font-family: Georgia,'Times New Roman',serif;
          font-size:clamp(28px,4vw,42px);font-weight:700;color:#4A2E22;line-height:1.2;margin-bottom:14px;
        }
        .lp-sub { font-size:16px;color:#8A6A5A;line-height:1.6;max-width:560px; }
        .lp-sec-hdr { margin-bottom:56px; }
        .lp-center { text-align:center; }
        .lp-mx { margin-left:auto;margin-right:auto; }

        /* FEATURES GRID */
        .lp-feat-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px; }
        .lp-feat {
          background:#F5EDE3; border:1px solid #E8D8CC; border-radius:24px; padding:28px 26px;
          transition:transform .22s,box-shadow .22s;
        }
        .lp-feat:hover { transform:translateY(-4px);box-shadow:0 12px 32px rgba(74,46,34,.1); }
        .lp-feat-icon { width:52px;height:52px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:18px; }
        .lp-feat h3 { font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:600;color:#4A2E22;margin-bottom:8px; }
        .lp-feat p { font-size:14px;color:#8A6A5A;line-height:1.6; }
        .lp-tag { display:inline-block;margin-top:14px;background:rgba(201,130,107,.12);color:#C9826B;font-size:11px;font-weight:600;padding:3px 10px;border-radius:100px;text-transform:uppercase;letter-spacing:.04em; }
        .lp-tag-p { background:rgba(212,169,106,.15);color:#A07830; }

        /* TESTIMONIALS */
        .lp-testi-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px; }
        .lp-testi { background:#FDF8F3;border:1px solid #E8D8CC;border-radius:24px;padding:28px 26px;position:relative; }
        .lp-testi::before {
          content:'\u201C'; position:absolute;top:16px;right:24px;
          font-family:Georgia,serif;font-size:72px;line-height:1;
          color:rgba(201,130,107,.15);pointer-events:none;
        }
        .lp-stars { color:#D4A96A;font-size:14px;margin-bottom:14px;letter-spacing:2px; }
        .lp-testi p { font-size:15px;color:#4A2E22;line-height:1.65;font-style:italic;margin-bottom:20px; }
        .lp-testi-author { display:flex;align-items:center;gap:12px; }
        .lp-testi-av { width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#C9826B,#D4A96A);display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-size:16px;font-weight:700;color:#FDF8F3;flex-shrink:0; }
        .lp-testi-name { font-size:14px;font-weight:600;color:#4A2E22; }
        .lp-testi-meta { font-size:12px;color:#8A6A5A; }

        /* PRICING */
        .lp-price-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;max-width:760px;margin:0 auto; }
        .lp-price { border-radius:28px;padding:36px 30px;border:1.5px solid #E8D8CC;background:#F5EDE3;display:flex;flex-direction:column;transition:transform .22s; }
        .lp-price:hover { transform:translateY(-4px); }
        .lp-price-feat { background:linear-gradient(135deg,#C9826B,#D4A96A);border-color:transparent;box-shadow:0 20px 48px rgba(201,130,107,.38); }
        .lp-price-feat * { color:#FDF8F3 !important; }
        .lp-price-badge { display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;background:rgba(253,248,243,.22);color:#FDF8F3;padding:4px 12px;border-radius:100px;margin-bottom:20px;width:fit-content; }
        .lp-price-name { font-family:Georgia,serif;font-size:22px;font-weight:700;color:#4A2E22;margin-bottom:8px; }
        .lp-price-val { font-size:42px;font-weight:700;color:#4A2E22;line-height:1;margin-bottom:4px; }
        .lp-price-val sup { font-size:20px;vertical-align:top;margin-top:8px; }
        .lp-price-val .per { font-size:16px;font-weight:400;opacity:.65; }
        .lp-price-desc { font-size:13px;color:#8A6A5A;margin-bottom:28px; }
        .lp-price-list { list-style:none;flex:1;margin-bottom:32px;display:flex;flex-direction:column;gap:12px; }
        .lp-price-list li { font-size:14px;color:#8A6A5A;display:flex;align-items:flex-start;gap:10px; }
        .lp-chk {
          width:18px;height:18px;border-radius:50%;flex-shrink:0;margin-top:1px;
          background:rgba(201,130,107,.15)
          url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 5l2.5 2.5L8 3' stroke='%23C9826B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
          no-repeat center;
        }
        .lp-price-feat .lp-chk {
          background-color:rgba(253,248,243,.25);
          background-image:url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 5l2.5 2.5L8 3' stroke='%23FDF8F3' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        }
        .lp-price-feat .lp-price-list li { color:rgba(253,248,243,.88); }

        /* FAQ */
        .lp-faq-list { max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:12px; }
        .lp-faq-item { background:#FDF8F3;border:1px solid #E8D8CC;border-radius:18px;overflow:hidden; }
        .lp-faq-q { width:100%;display:flex;align-items:center;justify-content:space-between;padding:20px 22px;gap:12px;background:none;border:none;cursor:pointer;text-align:left; }
        .lp-faq-q span { font-size:15px;font-weight:600;color:#4A2E22;line-height:1.4;flex:1; }
        .lp-faq-icon { width:28px;height:28px;border-radius:50%;flex-shrink:0;background:rgba(201,130,107,.12);color:#C9826B;display:flex;align-items:center;justify-content:center;font-size:18px;line-height:1;transition:transform .25s; }
        .lp-faq-item.open .lp-faq-icon { transform:rotate(45deg); }
        .lp-faq-a { max-height:0;overflow:hidden;transition:max-height .35s ease,padding .25s;padding:0 22px;font-size:14px;color:#8A6A5A;line-height:1.7; }
        .lp-faq-item.open .lp-faq-a { max-height:300px;padding-bottom:20px; }

        /* FINAL CTA */
        .lp-cta { background:linear-gradient(135deg,#C9826B,#D4A96A);text-align:center;padding:96px 24px;position:relative;overflow:hidden; }
        .lp-cta::before { content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 50% 50%,rgba(255,255,255,.12),transparent 70%); }
        .lp-cta .lp-label { color:rgba(253,248,243,.7); }
        .lp-cta .lp-h2 { color:#FDF8F3; }
        .lp-cta p { color:rgba(253,248,243,.85);margin:0 auto 36px;max-width:520px; }
        .lp-cta em { font-style:italic;font-family:Georgia,serif; }

        /* FOOTER */
        .lp-footer { background:#4A2E22;color:rgba(253,248,243,.55);text-align:center;padding:32px 24px;font-size:13px;line-height:1.7; }
        .lp-footer a { color:rgba(253,248,243,.55); }
        .lp-footer a:hover { color:rgba(253,248,243,.9); }

        /* REVEAL */
        .lp-reveal { opacity:0;transform:translateY(28px);transition:opacity .6s ease,transform .6s ease; }
        .lp-visible { opacity:1;transform:none; }

        @media(max-width:600px){
          .lp-section { padding:72px 20px; }
          .lp-hero { padding:88px 20px 64px; }
          .lp-cta { padding:72px 20px; }
          .lp-price-grid { grid-template-columns:1fr;max-width:420px; }
        }
      `}</style>

      <div className="lp-root">

        {/* HEADER */}
        <header className="lp-header">
          <div className="lp-logo">Josi</div>
          <nav className="lp-nav">
            <a href="#funcionalidades">O App</a>
            <a href="#depoimentos">Depoimentos</a>
            <a href="#planos">Planos</a>
            <a href="#faq">FAQ</a>
          </nav>
          <Link href="/auth/login" className="lp-btn">Começar agora</Link>
        </header>

        {/* HERO */}
        <section className="lp-hero">
          <div className="lp-deco lp-d1" />
          <div className="lp-deco lp-d2" />
          <div className="lp-deco lp-d3" />
          <div className="lp-badge">✦ Exclusivo para seguidoras</div>
          <h1 className="lp-h1">Sua saúde,<br/><em>do seu jeito</em></h1>
          <p>O app da Josi reúne treino, nutrição, comunidade e educação em um só lugar — para você transformar sua rotina de forma leve e consistente.</p>
          <div className="lp-hero-ctas">
            <Link href="/auth/login" className="lp-btn lp-btn-lg">Quero meu acesso ✦</Link>
            <a href="#funcionalidades" className="lp-btn lp-btn-lg lp-btn-outline">Ver o app</a>
          </div>
          <div className="lp-social">
            <div className="lp-avatars">
              <span>A</span><span>C</span><span>M</span><span>L</span><span>R</span>
            </div>
            <span>+1.200 mulheres já começaram a jornada</span>
          </div>
        </section>

        {/* FEATURES */}
        <section className="lp-section lp-section-bg" id="funcionalidades">
          <div className="lp-section-inner">
            <div className="lp-sec-hdr lp-reveal">
              <div className="lp-label">O que você encontra</div>
              <h2 className="lp-h2">Tudo que você precisa,<br/>em um só app</h2>
              <p className="lp-sub">Da aula de hoje ao desafio mensal — a Josi curou um ecossistema completo de saúde e bem-estar feminino.</p>
            </div>
            <div className="lp-feat-grid">
              {[
                { icon:'💪', bg:'linear-gradient(135deg,#F5D6CA,#F0C4A8)', title:'Exercícios', desc:'Treinos guiados para todos os níveis, com foco em resultados reais e respeito ao seu corpo.', tag:'Incluído', premium:false },
                { icon:'🥗', bg:'linear-gradient(135deg,#C9E8D8,#A8D8C0)', title:'Nutrição & Receitas', desc:'Receitas saborosas, guias de alimentação e conteúdo educativo sobre nutrição funcional.', tag:'✦ Premium', premium:true },
                { icon:'🏅', bg:'linear-gradient(135deg,#F5E6C8,#EDD89A)', title:'Desafio Mensal', desc:'Um novo desafio a cada mês para você manter a consistência e celebrar cada conquista.', tag:'✦ Premium', premium:true },
                { icon:'🧠', bg:'linear-gradient(135deg,#D8C8E8,#C0A8D8)', title:'Educação', desc:'Cursos completos sobre saúde hormonal, mentalidade, beleza e muito mais — com aulas em vídeo e texto.', tag:'✦ Premium', premium:true },
                { icon:'💬', bg:'linear-gradient(135deg,#C8D8F5,#A8C0E8)', title:'Comunidade', desc:'Um espaço seguro para trocar experiências, tirar dúvidas e se inspirar com outras mulheres.', tag:'Incluído', premium:false },
                { icon:'🌸', bg:'linear-gradient(135deg,#F5CAD6,#E8A8B8)', title:'Loja Exclusiva', desc:'Produtos curados pela Josi — suplementos, itens de bem-estar e tudo que complementa sua jornada.', tag:'✦ Premium', premium:true },
              ].map(f => (
                <div key={f.title} className="lp-feat lp-reveal">
                  <div className="lp-feat-icon" style={{ background: f.bg }}>{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <span className={`lp-tag${f.premium ? ' lp-tag-p' : ''}`}>{f.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="lp-section" id="depoimentos">
          <div className="lp-section-inner">
            <div className="lp-sec-hdr lp-reveal lp-center lp-mx">
              <div className="lp-label">Depoimentos</div>
              <h2 className="lp-h2">O que as alunas dizem</h2>
              <p className="lp-sub lp-mx">Transformações reais de mulheres que decidiram colocar a saúde em primeiro lugar.</p>
            </div>
            <div className="lp-testi-grid">
              {[
                { initial:'A', name:'Ana Paula S.', meta:'Seguiu desde o lançamento', text:'Em 30 dias de desafio já sinto diferença na disposição e no humor. O app é lindo, fácil de usar e os conteúdos da Josi são incríveis. Nunca me senti tão motivada!' },
                { initial:'C', name:'Carla M.', meta:'Membro premium há 2 meses', text:'Os cursos de nutrição mudaram minha relação com a comida. Nada de dieta restritiva — aprendi a comer bem de verdade. A comunidade é um suporte que eu não sabia que precisava.' },
                { initial:'M', name:'Mariana L.', meta:'Completou 3 desafios', text:'Finalmente um app que parece ter sido feito pra mim. Os treinos são práticos, as receitas são gostosas de verdade e o desafio mensal me mantém focada. Vale muito cada centavo!' },
              ].map(t => (
                <div key={t.name} className="lp-testi lp-reveal">
                  <div className="lp-stars">★★★★★</div>
                  <p>{`"${t.text}"`}</p>
                  <div className="lp-testi-author">
                    <div className="lp-testi-av">{t.initial}</div>
                    <div>
                      <div className="lp-testi-name">{t.name}</div>
                      <div className="lp-testi-meta">{t.meta}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="lp-section lp-section-bg" id="planos">
          <div className="lp-section-inner">
            <div className="lp-sec-hdr lp-reveal lp-center lp-mx">
              <div className="lp-label">Planos</div>
              <h2 className="lp-h2">Escolha o seu plano</h2>
              <p className="lp-sub lp-mx">Comece gratuitamente e desbloqueie o app completo quando estiver pronta para dar o próximo passo.</p>
            </div>
            <div className="lp-price-grid">
              {/* Free */}
              <div className="lp-price lp-reveal">
                <div className="lp-price-name">Gratuito</div>
                <div className="lp-price-val">R$<sup></sup>0<span className="per">/mês</span></div>
                <div className="lp-price-desc">Para começar a explorar o app</div>
                <ul className="lp-price-list">
                  {['Acesso à comunidade','Treinos básicos','Perfil personalizado','Conteúdo limitado da loja'].map(i=>(
                    <li key={i}><span className="lp-chk"/>{i}</li>
                  ))}
                </ul>
                <Link href="/auth/login" className="lp-btn lp-btn-outline" style={{width:'100%',textAlign:'center'}}>Criar conta grátis</Link>
              </div>
              {/* Premium */}
              <div className="lp-price lp-price-feat lp-reveal">
                <div className="lp-price-badge">✦ Mais popular</div>
                <div className="lp-price-name">Premium</div>
                <div className="lp-price-val"><sup>R$</sup>47<span className="per">/mês</span></div>
                <div className="lp-price-desc">Acesso completo a tudo do app</div>
                <ul className="lp-price-list">
                  {['Tudo do plano Gratuito','Cursos completos de nutrição, treino e mentalidade','Desafios mensais exclusivos','Receitas e guias alimentares','Suporte prioritário da comunidade','Novos conteúdos toda semana'].map(i=>(
                    <li key={i}><span className="lp-chk"/>{i}</li>
                  ))}
                </ul>
                <Link href="/auth/login" className="lp-btn lp-btn-white" style={{width:'100%',textAlign:'center'}}>Assinar Premium ✦</Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="lp-section" id="faq">
          <div className="lp-section-inner">
            <div className="lp-sec-hdr lp-reveal lp-center lp-mx">
              <div className="lp-label">Dúvidas</div>
              <h2 className="lp-h2">Perguntas frequentes</h2>
            </div>
            <div className="lp-faq-list">
              {[
                { q:'Posso cancelar a qualquer momento?', a:'Sim! Você pode cancelar sua assinatura quando quiser, sem multas ou burocracia. Após o cancelamento, seu acesso premium permanece até o fim do período já pago.' },
                { q:'O app funciona no celular?', a:'Sim! O app é 100% responsivo e funciona perfeitamente no navegador do seu celular (Android e iPhone). Não é necessário instalar nada — basta acessar pelo browser.' },
                { q:'Com que frequência saem conteúdos novos?', a:'Novos conteúdos são adicionados toda semana — entre aulas, receitas e materiais de apoio. Além disso, a cada mês há um desafio novo para manter sua motivação lá em cima.' },
                { q:'Preciso ter experiência com treino ou dieta?', a:'Não! O app foi pensado para mulheres em todos os estágios — desde quem está começando do zero até quem já tem uma rotina estabelecida. Os conteúdos são organizados por nível.' },
                { q:'Como funciona a comunidade?', a:'A comunidade é um espaço dentro do próprio app onde você pode publicar textos, fotos e vídeos, curtir e comentar posts de outras mulheres, e trocar experiências em um ambiente acolhedor e seguro.' },
              ].map(({ q, a }) => (
                <div key={q} className="lp-faq-item lp-reveal">
                  <button className="lp-faq-q" onClick={e => toggleFaq(e.currentTarget)}>
                    <span>{q}</span>
                    <div className="lp-faq-icon">+</div>
                  </button>
                  <div className="lp-faq-a">{a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="lp-cta">
          <div className="lp-section-inner lp-reveal">
            <div className="lp-label">Pronta para começar?</div>
            <h2 className="lp-h2">Sua melhor versão<br/><em>te espera aqui</em></h2>
            <p>Junte-se a mais de 1.200 mulheres que já deram o primeiro passo. Crie sua conta agora — é de graça.</p>
            <Link href="/auth/login" className="lp-btn lp-btn-white lp-btn-lg">Quero começar agora ✦</Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <div className="lp-logo" style={{ marginBottom:12, display:'block' }}>Josi</div>
          © 2025 Josi App · Todos os direitos reservados ·{' '}
          <a href="#">Privacidade</a> · <a href="#">Termos</a>
        </footer>

      </div>
    </>
  )
}
