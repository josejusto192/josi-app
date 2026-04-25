'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShoppingBag, Heart, Users, PawPrint, BookOpen, Sparkles,
  Leaf, ChefHat, Baby, Check, ArrowRight, Star,
  Sun, Scale, Target, TrendingUp,
} from 'lucide-react'

export default function LandingPage() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      }),
      { threshold: 0.06 }
    )
    document.querySelectorAll('.up').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  const toggleFaq = (btn: HTMLButtonElement) => {
    const item = btn.closest('.fq') as HTMLElement
    const open = item.classList.contains('open')
    document.querySelectorAll<HTMLElement>('.fq.open').forEach(i => {
      i.classList.remove('open')
      i.querySelector<HTMLButtonElement>('.fq-btn')?.setAttribute('aria-expanded', 'false')
    })
    if (!open) {
      item.classList.add('open')
      btn.setAttribute('aria-expanded', 'true')
    }
  }

  const cats = [
    { Icon: ShoppingBag, name: 'Comprinhas',  iconColor: '#2F4A3B', iconBg: 'rgba(47,74,59,.1)',   desc: 'Curadoria de produtos que a Josi ama e indica com cuidado' },
    { Icon: Heart,        name: 'Casal',        iconColor: '#2F4A3B', iconBg: 'rgba(47,74,59,.1)',   desc: 'Relacionamento com intenção — parceria, amor e crescimento' },
    { Icon: Users,        name: 'Família',      iconColor: '#6B7F63', iconBg: 'rgba(107,127,99,.1)', desc: 'Maternidade real e momentos que ficam para sempre' },
    { Icon: PawPrint,     name: 'Pets',         iconColor: '#C49A5A', iconBg: 'rgba(196,154,90,.12)', desc: 'Vida com os animais e a paz da natureza ao redor' },
    { Icon: BookOpen,     name: 'Cursos',       iconColor: '#2F4A3B', iconBg: 'rgba(47,74,59,.1)',   desc: 'Aprenda passo a passo, no seu ritmo e com propósito' },
    { Icon: Sparkles,     name: 'Skincare',     iconColor: '#9E7090', iconBg: 'rgba(158,112,144,.1)', desc: 'Cuidar de si começa de fora para dentro — com leveza' },
    { Icon: Leaf,         name: 'Chácara',      iconColor: '#6B7F63', iconBg: 'rgba(107,127,99,.1)', desc: 'Conexão com a natureza, o campo e a vida simples' },
    { Icon: ChefHat,      name: 'Receitas',     iconColor: '#2F4A3B', iconBg: 'rgba(47,74,59,.1)',   desc: 'Alimentação com carinho — simples, saudável e deliciosa' },
    { Icon: Baby,         name: 'Maternidade',  iconColor: '#B05555', iconBg: 'rgba(176,85,85,.1)',  desc: 'A jornada de ser mãe com verdade, força e amor' },
  ]

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Lato:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap"
        rel="stylesheet"
      />
      <style>{`
/* ─── Design System Tokens ─────────────────────────────────── */
:root {
  --color-primary:          #2F4A3B;
  --color-primary-hover:    #243A2D;
  --color-primary-light:    #D4E3D8;
  --color-primary-light-bg: rgba(47,74,59,.1);
  --color-secondary:        #6B7F63;
  --color-secondary-light-bg: rgba(107,127,99,.1);
  --color-accent:           #C49A5A;
  --color-accent-light:     #EDD9B0;
  --color-accent-light-bg:  rgba(196,154,90,.12);
  --color-bg:               #F3E9DC;
  --color-bg-alt:           #EBE0CF;
  --color-bg-dark:          #243A2D;
  --color-bg-deeper:        #1A2B20;
  --color-surface:          #FAF7F2;
  --color-text:             #2F4A3B;
  --color-text-muted:       #6B7F63;
  --color-text-subtle:      #9DB09A;
  --color-text-on-dark:     #FAF7F2;
  --color-border:           #DDD5C5;
  --color-border-strong:    #C8BEAE;
  --color-error:            #B05555;
  --text-xs:    11px; --text-sm:   13px; --text-base: 15px;
  --text-md:    17px; --text-lg:   20px; --text-xl:   24px;
  --text-2xl:   30px; --text-3xl:  38px; --text-4xl:  48px;
  --space-1:  4px; --space-2:  8px; --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px;
  --space-12: 48px; --space-16: 64px; --space-20: 80px;
  --radius-sm: 8px; --radius-md: 14px; --radius-lg: 20px;
  --radius-xl: 24px; --radius-2xl: 32px; --radius-pill: 100px;
  --shadow-xs:  0 1px 4px  rgba(47,74,59,.06);
  --shadow-sm:  0 2px 8px  rgba(47,74,59,.08);
  --shadow-md:  0 4px 16px rgba(47,74,59,.12);
  --shadow-lg:  0 8px 32px rgba(47,74,59,.16);
  --shadow-xl:  0 16px 48px rgba(47,74,59,.20);
  --shadow-primary:    0 4px 16px rgba(47,74,59,.28);
  --shadow-primary-lg: 0 8px 28px rgba(47,74,59,.38);
  --shadow-accent:     0 4px 16px rgba(196,154,90,.35);
  --ease-out:        cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast:   150ms; --duration-normal: 250ms; --duration-slow: 400ms;
}

/* ─── Reset ─────────────────────────────────────────────────── */
.lp, .lp *, .lp *::before, .lp *::after { box-sizing:border-box; margin:0; padding:0; }
.lp { font-family:'Lato',system-ui,sans-serif; background:var(--color-bg); color:var(--color-text); overflow-x:hidden; -webkit-font-smoothing:antialiased; }
.lp a { text-decoration:none; color:inherit; }
.lp button { font-family:'Lato',system-ui,sans-serif; cursor:pointer; border:none; background:none; }
.lp a:focus-visible, .lp button:focus-visible { outline:2px solid var(--color-primary); outline-offset:3px; border-radius:var(--radius-sm); }

/* ─── Nav ────────────────────────────────────────────────────── */
.lp-nav {
  position:fixed; top:0; left:0; right:0; z-index:200;
  height:64px; padding:0 clamp(var(--space-5),5vw,var(--space-16));
  display:flex; align-items:center; justify-content:space-between;
  background:rgba(243,233,220,.92); backdrop-filter:blur(18px) saturate(1.4);
  border-bottom:1px solid rgba(221,213,197,.7);
}
.lp-nav-links { display:flex; align-items:center; gap:var(--space-8); }
.lp-nav-links a { font-size:var(--text-sm); font-weight:400; color:var(--color-text-muted); letter-spacing:.06em; text-transform:uppercase; transition:color var(--duration-fast) var(--ease-out); }
.lp-nav-links a:hover { color:var(--color-primary); }
@media(max-width:700px) { .lp-nav-links { display:none; } }

/* ─── Buttons ────────────────────────────────────────────────── */
.btn { display:inline-flex; align-items:center; justify-content:center; gap:var(--space-2); font-family:'Lato',system-ui,sans-serif; font-weight:700; border-radius:var(--radius-pill); border:none; cursor:pointer; transition:transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out), background var(--duration-fast) var(--ease-out); white-space:nowrap; letter-spacing:.08em; text-transform:uppercase; }
.btn-primary { background:var(--color-primary); color:var(--color-text-on-dark); box-shadow:var(--shadow-primary); font-size:var(--text-sm); padding:var(--space-3) var(--space-8); }
.btn-primary:hover { background:var(--color-primary-hover); transform:translateY(-2px); box-shadow:var(--shadow-primary-lg); }
.btn-outline { background:transparent; border:1.5px solid rgba(47,74,59,.4); color:var(--color-primary); font-size:var(--text-sm); padding:var(--space-3) var(--space-6); }
.btn-outline:hover { background:var(--color-primary-light-bg); border-color:var(--color-primary); }
.btn-accent { background:var(--color-accent); color:var(--color-text-on-dark); box-shadow:var(--shadow-accent); font-size:var(--text-sm); padding:var(--space-3) var(--space-8); }
.btn-accent:hover { background:#B08844; transform:translateY(-2px); }
.btn-lg { font-size:var(--text-sm); padding:var(--space-4) var(--space-10); }
.btn-sm { font-size:var(--text-xs); padding:var(--space-2) var(--space-5); }
.btn-ghost-light { background:rgba(250,247,242,.12); border:1px solid rgba(250,247,242,.3); color:var(--color-text-on-dark); font-size:var(--text-sm); padding:var(--space-3) var(--space-8); }
.btn-ghost-light:hover { background:rgba(250,247,242,.2); }

/* ─── Hero ───────────────────────────────────────────────────── */
.hero { min-height:100svh; background:var(--color-bg); display:flex; align-items:center; padding:var(--space-20) clamp(var(--space-5),6vw,72px) var(--space-16); gap:clamp(var(--space-10),6vw,var(--space-20)); }
.hero-text { flex:1; max-width:580px; }
.hero-logo-wrap { display:flex; align-items:center; justify-content:center; flex-shrink:0; }
@media(max-width:900px) { .hero { flex-direction:column; text-align:center; padding-top:100px; } .hero-logo-wrap { display:none; } }

.hero-eyebrow { font-size:var(--text-xs); font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:var(--color-accent); margin-bottom:var(--space-5); display:flex; align-items:center; gap:var(--space-3); animation:fadeUp var(--duration-slow) var(--ease-out) both; }
.hero-eyebrow-line { width:32px; height:1px; background:var(--color-accent); }

.hero-h1 { font-family:'Cinzel',Georgia,serif; font-size:clamp(36px,6vw,68px); font-weight:600; line-height:1.12; letter-spacing:.04em; text-transform:uppercase; color:var(--color-primary); margin-bottom:var(--space-4); animation:fadeUp var(--duration-slow) 80ms var(--ease-out) both; }
.hero-h1 span { display:block; font-size:.55em; font-weight:400; color:var(--color-accent); letter-spacing:.12em; margin-top:var(--space-2); }

.hero-tagline { font-size:clamp(var(--text-base),2.2vw,var(--text-lg)); font-style:italic; font-weight:300; color:var(--color-text-muted); line-height:1.7; max-width:460px; margin-bottom:var(--space-10); animation:fadeUp var(--duration-slow) 160ms var(--ease-out) both; }
@media(max-width:900px) { .hero-tagline { margin:0 auto var(--space-10); } }

.hero-values { display:flex; gap:var(--space-6); margin-bottom:var(--space-10); flex-wrap:wrap; animation:fadeUp var(--duration-slow) 200ms var(--ease-out) both; }
@media(max-width:900px) { .hero-values { justify-content:center; } }
.hero-value { display:flex; align-items:center; gap:var(--space-2); font-size:var(--text-xs); font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--color-text-muted); }
.hero-value-dot { width:6px; height:6px; border-radius:50%; background:var(--color-accent); flex-shrink:0; }

.hero-btns { display:flex; gap:var(--space-3); flex-wrap:wrap; animation:fadeUp var(--duration-slow) 240ms var(--ease-out) both; }
@media(max-width:900px) { .hero-btns { justify-content:center; } }

.hero-proof { display:flex; align-items:center; gap:var(--space-3); margin-top:var(--space-10); animation:fadeUp var(--duration-slow) 300ms var(--ease-out) both; font-size:var(--text-sm); color:var(--color-text-muted); }
@media(max-width:900px) { .hero-proof { justify-content:center; } }
.av-stack { display:flex; }
.av { width:var(--space-8); height:var(--space-8); border-radius:50%; border:2px solid var(--color-bg); margin-left:-7px; background:linear-gradient(135deg,var(--color-primary),var(--color-secondary)); display:flex; align-items:center; justify-content:center; font-family:'Cinzel',serif; font-size:var(--text-xs); font-weight:600; color:var(--color-text-on-dark); }
.av:first-child { margin-left:0; }

/* ─── Stats ──────────────────────────────────────────────────── */
.stats-sec { background:var(--color-primary); padding:clamp(var(--space-12),6vw,72px) clamp(var(--space-5),6vw,var(--space-16)); }
.stats-grid { max-width:900px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:2px; }
@media(max-width:680px) { .stats-grid { grid-template-columns:1fr 1fr; gap:var(--space-8); } }
.stat-item { text-align:center; padding:var(--space-4) var(--space-2); }
.stat-n { font-family:'Cinzel',Georgia,serif; font-size:clamp(var(--text-2xl),5vw,var(--text-4xl)); font-weight:600; color:var(--color-accent); line-height:1; letter-spacing:.04em; }
.stat-l { font-size:var(--text-sm); font-weight:300; color:rgba(250,247,242,.65); margin-top:var(--space-2); letter-spacing:.04em; text-transform:uppercase; }

/* ─── Section scaffolding ────────────────────────────────────── */
.sec { padding:clamp(72px,9vw,108px) clamp(var(--space-5),6vw,72px); }
.sec-inner { max-width:1080px; margin:0 auto; }
.sec-bg-alt { background:var(--color-surface); }
.sec-bg-green { background:var(--color-bg-dark); }
.sec-header { margin-bottom:clamp(var(--space-10),5vw,var(--space-12)); }
.sec-eyebrow { font-size:var(--text-xs); font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:var(--color-accent); margin-bottom:var(--space-4); display:flex; align-items:center; gap:var(--space-3); }
.sec-eyebrow::before { content:''; width:24px; height:1px; background:var(--color-accent); }
.sec-h2 { font-family:'Cinzel',Georgia,serif; font-size:clamp(var(--text-xl),3.8vw,42px); font-weight:600; line-height:1.2; letter-spacing:.06em; text-transform:uppercase; color:var(--color-text); }
.sec-h2.light { color:var(--color-text-on-dark); }
.sec-p { font-size:var(--text-base); font-weight:300; color:var(--color-text-muted); line-height:1.8; max-width:500px; margin-top:var(--space-4); }
.sec-p.light { color:rgba(250,247,242,.65); }

/* ─── Values strip ───────────────────────────────────────────── */
.values-strip { display:grid; grid-template-columns:repeat(4,1fr); gap:2px; margin-top:clamp(var(--space-10),5vw,var(--space-12)); }
@media(max-width:800px) { .values-strip { grid-template-columns:1fr 1fr; gap:var(--space-3); } }
.value-card { background:rgba(250,247,242,.06); border-radius:var(--radius-lg); padding:clamp(var(--space-6),3vw,var(--space-10)); text-align:center; border:1px solid rgba(250,247,242,.1); transition:transform var(--duration-normal) var(--ease-out); }
.value-card:hover { transform:translateY(-3px); background:rgba(250,247,242,.1); }
.value-icon { width:var(--space-12); height:var(--space-12); border-radius:50%; background:rgba(196,154,90,.2); display:flex; align-items:center; justify-content:center; margin:0 auto var(--space-4); }
.value-title { font-family:'Cinzel',serif; font-size:var(--text-sm); font-weight:600; color:var(--color-text-on-dark); letter-spacing:.1em; text-transform:uppercase; margin-bottom:var(--space-2); }
.value-desc { font-size:var(--text-sm); font-weight:300; color:rgba(250,247,242,.55); line-height:1.65; }

/* ─── Category grid ──────────────────────────────────────────── */
.cat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(var(--space-2),1.5vw,var(--space-4)); margin-top:clamp(var(--space-10),5vw,var(--space-12)); }
@media(max-width:820px) { .cat-grid { grid-template-columns:1fr 1fr; } }
@media(max-width:500px) { .cat-grid { grid-template-columns:1fr; } }
.cat-card { background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-lg); padding:var(--space-5); display:flex; align-items:flex-start; gap:var(--space-4); transition:transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out), border-color var(--duration-fast) var(--ease-out); }
.cat-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); border-color:var(--color-border-strong); }
.cat-icon { width:var(--space-10); height:var(--space-10); border-radius:var(--radius-sm); flex-shrink:0; display:flex; align-items:center; justify-content:center; }
.cat-name { font-family:'Cinzel',serif; font-size:var(--text-sm); font-weight:600; color:var(--color-text); margin-bottom:var(--space-1); letter-spacing:.06em; text-transform:uppercase; }
.cat-desc { font-size:var(--text-sm); font-weight:300; color:var(--color-text-muted); line-height:1.6; }

/* ─── Quote ──────────────────────────────────────────────────── */
.quote-sec { background:var(--color-surface); border-top:1px solid var(--color-border); border-bottom:1px solid var(--color-border); padding:clamp(var(--space-16),9vw,96px) clamp(var(--space-5),10vw,120px); text-align:center; }
.quote-mark { font-family:'Cinzel',serif; font-size:clamp(60px,10vw,100px); line-height:.6; color:rgba(196,154,90,.25); margin-bottom:-var(--space-4); display:block; }
.quote-text { font-size:clamp(var(--text-lg),3vw,var(--text-2xl)); font-style:italic; font-weight:300; color:var(--color-text); line-height:1.65; max-width:760px; margin:0 auto; }
.quote-author { margin-top:var(--space-8); font-family:'Cinzel',serif; font-size:var(--text-xs); font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--color-accent); }
.quote-sub { font-size:var(--text-xs); color:var(--color-text-muted); margin-top:var(--space-1); letter-spacing:.06em; }

/* ─── Testimonials ───────────────────────────────────────────── */
.testi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(var(--space-3),2vw,var(--space-5)); margin-top:clamp(var(--space-10),5vw,var(--space-12)); }
@media(max-width:840px) { .testi-grid { grid-template-columns:1fr 1fr; } }
@media(max-width:540px) { .testi-grid { grid-template-columns:1fr; } }
.testi-card { background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-lg); padding:clamp(var(--space-5),3vw,var(--space-8)); display:flex; flex-direction:column; transition:transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out); }
.testi-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); }
.testi-stars { display:flex; gap:var(--space-1); margin-bottom:var(--space-4); }
.testi-q { font-size:var(--text-base); font-style:italic; font-weight:300; color:var(--color-text); line-height:1.65; flex:1; margin-bottom:var(--space-5); }
.testi-sep { width:var(--space-5); height:1px; background:var(--color-border); margin-bottom:var(--space-4); }
.testi-author { display:flex; align-items:center; gap:var(--space-3); }
.testi-av { width:var(--space-10); height:var(--space-10); border-radius:50%; flex-shrink:0; background:linear-gradient(135deg,var(--color-primary),var(--color-secondary)); display:flex; align-items:center; justify-content:center; font-family:'Cinzel',serif; font-size:var(--text-sm); font-weight:600; color:var(--color-text-on-dark); }
.testi-name { font-size:var(--text-sm); font-weight:700; color:var(--color-text); letter-spacing:.02em; }
.testi-role { font-size:var(--text-xs); color:var(--color-text-muted); margin-top:2px; }

/* ─── Pricing ────────────────────────────────────────────────── */
.price-grid { display:grid; grid-template-columns:1fr 1fr; gap:clamp(var(--space-4),2vw,var(--space-6)); max-width:760px; margin:clamp(var(--space-10),5vw,var(--space-12)) auto 0; }
@media(max-width:560px) { .price-grid { grid-template-columns:1fr; } }
.price-card { border-radius:var(--radius-xl); padding:clamp(var(--space-8),4vw,var(--space-10)); border:1.5px solid var(--color-border); background:var(--color-surface); display:flex; flex-direction:column; transition:transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out); }
.price-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-lg); }
.price-featured { background:var(--color-primary); border-color:transparent; box-shadow:var(--shadow-primary); }
.price-featured:hover { box-shadow:var(--shadow-primary-lg); }
.price-eyebrow { font-size:var(--text-xs); font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:var(--color-accent); margin-bottom:var(--space-5); display:flex; align-items:center; gap:var(--space-2); }
.price-featured .price-eyebrow { color:rgba(250,247,242,.6); }
.price-eyebrow::after { content:''; flex:1; height:1px; background:rgba(196,154,90,.2); }
.price-featured .price-eyebrow::after { background:rgba(250,247,242,.18); }
.price-name { font-family:'Cinzel',serif; font-size:var(--text-xl); font-weight:600; color:var(--color-text); margin-bottom:var(--space-3); letter-spacing:.06em; text-transform:uppercase; }
.price-featured .price-name { color:var(--color-text-on-dark); }
.price-amount { font-family:'Cinzel',serif; font-size:var(--text-4xl); font-weight:600; line-height:1; color:var(--color-text); }
.price-featured .price-amount { color:var(--color-text-on-dark); }
.price-amount sup { font-size:var(--text-md); vertical-align:top; margin-top:var(--space-3); }
.price-per { font-size:var(--text-sm); font-weight:300; color:var(--color-text-muted); margin-top:var(--space-1); margin-bottom:var(--space-5); }
.price-featured .price-per { color:rgba(250,247,242,.55); }
.price-line { height:1px; background:var(--color-border); margin-bottom:var(--space-5); }
.price-featured .price-line { background:rgba(250,247,242,.18); }
.price-list { list-style:none; flex:1; display:flex; flex-direction:column; gap:var(--space-3); margin-bottom:var(--space-8); }
.price-list li { display:flex; align-items:flex-start; gap:var(--space-3); font-size:var(--text-sm); font-weight:300; color:var(--color-text-muted); line-height:1.45; }
.price-featured .price-list li { color:rgba(250,247,242,.8); }
.chk { width:17px; height:17px; border-radius:50%; flex-shrink:0; margin-top:1px; background:var(--color-primary-light-bg); display:flex; align-items:center; justify-content:center; }
.price-featured .chk { background:rgba(250,247,242,.2); }

/* ─── FAQ ────────────────────────────────────────────────────── */
.faq-list { max-width:660px; margin:clamp(var(--space-10),5vw,var(--space-12)) auto 0; }
.fq { border-bottom:1px solid var(--color-border); }
.fq:first-child { border-top:1px solid var(--color-border); }
.fq-btn { width:100%; display:flex; align-items:center; justify-content:space-between; padding:var(--space-5) 0; gap:var(--space-4); text-align:left; }
.fq-q { font-family:'Cinzel',serif; font-size:var(--text-base); font-weight:500; color:var(--color-text); flex:1; line-height:1.4; letter-spacing:.03em; }
.fq-icon { width:26px; height:26px; border-radius:50%; flex-shrink:0; border:1.5px solid var(--color-border-strong); color:var(--color-primary); display:flex; align-items:center; justify-content:center; font-size:var(--text-md); transition:transform var(--duration-normal) var(--ease-out), background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out); }
.fq.open .fq-icon { transform:rotate(45deg); background:var(--color-primary); border-color:var(--color-primary); color:var(--color-text-on-dark); }
.fq-a { max-height:0; overflow:hidden; transition:max-height var(--duration-slow) var(--ease-out), padding var(--duration-normal) var(--ease-out); font-size:var(--text-sm); font-weight:300; color:var(--color-text-muted); line-height:1.8; }
.fq.open .fq-a { max-height:200px; padding-bottom:var(--space-5); }

/* ─── CTA ────────────────────────────────────────────────────── */
.cta-sec { background:var(--color-bg-dark); padding:clamp(72px,10vw,108px) clamp(var(--space-5),6vw,72px); text-align:center; position:relative; overflow:hidden; }
.cta-sec::before { content:''; position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse 70% 60% at 50% 50%, rgba(196,154,90,.08), transparent 55%); }
.cta-inner { max-width:600px; margin:0 auto; position:relative; z-index:1; }
.cta-h { font-family:'Cinzel',Georgia,serif; font-size:clamp(var(--text-2xl),6vw,56px); font-weight:600; line-height:1.15; letter-spacing:.06em; text-transform:uppercase; color:var(--color-text-on-dark); margin-bottom:var(--space-4); }
.cta-h span { display:block; color:var(--color-accent); }
.cta-sub { font-size:clamp(var(--text-base),2vw,var(--text-lg)); font-style:italic; font-weight:300; color:rgba(250,247,242,.5); line-height:1.7; max-width:460px; margin:0 auto var(--space-10); }
.cta-btns { display:flex; gap:var(--space-3); justify-content:center; flex-wrap:wrap; }

/* ─── Footer ─────────────────────────────────────────────────── */
.footer { background:var(--color-bg-deeper); padding:var(--space-8) clamp(var(--space-5),6vw,72px); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-4); border-top:1px solid rgba(250,247,242,.06); }
.footer-copy { font-size:var(--text-xs); color:rgba(250,247,242,.2); letter-spacing:.04em; }
.footer-links { display:flex; gap:var(--space-5); }
.footer-links a { font-size:var(--text-xs); color:rgba(250,247,242,.2); letter-spacing:.04em; text-transform:uppercase; transition:color var(--duration-fast) var(--ease-out); }
.footer-links a:hover { color:rgba(250,247,242,.5); }
@media(max-width:480px) { .footer { flex-direction:column; align-items:flex-start; } .sec { padding:60px var(--space-5); } .cta-sec { padding:68px var(--space-6); } }

/* ─── Animations ─────────────────────────────────────────────── */
@keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
.up { opacity:0; transform:translateY(22px); transition:opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out); }
.up:nth-child(2){transition-delay:70ms} .up:nth-child(3){transition-delay:140ms}
.up:nth-child(4){transition-delay:210ms} .up:nth-child(5){transition-delay:280ms}
.up:nth-child(6){transition-delay:350ms} .up:nth-child(7){transition-delay:420ms}
.up:nth-child(8){transition-delay:490ms} .up:nth-child(9){transition-delay:560ms}
.in { opacity:1 !important; transform:none !important; }
      `}</style>

      <div className="lp">

        {/* ── NAV ────────────────────────────────────────────── */}
        <header className="lp-nav" role="banner">
          <Image src="/logo-viverbem.svg" alt="Viver Bem by Josiane Szewczuk" width={80} height={76} style={{ objectFit: 'contain' }} priority />
          <nav className="lp-nav-links" aria-label="Navegação principal">
            <a href="#valores">Valores</a>
            <a href="#conteudo">Conteúdo</a>
            <a href="#depoimentos">Comunidade</a>
            <a href="#planos">Planos</a>
          </nav>
          <Link href="/auth/login" className="btn btn-primary btn-sm">Entrar</Link>
        </header>

        {/* ── HERO ───────────────────────────────────────────── */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-text">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-line" />
              Terapeuta · Mentora · Palestrante
            </div>

            <h1 id="hero-heading" className="hero-h1">
              Viver Bem
              <span>by Josiane Szewczuk</span>
            </h1>

            <p className="hero-tagline">
              Vivendo o hoje, cultivando o melhor de mim. Um espaço criado com intenção para você encontrar equilíbrio, propósito e bem-estar real.
            </p>

            <div className="hero-values">
              {['Bem-estar','Equilíbrio','Propósito','Crescimento'].map(v => (
                <div key={v} className="hero-value">
                  <span className="hero-value-dot" />
                  {v}
                </div>
              ))}
            </div>

            <div className="hero-btns">
              <Link href="/auth/login" className="btn btn-primary btn-lg">
                Começar minha jornada
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <a href="#conteudo" className="btn btn-outline btn-lg">
                Conhecer o app
              </a>
            </div>

            <div className="hero-proof" aria-label="Mais de 1200 membros">
              <div className="av-stack" aria-hidden="true">
                {['A','C','M','L','R'].map((l, i) => <div key={i} className="av">{l}</div>)}
              </div>
              <span>+1.200 pessoas na jornada</span>
            </div>
          </div>

          {/* Logo hero — desktop only */}
          <div className="hero-logo-wrap" aria-hidden="true">
            <Image
              src="/logo-viverbem.svg"
              alt=""
              width={340}
              height={323}
              style={{ objectFit: 'contain', opacity: .9 }}
              priority
            />
          </div>
        </section>

        {/* ── STATS ──────────────────────────────────────────── */}
        <div className="stats-sec" aria-label="Números da Josiane nas redes">
          <div className="stats-grid">
            {[
              { n:'280k', l:'no TikTok' },
              { n:'157k', l:'no YouTube' },
              { n:'61,6k', l:'no Instagram' },
              { n:'+1.200', l:'membros no app' },
            ].map(s => (
              <div key={s.l} className="stat-item up">
                <div className="stat-n">{s.n}</div>
                <div className="stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── VALORES ────────────────────────────────────────── */}
        <section className="sec sec-bg-green" id="valores" aria-labelledby="values-heading">
          <div className="sec-inner">
            <div className="sec-header" style={{ textAlign:'center' }}>
              <div className="sec-eyebrow up" style={{ justifyContent:'center' }}>Nossos pilares</div>
              <h2 id="values-heading" className="sec-h2 light up">O que guia cada passo</h2>
              <p className="sec-p light up" style={{ margin:'var(--space-4) auto 0', textAlign:'center' }}>
                Cada conteúdo, cada aula, cada conversa — construídos sobre esses quatro pilares.
              </p>
            </div>
            <div className="values-strip">
              {[
                { Icon: Sun,       title:'Bem-estar',   desc:'Cuidar de si é o primeiro passo. Corpo, mente e emoções em equilíbrio.' },
                { Icon: Scale,     title:'Equilíbrio',  desc:'Harmonia entre o que você sente, pensa e vive no dia a dia.' },
                { Icon: Target,    title:'Propósito',   desc:'Viver com intenção. Cada escolha alinhada ao que realmente importa.' },
                { Icon: TrendingUp,title:'Crescimento', desc:'Pequenas escolhas diárias que constroem grandes transformações.' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="value-card up">
                  <div className="value-icon">
                    <Icon size={22} color="#C49A5A" strokeWidth={1.5} />
                  </div>
                  <div className="value-title">{title}</div>
                  <div className="value-desc">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ─────────────────────────────────────── */}
        <section className="sec" id="conteudo" aria-labelledby="cats-heading">
          <div className="sec-inner">
            <div className="sec-header">
              <div className="sec-eyebrow up">Categorias</div>
              <h2 id="cats-heading" className="sec-h2 up">Tudo reunido em um só lugar</h2>
              <p className="sec-p up">Da alimentação à espiritualidade, dos pets à maternidade — cada área da sua vida tem espaço aqui.</p>
            </div>
            <div className="cat-grid">
              {cats.map(({ Icon, name, iconColor, iconBg, desc }) => (
                <div key={name} className="cat-card up">
                  <div className="cat-icon" style={{ background: iconBg }}>
                    <Icon size={19} color={iconColor} strokeWidth={1.75} />
                  </div>
                  <div>
                    <div className="cat-name">{name}</div>
                    <div className="cat-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUOTE ──────────────────────────────────────────── */}
        <blockquote className="quote-sec">
          <span className="quote-mark up" aria-hidden="true">"</span>
          <p className="quote-text up">
            Não vim ensinar o caminho perfeito. Vim caminhar junto com você, de forma honesta, com o que eu vivo, o que eu aprendo e o que transforma de verdade.
          </p>
          <div className="quote-author up">Josiane Szewczuk</div>
          <div className="quote-sub up">Terapeuta · Mentora · Palestrante</div>
        </blockquote>

        {/* ── TESTIMONIALS ───────────────────────────────────── */}
        <section className="sec sec-bg-alt" id="depoimentos" aria-labelledby="testi-heading">
          <div className="sec-inner">
            <div className="sec-header">
              <div className="sec-eyebrow up">Comunidade</div>
              <h2 id="testi-heading" className="sec-h2 up">Quem já está na jornada</h2>
            </div>
            <div className="testi-grid">
              {[
                { i:'A', name:'Ana Paula S.',  role:'Membro desde o lançamento', text:'"Finalmente um espaço que cuida de mim por inteiro. O conteúdo da Josiane tem profundidade e leveza ao mesmo tempo. Me sinto apoiada."' },
                { i:'C', name:'Carol M.',      role:'Veio pela área de bem-estar', text:'"Comecei pela meditação e fui explorando tudo. Cada categoria conecta com outra. É uma jornada completa, não só conteúdo."' },
                { i:'M', name:'Mariana T.',    role:'Seguia o YouTube há 2 anos', text:'"A Josiane fala do que ela vive. Isso muda tudo. Não é teoria — é experiência real transformada em aprendizado pra gente."' },
              ].map((t, i) => (
                <article key={t.name} className="testi-card up" style={{ transitionDelay:`${i * 100}ms` }}>
                  <div className="testi-stars" aria-label="5 estrelas">
                    {[...Array(5)].map((_, k) => <Star key={k} size={12} color="#C49A5A" fill="#C49A5A" aria-hidden="true" />)}
                  </div>
                  <p className="testi-q">{t.text}</p>
                  <div className="testi-sep" aria-hidden="true" />
                  <div className="testi-author">
                    <div className="testi-av" aria-hidden="true">{t.i}</div>
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-role">{t.role}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ────────────────────────────────────────── */}
        <section className="sec" id="planos" aria-labelledby="pricing-heading">
          <div className="sec-inner" style={{ textAlign:'center' }}>
            <div className="sec-eyebrow up" style={{ justifyContent:'center' }}>Planos</div>
            <h2 id="pricing-heading" className="sec-h2 up">Comece gratuitamente</h2>
            <p className="sec-p up" style={{ margin:'var(--space-4) auto 0', textAlign:'center' }}>
              Crie sua conta agora — sem cartão de crédito.
            </p>
            <div className="price-grid">
              <div className="price-card up">
                <div className="price-name">Gratuito</div>
                <div className="price-amount">R$<sup></sup>0</div>
                <div className="price-per">para sempre</div>
                <div className="price-line" />
                <ul className="price-list" aria-label="Benefícios Gratuito">
                  {['Acesso à comunidade','Conteúdo introdutório','Perfil personalizado','Publicações e interações'].map(item => (
                    <li key={item}>
                      <span className="chk" aria-hidden="true"><Check size={9} color="#2F4A3B" strokeWidth={3} /></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/login" className="btn btn-outline" style={{ width:'100%' }}>Criar conta grátis</Link>
              </div>
              <div className="price-card price-featured up">
                <div className="price-eyebrow">Mais escolhido</div>
                <div className="price-name">Premium</div>
                <div className="price-amount"><sup>R$</sup>47</div>
                <div className="price-per">por mês · cancele quando quiser</div>
                <div className="price-line" />
                <ul className="price-list" aria-label="Benefícios Premium">
                  {['Tudo do plano Gratuito','Cursos completos da Josiane','Conteúdo exclusivo semanal','Meditações e práticas guiadas','Receitas e tutoriais de skincare','Comunidade VIP premium'].map(item => (
                    <li key={item}>
                      <span className="chk" aria-hidden="true"><Check size={9} color="#FAF7F2" strokeWidth={3} /></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/login" className="btn btn-accent" style={{ width:'100%' }}>
                  Quero o Premium
                  <ArrowRight size={15} strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────── */}
        <section className="sec sec-bg-alt" id="faq" style={{ paddingTop:0 }} aria-labelledby="faq-heading">
          <div className="sec-inner" style={{ textAlign:'center' }}>
            <div className="sec-eyebrow up" style={{ justifyContent:'center' }}>Dúvidas</div>
            <h2 id="faq-heading" className="sec-h2 up">Perguntas frequentes</h2>
            <div className="faq-list" style={{ textAlign:'left' }} role="list">
              {[
                { q:'Precisa instalar algum aplicativo?', a:'Não! O app Viver Bem funciona direto no navegador do seu celular, tablet ou computador. É só entrar no site e começar.' },
                { q:'Posso cancelar quando quiser?', a:'Sim, sem multa e sem burocracia. Se cancelar, você mantém o acesso Premium até o final do período pago.' },
                { q:'Com que frequência tem conteúdo novo?', a:'A Josiane adiciona novidades toda semana — práticas, receitas, meditações, cursos e muito mais.' },
                { q:'A comunidade é moderada?', a:'Sim, com muito cuidado. A ideia é um espaço seguro, acolhedor e respeitoso — alinhado com os valores do Viver Bem.' },
                { q:'O plano Gratuito vale a pena?', a:'Com certeza! Você já acessa a comunidade e o conteúdo de entrada. O Premium desbloqueia os cursos, exclusivos e práticas guiadas.' },
              ].map(({ q, a }, idx) => (
                <div key={q} className="fq up" role="listitem">
                  <button className="fq-btn" aria-expanded="false" aria-controls={`faq-a-${idx}`} onClick={e => toggleFaq(e.currentTarget)}>
                    <span className="fq-q">{q}</span>
                    <span className="fq-icon" aria-hidden="true">+</span>
                  </button>
                  <div id={`faq-a-${idx}`} className="fq-a" role="region">{a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────── */}
        <section className="cta-sec" aria-labelledby="cta-heading">
          <div className="cta-inner">
            <h2 id="cta-heading" className="cta-h up">
              Comece hoje.
              <span>A jornada é sua.</span>
            </h2>
            <p className="cta-sub up">
              Crie sua conta agora e dê o primeiro passo em direção ao melhor de você. É gratuito e cheio de intenção.
            </p>
            <div className="cta-btns up">
              <Link href="/auth/login" className="btn btn-accent btn-lg">
                Criar minha conta grátis
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <Link href="/auth/login" className="btn btn-ghost-light btn-lg">
                Já tenho conta
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────── */}
        <footer className="footer" role="contentinfo">
          <Image src="/logo-viverbem.svg" alt="Viver Bem by Josiane Szewczuk" width={60} height={57} style={{ objectFit:'contain', opacity:.4 }} />
          <div className="footer-copy">© 2025 Viver Bem · Josiane Szewczuk · Todos os direitos reservados</div>
          <nav className="footer-links" aria-label="Links do rodapé">
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
          </nav>
        </footer>

      </div>
    </>
  )
}
