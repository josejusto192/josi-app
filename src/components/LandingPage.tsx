'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

/* ─────────────────────────────────────────────
   LANDING PAGE — Josi App
   Aesthetic: Intimate Luxury · Organic Warmth
   Fonts: Fraunces (display) · DM Sans (body)
───────────────────────────────────────────── */

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    /* Staggered scroll reveal */
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && (e.target.classList.add('js-in'), io.unobserve(e.target))),
      { threshold: 0.09 }
    )
    document.querySelectorAll('.js-up').forEach(el => io.observe(el))

    /* Hero subtle mouse parallax */
    const hero = heroRef.current
    const onMouse = (ev: MouseEvent) => {
      if (!hero) return
      const x = (ev.clientX / window.innerWidth - 0.5) * 30
      const y = (ev.clientY / window.innerHeight - 0.5) * 20
      hero.querySelectorAll<HTMLElement>('[data-par]').forEach(el => {
        const s = parseFloat(el.dataset.par ?? '1')
        el.style.transform = `translate(${x * s}px,${y * s}px)`
      })
    }
    window.addEventListener('mousemove', onMouse)

    return () => { io.disconnect(); window.removeEventListener('mousemove', onMouse) }
  }, [])

  const toggleFaq = (btn: HTMLButtonElement) => {
    const item = btn.closest('.fq') as HTMLElement
    const open = item.classList.contains('fq--open')
    document.querySelectorAll('.fq--open').forEach(i => i.classList.remove('fq--open'))
    if (!open) item.classList.add('fq--open')
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,700;1,9..144,300;1,9..144,400;1,9..144,500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <style>{`
/* ── vars ── */
:root{
  --ink:    #1C0E06;
  --ink2:   #3A2010;
  --rust:   #BF6244;
  --rust-h: #D07256;
  --honey:  #C8923A;
  --honey-h:#DCA84E;
  --paper:  #FAF5EE;
  --paper2: #F2EAE0;
  --border: rgba(28,14,6,.09);
  --muted:  #7A5840;
  --F: 'Fraunces',Georgia,serif;
  --S: 'DM Sans',system-ui,sans-serif;
}
/* ── reset ── */
.lp,  .lp *, .lp *::before, .lp *::after{
  box-sizing:border-box; margin:0; padding:0;
}
.lp{ font-family:var(--S); background:var(--paper); color:var(--ink); overflow-x:hidden; }
.lp a{ text-decoration:none; color:inherit; }
.lp button{ font-family:var(--S); cursor:pointer; border:none; background:none; }

/* ── noise grain ── */
.lp::after{
  content:''; position:fixed; inset:0; z-index:9999; pointer-events:none;
  opacity:.022;
  background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E") 0/200px;
}

/* ── nav ── */
.nav{
  position:fixed; top:0; left:0; right:0; z-index:100;
  height:64px; padding:0 clamp(20px,5vw,56px);
  display:flex; align-items:center; justify-content:space-between;
  background:rgba(250,245,238,.88); backdrop-filter:blur(14px) saturate(1.3);
  border-bottom:1px solid var(--border);
}
.nav-logo{
  font-family:var(--F); font-size:22px; font-weight:400; font-style:italic;
  color:var(--rust); letter-spacing:.01em;
}
.nav-links{ display:flex; gap:28px; }
.nav-links a{
  font-size:13px; font-weight:500; letter-spacing:.05em; text-transform:uppercase;
  color:var(--muted); transition:color .2s;
}
.nav-links a:hover{ color:var(--rust); }
.pill{
  display:inline-flex; align-items:center; justify-content:center; gap:6px;
  font-family:var(--S); font-weight:600; font-size:13px;
  letter-spacing:.04em; text-transform:uppercase;
  padding:10px 22px; border-radius:100px; transition:all .2s; white-space:nowrap;
}
.pill-dark{  background:var(--ink);  color:var(--paper);  box-shadow:0 2px 14px rgba(28,14,6,.25); }
.pill-dark:hover{ background:var(--ink2); transform:translateY(-1px); box-shadow:0 4px 20px rgba(28,14,6,.35); }
.pill-rust{  background:var(--rust);  color:#fff; box-shadow:0 4px 20px rgba(191,98,68,.38); }
.pill-rust:hover{ background:var(--rust-h); transform:translateY(-2px); box-shadow:0 8px 28px rgba(191,98,68,.48); }
.pill-ghost{ border:1.5px solid var(--rust); color:var(--rust); background:transparent; }
.pill-ghost:hover{ background:rgba(191,98,68,.06); }
.pill-paper{ background:var(--paper); color:var(--ink); box-shadow:0 4px 16px rgba(0,0,0,.15); }
.pill-paper:hover{ background:#fff; transform:translateY(-2px); }
.pill-lg{ font-size:14px; padding:14px 32px; }
@media(max-width:700px){ .nav-links{ display:none; } }

/* ── hero ── */
.hero{
  min-height:100svh; background:var(--ink);
  display:grid; grid-template-columns:1fr; align-items:center; justify-items:center;
  text-align:center; padding:100px clamp(20px,6vw,80px) 80px;
  position:relative; overflow:hidden;
}
.hero-glow{
  position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(ellipse 80% 55% at 25% 60%, rgba(191,98,68,.16) 0%, transparent 55%),
    radial-gradient(ellipse 60% 50% at 75% 30%, rgba(200,146,58,.12) 0%, transparent 50%),
    radial-gradient(ellipse 40% 40% at 50% 90%, rgba(191,98,68,.08) 0%, transparent 50%);
}
.hero-circle{
  position:absolute; border-radius:50%; pointer-events:none;
  transition:transform .9s cubic-bezier(.22,.68,0,1);
}
.hero-kicker{
  display:inline-flex; align-items:center; gap:8px;
  font-size:11px; font-weight:600; letter-spacing:.12em; text-transform:uppercase;
  color:rgba(200,146,58,.85); border:1px solid rgba(200,146,58,.28);
  background:rgba(200,146,58,.07); padding:5px 16px; border-radius:100px;
  margin-bottom:32px;
  animation:up .8s ease both;
}
.hero-kicker i{ width:5px; height:5px; border-radius:50%; background:var(--honey); }
.hero-h1{
  font-family:var(--F); font-size:clamp(48px,9.5vw,108px);
  font-weight:400; line-height:.92; letter-spacing:-.025em;
  color:var(--paper); margin-bottom:24px;
  animation:up .85s .12s ease both;
}
.hero-h1 .it{
  font-style:italic; font-weight:300;
  background:linear-gradient(90deg,var(--honey) 0%,var(--honey-h) 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  display:block;
}
.hero-sub{
  font-size:clamp(15px,2vw,18px); font-weight:300; line-height:1.72;
  color:rgba(250,245,238,.52); max-width:500px; margin-bottom:40px;
  animation:up .85s .22s ease both;
}
.hero-actions{
  display:flex; gap:12px; flex-wrap:wrap; justify-content:center;
  animation:up .85s .32s ease both;
}
.hero-scroll{
  position:absolute; bottom:32px; left:50%; transform:translateX(-50%);
  display:flex; flex-direction:column; align-items:center; gap:8px;
  color:rgba(250,245,238,.2); font-size:10px; letter-spacing:.1em; text-transform:uppercase;
  animation:fadeIn 1s .9s ease both;
}
.hero-scroll-line{
  width:1px; height:44px;
  background:linear-gradient(to bottom, rgba(250,245,238,.3), transparent);
  animation:pulse 2.2s 1.5s ease-in-out infinite;
}
@keyframes pulse{ 0%,100%{opacity:1;height:44px} 50%{opacity:.3;height:26px} }
.hero-proof{
  position:absolute; bottom:40px; right:clamp(20px,5vw,56px);
  display:flex; flex-direction:column; align-items:flex-end; gap:4px;
  animation:fadeIn 1s 1s ease both;
}
.hero-proof-num{
  font-family:var(--F); font-size:28px; font-weight:500; font-style:italic;
  color:rgba(200,146,58,.7); line-height:1;
}
.hero-proof-label{ font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:rgba(250,245,238,.25); }

/* ── manifesto ── */
.manifesto{
  background:var(--ink2);
  padding:clamp(56px,8vw,96px) clamp(20px,6vw,80px);
  text-align:center; overflow:hidden; position:relative;
}
.manifesto::before{
  content:'"'; position:absolute;
  font-family:var(--F); font-size:clamp(200px,30vw,360px);
  font-weight:700; line-height:.7;
  top:-30px; left:-20px; color:rgba(191,98,68,.06); pointer-events:none;
  user-select:none;
}
.manifesto-line{
  font-family:var(--F); font-size:clamp(22px,4vw,44px);
  font-weight:300; font-style:italic;
  color:rgba(250,245,238,.55); line-height:1.35; max-width:880px; margin:0 auto;
}
.manifesto-line strong{
  font-style:normal; font-weight:500;
  color:var(--paper);
}
.manifesto-line em{
  font-style:italic;
  color:var(--honey-h);
}

/* ── section wrapper ── */
.sec{ padding:clamp(72px,10vw,112px) clamp(20px,6vw,80px); }
.sec-inner{ max-width:1160px; margin:0 auto; }
.sec-label{
  display:flex; align-items:center; gap:10px;
  font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase;
  color:var(--rust); margin-bottom:14px;
}
.sec-label::before{ content:''; width:20px; height:1px; background:var(--rust); }
.sec-h2{
  font-family:var(--F); font-size:clamp(34px,5.5vw,62px);
  font-weight:400; line-height:1.04; letter-spacing:-.022em; color:var(--ink);
}
.sec-h2 em{ font-style:italic; font-weight:300; color:var(--rust); }
.sec-body{ font-size:16px; font-weight:300; color:var(--muted); line-height:1.78; }

/* ── features ── */
.feat-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:1px; background:var(--border);
  border:1px solid var(--border); border-radius:24px; overflow:hidden;
  margin-top:52px;
}
@media(max-width:860px){ .feat-grid{ grid-template-columns:1fr 1fr; } }
@media(max-width:520px){ .feat-grid{ grid-template-columns:1fr; } }
.feat{
  background:var(--paper);
  padding:clamp(24px,3vw,40px) clamp(20px,2.5vw,34px);
  transition:background .22s; position:relative; overflow:hidden;
}
.feat:hover{ background:#fff; }
.feat-ghost{
  position:absolute; top:-16px; right:10px;
  font-family:var(--F); font-size:100px; font-weight:700; line-height:1;
  color:rgba(191,98,68,.055); pointer-events:none; user-select:none;
}
.feat-icon{ font-size:28px; margin-bottom:18px; display:block; }
.feat-name{
  font-family:var(--F); font-size:clamp(18px,2vw,22px);
  font-weight:500; color:var(--ink); margin-bottom:8px; line-height:1.2;
}
.feat-desc{ font-size:14px; font-weight:300; color:var(--muted); line-height:1.65; }
.feat-tag{
  display:inline-block; margin-top:16px;
  font-size:10px; font-weight:600; letter-spacing:.08em; text-transform:uppercase;
  padding:3px 10px; border-radius:100px;
}
.tag-free{ background:rgba(191,98,68,.1); color:var(--rust); }
.tag-prem{ background:rgba(200,146,58,.12); color:#9A6820; }

/* ── social proof numbers ── */
.numbers{
  display:grid; grid-template-columns:repeat(4,1fr);
  border-top:1px solid var(--border); border-bottom:1px solid var(--border);
  margin-top:64px;
}
@media(max-width:600px){ .numbers{ grid-template-columns:1fr 1fr; } }
.number-item{
  padding:32px 24px; text-align:center;
  border-right:1px solid var(--border);
}
.number-item:last-child{ border-right:none; }
.number-n{
  font-family:var(--F); font-size:clamp(32px,5vw,48px);
  font-weight:500; color:var(--rust); line-height:1;
}
.number-l{ font-size:12px; font-weight:400; color:var(--muted); margin-top:6px; }

/* ── testi ── */
.testi-dark{ background:var(--ink); }
.testi-dark .sec-label{ color:rgba(200,146,58,.65); }
.testi-dark .sec-label::before{ background:rgba(200,146,58,.4); }
.testi-dark .sec-h2{ color:var(--paper); }
.testi-dark .sec-h2 em{ color:var(--honey-h); }
.testi-featured{
  border:1px solid rgba(250,245,238,.08); border-radius:24px;
  padding:clamp(32px,5vw,56px); margin-bottom:24px;
  background:rgba(250,245,238,.03);
  position:relative; overflow:hidden;
}
.testi-featured::before{
  content:'"'; position:absolute; top:-20px; left:24px;
  font-family:var(--F); font-size:180px; line-height:1; font-weight:700;
  color:rgba(191,98,68,.1); pointer-events:none;
}
.testi-featured-text{
  font-family:var(--F); font-size:clamp(20px,3.5vw,32px);
  font-style:italic; font-weight:300; line-height:1.5;
  color:rgba(250,245,238,.88); margin-bottom:28px; max-width:780px;
}
.testi-row{ display:grid; grid-template-columns:1fr 1fr; gap:16px; }
@media(max-width:600px){ .testi-row{ grid-template-columns:1fr; } }
.testi-small{
  border:1px solid rgba(250,245,238,.06); border-radius:18px;
  padding:28px 24px; background:rgba(250,245,238,.03);
  transition:background .22s, border-color .22s;
}
.testi-small:hover{ background:rgba(250,245,238,.06); border-color:rgba(200,146,58,.18); }
.testi-stars{ color:var(--honey-h); font-size:12px; letter-spacing:3px; margin-bottom:14px; }
.testi-body{
  font-family:var(--F); font-size:16px; font-style:italic; font-weight:300;
  color:rgba(250,245,238,.72); line-height:1.6; margin-bottom:20px;
}
.testi-rule{ width:28px; height:1px; background:rgba(200,146,58,.25); margin-bottom:16px; }
.testi-name{ font-size:12px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:rgba(250,245,238,.45); }
.testi-role{ font-size:11px; color:rgba(250,245,238,.22); margin-top:3px; }
.testi-author-row{ display:flex; align-items:center; gap:12px; }
.testi-av{
  width:38px; height:38px; border-radius:50%; flex-shrink:0;
  background:linear-gradient(135deg,var(--rust),var(--honey));
  display:flex; align-items:center; justify-content:center;
  font-family:var(--F); font-size:15px; font-weight:500; color:#fff;
}

/* ── pricing ── */
.price-grid{
  display:grid; grid-template-columns:1fr 1fr;
  gap:20px; max-width:820px; margin:56px auto 0;
}
@media(max-width:580px){ .price-grid{ grid-template-columns:1fr; } }
.price-card{
  border-radius:28px; padding:clamp(32px,4vw,44px);
  border:1.5px solid var(--border); background:#fff;
  display:flex; flex-direction:column;
  transition:transform .22s, box-shadow .22s;
}
.price-card:hover{ transform:translateY(-4px); box-shadow:0 16px 40px rgba(28,14,6,.09); }
.price-card-featured{
  background:var(--ink); border-color:transparent;
  box-shadow:0 24px 56px rgba(28,14,6,.4);
}
.price-card-featured:hover{ box-shadow:0 32px 64px rgba(28,14,6,.5); }
.price-badge{
  font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
  color:var(--honey-h); margin-bottom:24px;
  display:flex; align-items:center; gap:8px;
}
.price-badge::after{ content:''; flex:1; height:1px; background:rgba(200,146,58,.18); }
.price-name{
  font-family:var(--F); font-size:26px; font-weight:500; color:var(--ink); margin-bottom:8px;
}
.price-card-featured .price-name{ color:var(--paper); }
.price-val{
  font-family:var(--F); font-size:54px; font-weight:400; line-height:1;
  color:var(--ink); margin-bottom:4px;
}
.price-card-featured .price-val{ color:var(--paper); }
.price-val sup{ font-size:20px; vertical-align:top; margin-top:12px; }
.price-val .mo{ font-size:16px; font-weight:300; opacity:.45; }
.price-desc{ font-size:13px; font-weight:300; color:var(--muted); margin-bottom:28px; }
.price-card-featured .price-desc{ color:rgba(250,245,238,.4); }
.price-divider{ height:1px; background:var(--border); margin-bottom:26px; }
.price-card-featured .price-divider{ background:rgba(250,245,238,.08); }
.price-list{ list-style:none; flex:1; margin-bottom:32px; display:flex; flex-direction:column; gap:13px; }
.price-list li{
  display:flex; align-items:flex-start; gap:11px;
  font-size:14px; font-weight:300; color:var(--muted); line-height:1.4;
}
.price-card-featured .price-list li{ color:rgba(250,245,238,.6); }
.chk{
  width:18px; height:18px; flex-shrink:0; margin-top:1px; border-radius:50%;
  background:rgba(191,98,68,.11); display:flex; align-items:center; justify-content:center;
}
.chk svg{ width:9px; height:9px; }
.price-card-featured .chk{ background:rgba(200,146,58,.18); }

/* ── faq ── */
.faq-wrap{ max-width:700px; margin:52px auto 0; }
.fq{ border-bottom:1px solid var(--border); }
.fq:first-child{ border-top:1px solid var(--border); }
.fq-btn{
  width:100%; display:flex; align-items:center; justify-content:space-between;
  padding:20px 2px; gap:16px; background:none; border:none; cursor:pointer; text-align:left;
}
.fq-q{
  font-family:var(--F); font-size:19px; font-weight:400; color:var(--ink);
  line-height:1.3; flex:1;
}
.fq-icon{
  width:30px; height:30px; border-radius:50%; flex-shrink:0;
  border:1.5px solid var(--border); color:var(--rust);
  display:flex; align-items:center; justify-content:center;
  font-size:18px; transition:transform .28s, background .2s, border-color .2s;
}
.fq--open .fq-icon{ transform:rotate(45deg); background:var(--rust); border-color:var(--rust); color:#fff; }
.fq-a{
  max-height:0; overflow:hidden;
  transition:max-height .36s ease, padding .24s;
  padding:0 2px;
  font-size:15px; font-weight:300; color:var(--muted); line-height:1.75;
}
.fq--open .fq-a{ max-height:260px; padding-bottom:20px; }

/* ── cta ── */
.cta-section{
  background:var(--ink); text-align:center;
  padding:clamp(80px,12vw,130px) clamp(20px,6vw,80px);
  position:relative; overflow:hidden;
}
.cta-section::before{
  content:''; position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(ellipse 65% 70% at 50% 50%, rgba(191,98,68,.13), transparent 60%);
}
.cta-section .sec-label{ justify-content:center; color:rgba(200,146,58,.55); }
.cta-section .sec-label::before{ background:rgba(200,146,58,.35); }
.cta-h{
  font-family:var(--F); font-size:clamp(42px,8vw,88px);
  font-weight:400; font-style:italic; line-height:.96;
  letter-spacing:-.025em; color:var(--paper); margin-bottom:22px;
}
.cta-h b{ font-style:normal; font-weight:600; color:var(--honey-h); display:block; }
.cta-sub{
  font-size:16px; font-weight:300;
  color:rgba(250,245,238,.45); max-width:440px; margin:0 auto 40px;
  line-height:1.7;
}

/* ── footer ── */
.footer{
  background:var(--ink); border-top:1px solid rgba(250,245,238,.05);
  padding:28px clamp(20px,6vw,80px);
  display:flex; align-items:center; justify-content:space-between;
  flex-wrap:wrap; gap:12px;
}
.footer-logo{ font-family:var(--F); font-size:18px; font-style:italic; color:rgba(250,245,238,.25); }
.footer-copy{ font-size:12px; color:rgba(250,245,238,.18); }
.footer-links{ display:flex; gap:18px; }
.footer-links a{ font-size:12px; color:rgba(250,245,238,.18); transition:color .2s; }
.footer-links a:hover{ color:rgba(250,245,238,.45); }

/* ── animations ── */
@keyframes up{ from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
@keyframes fadeIn{ from{opacity:0} to{opacity:1} }
.js-up{
  opacity:0; transform:translateY(30px);
  transition:opacity .65s ease, transform .65s ease;
}
.js-up:nth-child(2){ transition-delay:.09s }
.js-up:nth-child(3){ transition-delay:.17s }
.js-up:nth-child(4){ transition-delay:.25s }
.js-up:nth-child(5){ transition-delay:.33s }
.js-up:nth-child(6){ transition-delay:.41s }
.js-in{ opacity:1 !important; transform:none !important; }

@media(max-width:480px){
  .sec{ padding:64px 20px; }
  .cta-section{ padding:72px 20px; }
  .footer{ flex-direction:column; align-items:flex-start; }
}
      `}</style>

      <div className="lp">

        {/* ── NAV ── */}
        <header className="nav">
          <div className="nav-logo">Josi</div>
          <nav className="nav-links">
            <a href="#features">O App</a>
            <a href="#depoimentos">Histórias</a>
            <a href="#planos">Planos</a>
            <a href="#faq">FAQ</a>
          </nav>
          <Link href="/auth/login" className="pill pill-dark">Entrar</Link>
        </header>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-glow" />

          {/* parallax orbs */}
          <div data-par="0.5" style={{ position:'absolute', width:600, height:600, borderRadius:'50%', top:'-15%', left:'-12%', background:'radial-gradient(circle,rgba(191,98,68,.12),transparent 70%)', pointerEvents:'none', transition:'transform .9s cubic-bezier(.22,.68,0,1)' }} />
          <div data-par="-0.4" style={{ position:'absolute', width:450, height:450, borderRadius:'50%', bottom:'-8%', right:'-8%', background:'radial-gradient(circle,rgba(200,146,58,.1),transparent 70%)', pointerEvents:'none', transition:'transform .9s cubic-bezier(.22,.68,0,1)' }} />
          <div data-par="0.7" style={{ position:'absolute', width:250, height:250, borderRadius:'50%', top:'30%', right:'12%', background:'radial-gradient(circle,rgba(191,98,68,.08),transparent 70%)', pointerEvents:'none', transition:'transform .9s cubic-bezier(.22,.68,0,1)' }} />

          <div ref={heroRef} style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center' }}>
            <div className="hero-kicker">
              <i/> Exclusivo para seguidoras <i/>
            </div>

            <h1 className="hero-h1">
              <span className="it">Chega de começar</span>
              na segunda
            </h1>

            <p className="hero-sub">
              O método da Josi agora no seu celular — treinos, nutrição, desafios e uma comunidade que te entende, tudo em um só lugar.
            </p>

            <div className="hero-actions">
              <Link href="/auth/login" className="pill pill-rust pill-lg">
                Quero meu acesso ✦
              </Link>
              <a href="#features" className="pill pill-ghost pill-lg">
                Como funciona
              </a>
            </div>
          </div>

          <div className="hero-scroll">
            <div className="hero-scroll-line" />
            <span>scroll</span>
          </div>

          <div className="hero-proof">
            <div className="hero-proof-num">+1.200</div>
            <div className="hero-proof-label">mulheres na jornada</div>
          </div>
        </section>

        {/* ── MANIFESTO ── */}
        <div className="manifesto">
          <p className="manifesto-line js-up">
            Chega de dieta que te faz sofrer. Chega de treino que você odeia.{' '}
            <em>Chegou a hora de cuidar de você</em>{' '}
            <strong>do jeito que você merece — com leveza, consistência e prazer.</strong>
          </p>
        </div>

        {/* ── FEATURES ── */}
        <section className="sec" id="features">
          <div className="sec-inner">
            <div style={{ maxWidth:560 }}>
              <div className="sec-label js-up">O que você encontra</div>
              <h2 className="sec-h2 js-up">
                Tudo que você precisa,<br/><em>em um só app</em>
              </h2>
              <p className="sec-body js-up" style={{ marginTop:14 }}>
                Do treino de hoje ao desafio do mês — a Josi curou um ecossistema completo de saúde feminina.
              </p>
            </div>

            <div className="feat-grid">
              {[
                { ghost:'01', icon:'💪', name:'Exercícios', desc:'Treinos guiados para todos os níveis — sem equipamento, no seu ritmo, na sua casa ou na academia.', free:true },
                { ghost:'02', icon:'🥗', name:'Nutrição & Receitas', desc:'Receitas saborosas e guias de alimentação funcional. Comer bem sem abrir mão do que você gosta.', free:false },
                { ghost:'03', icon:'🏅', name:'Desafio Mensal', desc:'Um novo desafio a cada mês para manter a consistência — porque a transformação acontece no longo prazo.', free:false },
                { ghost:'04', icon:'🧠', name:'Educação', desc:'Cursos completos sobre saúde hormonal, mentalidade e bem-estar. Conteúdo que muda como você pensa sobre o seu corpo.', free:false },
                { ghost:'05', icon:'💬', name:'Comunidade', desc:'Um espaço seguro pra trocar experiências com mulheres que estão na mesma jornada que você.', free:true },
                { ghost:'06', icon:'🌸', name:'Loja Exclusiva', desc:'Produtos curados e aprovados pela Josi — suplementos, itens de cuidado e bem-estar para potencializar seus resultados.', free:false },
              ].map(f => (
                <div key={f.ghost} className="feat js-up">
                  <span className="feat-ghost">{f.ghost}</span>
                  <span className="feat-icon">{f.icon}</span>
                  <div className="feat-name">{f.name}</div>
                  <p className="feat-desc">{f.desc}</p>
                  <span className={`feat-tag ${f.free ? 'tag-free' : 'tag-prem'}`}>
                    {f.free ? 'Incluído' : '✦ Premium'}
                  </span>
                </div>
              ))}
            </div>

            {/* Numbers */}
            <div className="numbers">
              {[
                { n:'+1.200', l:'Mulheres ativas' },
                { n:'47',     l:'Aulas disponíveis' },
                { n:'6',      l:'Áreas de conteúdo' },
                { n:'4.9 ★', l:'Avaliação média' },
              ].map(s => (
                <div key={s.l} className="number-item js-up">
                  <div className="number-n">{s.n}</div>
                  <div className="number-l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="sec testi-dark" id="depoimentos">
          <div className="sec-inner">
            <div style={{ marginBottom:48, display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:20 }}>
              <div>
                <div className="sec-label js-up">Histórias reais</div>
                <h2 className="sec-h2 js-up">
                  Mulheres que<br/><em>mudaram a rota</em>
                </h2>
              </div>
            </div>

            {/* Featured */}
            <div className="testi-featured js-up">
              <p className="testi-featured-text">
                "Perdi 9kg, mas o que mais mudou foi minha relação comigo mesma. Aprendi a comer sem culpa, a treinar sem me punir. O app da Josi não é só sobre o corpo — é sobre se reconectar com você."
              </p>
              <div className="testi-author-row">
                <div className="testi-av">A</div>
                <div>
                  <div className="testi-name">Ana Paula S.</div>
                  <div className="testi-role">Membro desde o lançamento · 3 desafios concluídos</div>
                </div>
              </div>
            </div>

            {/* Small cards */}
            <div className="testi-row">
              {[
                { initial:'C', name:'Carla M.', role:'2 meses no Premium', text:'Os cursos de nutrição mudaram minha relação com a comida. Nada de restrição — aprendi a comer bem de verdade. A comunidade é um abraço nos dias difíceis.' },
                { initial:'M', name:'Mariana L.', role:'4 desafios concluídos', text:'Nunca pensei que conseguiria manter uma rotina assim. O desafio mensal me mantém focada. Cada semana eu me surpreendo com o que sou capaz de fazer.' },
              ].map((t, i) => (
                <div key={t.name} className="testi-small js-up" style={{ transitionDelay:`${i * 0.1}s` }}>
                  <div className="testi-stars">★★★★★</div>
                  <p className="testi-body">"{t.text}"</p>
                  <div className="testi-rule" />
                  <div className="testi-author-row">
                    <div className="testi-av">{t.initial}</div>
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="sec" id="planos">
          <div className="sec-inner" style={{ textAlign:'center' }}>
            <div className="sec-label js-up" style={{ justifyContent:'center' }}>Planos</div>
            <h2 className="sec-h2 js-up">Comece do seu jeito,<br/><em>evolua no seu tempo</em></h2>
            <p className="sec-body js-up" style={{ maxWidth:460, margin:'14px auto 0' }}>
              Crie sua conta grátis hoje. Quando você quiser mais, o Premium está esperando.
            </p>

            <div className="price-grid">
              {/* Free */}
              <div className="price-card js-up">
                <div className="price-name">Gratuito</div>
                <div className="price-val">R$<sup></sup>0<span className="mo">/mês</span></div>
                <div className="price-desc">Para dar o primeiro passo</div>
                <div className="price-divider" />
                <ul className="price-list">
                  {[
                    'Acesso à comunidade',
                    'Treinos básicos',
                    'Perfil personalizado',
                    'Conteúdo introdutório',
                  ].map(i => (
                    <li key={i}>
                      <span className="chk"><svg viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2L7.5 2" stroke="#BF6244" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                      {i}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/login" className="pill pill-ghost" style={{ width:'100%' }}>
                  Criar conta grátis
                </Link>
              </div>

              {/* Premium */}
              <div className="price-card price-card-featured js-up">
                <div className="price-badge">✦ Mais escolhido</div>
                <div className="price-name">Premium</div>
                <div className="price-val"><sup>R$</sup>47<span className="mo">/mês</span></div>
                <div className="price-desc">Para quem quer resultado de verdade</div>
                <div className="price-divider" />
                <ul className="price-list">
                  {[
                    'Tudo do plano Gratuito',
                    'Cursos de nutrição, treino e mentalidade',
                    'Desafios mensais exclusivos',
                    'Receitas e guias alimentares',
                    'Loja com produtos da Josi',
                    'Novos conteúdos toda semana',
                  ].map(i => (
                    <li key={i}>
                      <span className="chk"><svg viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2L7.5 2" stroke="#DCA84E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                      {i}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/login" className="pill pill-paper" style={{ width:'100%' }}>
                  Assinar Premium ✦
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="sec" id="faq" style={{ paddingTop:0 }}>
          <div className="sec-inner" style={{ textAlign:'center' }}>
            <div className="sec-label js-up" style={{ justifyContent:'center' }}>Dúvidas</div>
            <h2 className="sec-h2 js-up">Perguntas <em>frequentes</em></h2>

            <div className="faq-wrap" style={{ textAlign:'left' }}>
              {[
                { q:'Posso cancelar a qualquer momento?', a:'Sim, sem burocracia e sem multa. Após cancelar, você continua com acesso premium até o fim do período já pago.' },
                { q:'Precisa instalar algum app?', a:'Não! O Josi funciona 100% no navegador do celular, tablet ou computador. É só abrir e usar — sem ocupar espaço no seu aparelho.' },
                { q:'Não tenho experiência com treino. Funciona pra mim?', a:'Sim! O conteúdo foi pensado para todos os níveis. Você começa do zero com calma e evolui no seu ritmo — sem pressão.' },
                { q:'Com que frequência tem conteúdo novo?', a:'Toda semana saem novidades — aulas, receitas e materiais. E a cada mês tem um desafio novo pra te manter em movimento.' },
                { q:'A comunidade é moderada?', a:'Sim. A comunidade tem regras claras de respeito e acolhimento. É um espaço seguro, sem julgamentos.' },
              ].map(({ q, a }) => (
                <div key={q} className="fq js-up">
                  <button className="fq-btn" onClick={e => toggleFaq(e.currentTarget)}>
                    <span className="fq-q">{q}</span>
                    <span className="fq-icon">+</span>
                  </button>
                  <div className="fq-a">{a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="cta-section">
          <div style={{ position:'relative', zIndex:1, maxWidth:600, margin:'0 auto' }}>
            <div className="sec-label js-up">Pronta pra começar?</div>
            <h2 className="cta-h js-up">
              A segunda-feira<br/><b>é hoje.</b>
            </h2>
            <p className="cta-sub js-up">
              Crie sua conta grátis agora. Sem cartão, sem compromisso. Só você e a sua melhor versão.
            </p>
            <div className="js-up">
              <Link href="/auth/login" className="pill pill-rust pill-lg">
                Começar agora — é grátis ✦
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-logo">Josi</div>
          <div className="footer-copy">© 2025 Josi App · Todos os direitos reservados</div>
          <div className="footer-links">
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
          </div>
        </footer>

      </div>
    </>
  )
}
