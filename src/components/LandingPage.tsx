'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {
  ShoppingBag, Heart, Users, PawPrint, BookOpen, Sparkles,
  Leaf, ChefHat, Baby, Check, ArrowRight, Star,
  Layers, MessageCircle, Repeat2,
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

  const Logo = ({ light }: { light?: boolean }) => (
    <svg viewBox="0 0 200 44" width="126" height="38" xmlns="http://www.w3.org/2000/svg" aria-label="Josi — Vida & Conteúdo">
      <defs>
        <linearGradient id={light ? 'lgg-l' : 'lgg-d'} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={light ? '#E8A890' : '#C9826B'}/>
          <stop offset="100%" stopColor={light ? '#E4C08A' : '#D4A96A'}/>
        </linearGradient>
      </defs>
      <text x="0" y="38" fontFamily="'Cormorant Garamond',Georgia,serif" fontSize="46" fontWeight="500" fontStyle="italic" fill={`url(#${light ? 'lgg-l' : 'lgg-d'})`}>J</text>
      <text x="28" y="36" fontFamily="'Cormorant Garamond',Georgia,serif" fontSize="38" fontWeight="400" fontStyle="italic" fill={light ? '#FDF8F3' : '#4A2E22'}>osi</text>
      <circle cx="98" cy="32" r="2.5" fill={light ? 'rgba(253,248,243,.4)' : '#D4A96A'}/>
      <text x="106" y="36" fontFamily="'DM Sans',system-ui,sans-serif" fontSize="10" fontWeight="400" letterSpacing="2" fill={light ? 'rgba(253,248,243,.38)' : '#8A6A5A'}>VIDA &amp; CONTEÚDO</text>
    </svg>
  )

  const cats = [
    { Icon: ShoppingBag, name: 'Comprinhas',  iconColor: 'var(--color-primary)',   iconBg: 'var(--color-primary-light-bg)',   desc: 'Hauls da Shopee e Shein — tudo que eu amei de verdade' },
    { Icon: Heart,        name: 'Casal',        iconColor: 'var(--color-primary)',   iconBg: 'var(--color-primary-light-bg)',   desc: 'A vida com o Jeck, os perrengues e os momentos mais lindos' },
    { Icon: Users,        name: 'Família',      iconColor: 'var(--color-secondary)', iconBg: 'var(--color-secondary-light-bg)', desc: 'A Isabeli e tudo que ser mãe ensina' },
    { Icon: PawPrint,     name: 'Pets',         iconColor: 'var(--color-pets)',      iconBg: 'var(--color-pets-bg)',            desc: 'Nossos bichinhos e as aventuras no campo' },
    { Icon: BookOpen,     name: 'Cursos',       iconColor: 'var(--color-primary)',   iconBg: 'var(--color-primary-light-bg)',   desc: 'Aprenda com a Josi — passo a passo, sem enrolação' },
    { Icon: Sparkles,     name: 'Skincare',     iconColor: 'var(--color-skincare)',  iconBg: 'var(--color-skincare-bg)',        desc: 'Rotina de pele simples que funciona — eu uso, juro' },
    { Icon: Leaf,         name: 'Chácara',      iconColor: 'var(--color-secondary)', iconBg: 'var(--color-secondary-light-bg)', desc: 'Vida no campo, natureza e a liberdade que eu escolhi' },
    { Icon: ChefHat,      name: 'Receitas',     iconColor: 'var(--color-primary)',   iconBg: 'var(--color-primary-light-bg)',   desc: 'Da minha cozinha pra sua mesa — testadas e aprovadas' },
    { Icon: Baby,         name: 'Maternidade',  iconColor: 'var(--color-error)',     iconBg: 'var(--color-error-bg)',           desc: 'O que ninguém te conta sobre ser mãe — real e sem filtro' },
  ]

  const phoneCats = [
    { Icon: ShoppingBag, name: 'Comprinhas', c: '#C9826B' },
    { Icon: Leaf,        name: 'Chácara',    c: '#8A9E7B' },
    { Icon: ChefHat,     name: 'Receitas',   c: '#C9826B' },
    { Icon: Heart,       name: 'Casal',      c: '#C9826B' },
    { Icon: Sparkles,    name: 'Skincare',   c: '#9E7090' },
    { Icon: PawPrint,    name: 'Pets',       c: '#B08A50' },
  ]

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Cormorant+Garamond:ital,wght@1,300;1,400;1,500;1,600&display=swap"
        rel="stylesheet"
      />
      <style>{`
/* ─── Design System Tokens ─────────────────────────────────── */
:root {
  /* Brand palette */
  --color-primary:          #C9826B;
  --color-primary-hover:    #B8705A;
  --color-primary-light:    #F0D5C8;
  --color-primary-light-bg: rgba(201,130,107,.1);
  --color-secondary:        #8A9E7B;
  --color-secondary-hover:  #7A8E6B;
  --color-secondary-light-bg: rgba(138,158,123,.1);
  --color-accent:           #D4A96A;
  --color-accent-light:     #F0DEBB;

  /* Backgrounds */
  --color-bg:               #F5EDE3;
  --color-bg-alt:           #EDE0D3;
  --color-bg-dark:          #3A2218;
  --color-bg-deeper:        #2E1A10;
  --color-surface:          #FDF8F3;

  /* Text */
  --color-text:             #4A2E22;
  --color-text-muted:       #8A6A5A;
  --color-text-subtle:      #B89B8C;
  --color-text-on-dark:     #FDF8F3;

  /* Borders */
  --color-border:           #E8D8CC;
  --color-border-strong:    #D4BEB2;

  /* Extended LP palette */
  --color-skincare:         #9E7090;
  --color-skincare-bg:      rgba(158,112,144,.1);
  --color-pets:             #B08A50;
  --color-pets-bg:          rgba(176,138,80,.1);
  --color-error:            #C96B6B;
  --color-error-bg:         rgba(201,107,107,.1);
  --color-success:          #7BA68A;

  /* Typography scale */
  --text-xs:    11px;
  --text-sm:    13px;
  --text-base:  15px;
  --text-md:    17px;
  --text-lg:    20px;
  --text-xl:    24px;
  --text-2xl:   30px;
  --text-3xl:   38px;
  --text-4xl:   48px;

  /* Spacing */
  --space-1:    4px;
  --space-2:    8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   20px;
  --space-6:   24px;
  --space-8:   32px;
  --space-10:  40px;
  --space-12:  48px;
  --space-16:  64px;
  --space-20:  80px;

  /* Border radius */
  --radius-sm:   8px;
  --radius-md:   14px;
  --radius-lg:   20px;
  --radius-xl:   24px;
  --radius-2xl:  32px;
  --radius-pill: 100px;

  /* Shadows — warm-toned */
  --shadow-xs:      0 1px 4px  rgba(74,46,34,.06);
  --shadow-sm:      0 2px 8px  rgba(74,46,34,.08);
  --shadow-md:      0 4px 16px rgba(74,46,34,.12);
  --shadow-lg:      0 8px 32px rgba(74,46,34,.16);
  --shadow-xl:      0 16px 48px rgba(74,46,34,.20);
  --shadow-primary: 0 4px 16px rgba(201,130,107,.35);
  --shadow-primary-lg: 0 8px 28px rgba(201,130,107,.45);
  --shadow-accent:  0 4px 16px rgba(212,169,106,.35);

  /* Transitions */
  --ease-out:        cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in:         cubic-bezier(0.64, 0, 0.78, 0);
  --duration-fast:   150ms;
  --duration-normal: 250ms;
  --duration-slow:   400ms;
}

/* ─── Reset & base ─────────────────────────────────────────── */
.lp, .lp *, .lp *::before, .lp *::after { box-sizing:border-box; margin:0; padding:0; }
.lp { font-family:'DM Sans',system-ui,sans-serif; background:var(--color-bg); color:var(--color-text); overflow-x:hidden; -webkit-font-smoothing:antialiased; }
.lp a { text-decoration:none; color:inherit; }
.lp button { font-family:'DM Sans',system-ui,sans-serif; cursor:pointer; border:none; background:none; }

/* ─── Focus accessibility ──────────────────────────────────── */
.lp a:focus-visible,
.lp button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}

/* ─── Navigation ───────────────────────────────────────────── */
.lp-nav {
  position:fixed; top:0; left:0; right:0; z-index:200;
  height:60px; padding:0 clamp(var(--space-5),5vw,var(--space-16));
  display:flex; align-items:center; justify-content:space-between;
  background:rgba(245,237,227,.9); /* --color-bg at 90% */
  backdrop-filter:blur(16px) saturate(1.4);
  border-bottom:1px solid rgba(232,216,204,.6); /* --color-border at 60% */
}
.lp-nav-links { display:flex; align-items:center; gap:var(--space-8); }
.lp-nav-links a { font-size:var(--text-sm); font-weight:400; color:var(--color-text-muted); letter-spacing:.01em; transition:color var(--duration-fast) var(--ease-out); }
.lp-nav-links a:hover { color:var(--color-primary); }
@media(max-width:700px) { .lp-nav-links { display:none; } }

/* ─── Buttons ──────────────────────────────────────────────── */
.btn {
  display:inline-flex; align-items:center; justify-content:center; gap:var(--space-2);
  font-family:'DM Sans',system-ui,sans-serif; font-weight:500;
  border-radius:var(--radius-pill); border:none; cursor:pointer;
  transition:transform var(--duration-normal) var(--ease-out),
             box-shadow var(--duration-normal) var(--ease-out),
             background var(--duration-fast) var(--ease-out);
  white-space:nowrap; letter-spacing:.01em;
}
.btn-primary {
  background:var(--color-primary); color:var(--color-text-on-dark);
  box-shadow:var(--shadow-primary); font-size:var(--text-sm); padding:var(--space-3) var(--space-8);
}
.btn-primary:hover { background:var(--color-primary-hover); transform:translateY(-2px); box-shadow:var(--shadow-primary-lg); }
.btn-outline {
  background:transparent; border:1.5px solid rgba(201,130,107,.5);
  color:var(--color-primary); font-size:var(--text-sm); padding:var(--space-3) var(--space-6);
}
.btn-outline:hover { background:var(--color-primary-light-bg); border-color:var(--color-primary); }
.btn-lg { font-size:var(--text-base); padding:var(--space-4) var(--space-8); }
.btn-sm { font-size:var(--text-sm); padding:var(--space-2) var(--space-5); }
.btn-dark { background:var(--color-text); color:var(--color-text-on-dark); font-size:var(--text-sm); padding:var(--space-3) var(--space-8); box-shadow:var(--shadow-md); }
.btn-dark:hover { background:#3A2218; transform:translateY(-2px); }
.btn-ghost-light {
  background:rgba(253,248,243,.12); border:1px solid rgba(253,248,243,.25);
  color:var(--color-text-on-dark); font-size:var(--text-sm); padding:var(--space-3) var(--space-8);
}
.btn-ghost-light:hover { background:rgba(253,248,243,.2); }

/* ─── Hero ─────────────────────────────────────────────────── */
.hero {
  min-height:100svh; background:var(--color-bg);
  display:flex; align-items:center;
  padding:var(--space-20) clamp(var(--space-5),6vw,72px) var(--space-16);
  gap:clamp(var(--space-10),6vw,var(--space-20));
}
.hero-text { flex:1; max-width:560px; }
.hero-visual { flex-shrink:0; display:flex; align-items:center; justify-content:center; }
@media(max-width:860px) { .hero { flex-direction:column; text-align:center; padding-top:100px; } .hero-visual { display:none; } }

.hero-tag {
  display:inline-flex; align-items:center; gap:var(--space-2);
  background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-pill);
  padding:var(--space-1) var(--space-4) var(--space-1) var(--space-2); margin-bottom:var(--space-8);
  font-size:var(--text-xs); font-weight:500; color:var(--color-text-muted); letter-spacing:.02em;
  box-shadow:var(--shadow-xs);
  animation:fadeUp var(--duration-slow) var(--ease-out) both;
}
.hero-tag-dot {
  width:22px; height:22px; border-radius:50%;
  background:linear-gradient(135deg,var(--color-primary),var(--color-accent));
  display:flex; align-items:center; justify-content:center;
}

.hero-h1 {
  font-family:'Playfair Display',Georgia,serif;
  font-size:clamp(40px,7vw,76px); font-weight:600;
  line-height:1.06; letter-spacing:-.025em; color:var(--color-text);
  margin-bottom:var(--space-6);
  animation:fadeUp var(--duration-slow) 80ms var(--ease-out) both;
}
.hero-h1 em { font-style:italic; font-weight:400; color:var(--color-primary); }

.hero-sub {
  font-family:'Cormorant Garamond',Georgia,serif;
  font-style:italic; font-size:clamp(var(--text-md),2.4vw,22px); font-weight:400;
  color:var(--color-text-muted); line-height:1.65; max-width:480px; margin-bottom:var(--space-10);
  animation:fadeUp var(--duration-slow) 160ms var(--ease-out) both;
}
@media(max-width:860px) { .hero-sub { margin:0 auto var(--space-10); } }

.hero-btns { display:flex; gap:var(--space-3); flex-wrap:wrap; animation:fadeUp var(--duration-slow) 240ms var(--ease-out) both; }
@media(max-width:860px) { .hero-btns { justify-content:center; } }

.hero-proof {
  display:flex; align-items:center; gap:var(--space-3); margin-top:var(--space-10);
  animation:fadeUp var(--duration-slow) 320ms var(--ease-out) both;
  font-size:var(--text-sm); color:var(--color-text-muted); font-weight:400;
}
@media(max-width:860px) { .hero-proof { justify-content:center; } }
.av-stack { display:flex; }
.av {
  width:var(--space-8); height:var(--space-8); border-radius:50%;
  border:2px solid var(--color-bg); margin-left:-7px;
  background:linear-gradient(135deg,var(--color-primary),var(--color-accent));
  display:flex; align-items:center; justify-content:center;
  font-family:'Playfair Display',serif; font-size:var(--text-xs); font-weight:600; color:var(--color-text-on-dark);
}
.av:first-child { margin-left:0; }

/* Phone mockup */
.phone-wrap { transform:rotate(3.5deg); filter:drop-shadow(0 24px 48px rgba(74,46,34,.18)); }
.phone {
  width:228px; height:454px; border-radius:var(--radius-2xl);
  background:var(--color-surface); border:2px solid var(--color-border);
  overflow:hidden; position:relative;
}
.phone-bar {
  height:var(--space-3); background:var(--color-bg);
  display:flex; align-items:center; justify-content:center;
}
.phone-notch { width:52px; height:5px; border-radius:var(--radius-pill); background:var(--color-border); }
.phone-body { padding:var(--space-2) var(--space-4) var(--space-4); }
.phone-greeting { font-size:var(--text-xs); color:var(--color-text-muted); margin-bottom:var(--space-1); font-weight:400; }
.phone-title { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:var(--text-lg); font-weight:500; color:var(--color-primary); margin-bottom:var(--space-3); }
.phone-cat-grid { display:grid; grid-template-columns:1fr 1fr; gap:var(--space-1); }
.phone-cat {
  background:var(--color-bg); border-radius:var(--radius-sm); padding:var(--space-2);
  display:flex; align-items:center; gap:var(--space-1);
  font-size:var(--text-xs); font-weight:500; color:var(--color-text);
  border:1px solid var(--color-border);
}
.phone-divider { height:1px; background:var(--color-border); margin:var(--space-3) 0; }
.phone-bottom { display:flex; justify-content:space-around; }
.phone-nav-dot { width:5px; height:5px; border-radius:50%; background:var(--color-primary); }
.phone-nav-dot.inactive { background:var(--color-border-strong); }

/* ─── Stats ────────────────────────────────────────────────── */
.stats-sec {
  background:var(--color-surface);
  border-top:1px solid var(--color-border); border-bottom:1px solid var(--color-border);
  padding:clamp(var(--space-12),6vw,72px) clamp(var(--space-5),6vw,var(--space-16));
}
.stats-grid { max-width:900px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:2px; }
@media(max-width:680px) { .stats-grid { grid-template-columns:1fr 1fr; gap:clamp(var(--space-6),5vw,var(--space-10)); } }
.stat-item { text-align:center; padding:var(--space-4) var(--space-2); }
.stat-n {
  font-family:'Playfair Display',Georgia,serif;
  font-size:clamp(var(--text-2xl),5vw,var(--text-4xl)); font-weight:600;
  color:var(--color-primary); line-height:1; letter-spacing:-.02em;
}
.stat-l { font-size:var(--text-sm); font-weight:400; color:var(--color-text-muted); margin-top:var(--space-2); letter-spacing:.01em; }

/* ─── Section scaffolding ──────────────────────────────────── */
.sec { padding:clamp(72px,9vw,108px) clamp(var(--space-5),6vw,72px); }
.sec-inner { max-width:1080px; margin:0 auto; }
.sec-bg-alt { background:var(--color-surface); }
.sec-header { margin-bottom:clamp(var(--space-10),5vw,var(--space-12)); }
.sec-label {
  font-size:var(--text-xs); font-weight:600; letter-spacing:.14em; text-transform:uppercase;
  color:var(--color-primary); margin-bottom:var(--space-4); display:flex; align-items:center; gap:var(--space-3);
}
.sec-label::before { content:''; width:var(--space-5); height:1.5px; background:var(--color-primary); border-radius:2px; }
.sec-h2 {
  font-family:'Playfair Display',Georgia,serif;
  font-size:clamp(var(--text-2xl),4.2vw,46px); font-weight:600;
  line-height:1.12; letter-spacing:-.02em; color:var(--color-text);
}
.sec-h2 em { font-style:italic; font-weight:400; color:var(--color-primary); }
.sec-p { font-size:var(--text-base); font-weight:300; color:var(--color-text-muted); line-height:1.78; max-width:500px; margin-top:var(--space-4); }

/* ─── Features ─────────────────────────────────────────────── */
.feat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(var(--space-3),2vw,var(--space-6)); margin-top:clamp(var(--space-10),5vw,var(--space-12)); }
@media(max-width:780px) { .feat-grid { grid-template-columns:1fr; } }
.feat-card {
  background:var(--color-bg); border-radius:var(--radius-lg); padding:clamp(var(--space-6),3vw,var(--space-10));
  border:1px solid rgba(232,216,204,.8);
  transition:transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out);
}
.feat-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); }
.feat-icon-wrap {
  width:var(--space-12); height:var(--space-12); border-radius:var(--radius-md);
  display:flex; align-items:center; justify-content:center; margin-bottom:var(--space-5);
}
.feat-title { font-family:'Playfair Display',serif; font-size:var(--text-lg); font-weight:600; color:var(--color-text); margin-bottom:var(--space-3); line-height:1.2; }
.feat-desc { font-size:var(--text-sm); font-weight:300; color:var(--color-text-muted); line-height:1.72; }

/* ─── Category grid ────────────────────────────────────────── */
.cat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(var(--space-2),1.5vw,var(--space-4)); margin-top:clamp(var(--space-10),5vw,var(--space-12)); }
@media(max-width:820px) { .cat-grid { grid-template-columns:1fr 1fr; } }
@media(max-width:500px) { .cat-grid { grid-template-columns:1fr; } }
.cat-card {
  background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-lg);
  padding:var(--space-5) var(--space-5); display:flex; align-items:flex-start; gap:var(--space-4);
  transition:transform var(--duration-normal) var(--ease-out),
             box-shadow var(--duration-normal) var(--ease-out),
             border-color var(--duration-fast) var(--ease-out);
}
.cat-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); border-color:var(--color-border-strong); }
.cat-icon { width:var(--space-10); height:var(--space-10); border-radius:var(--radius-sm); flex-shrink:0; display:flex; align-items:center; justify-content:center; }
.cat-name { font-family:'Playfair Display',serif; font-size:var(--text-base); font-weight:600; color:var(--color-text); margin-bottom:var(--space-1); }
.cat-desc { font-size:var(--text-sm); font-weight:300; color:var(--color-text-muted); line-height:1.55; }

/* ─── Quote ────────────────────────────────────────────────── */
.quote-sec {
  background:var(--color-text); /* --color-marrom-cacau = #4A2E22 */
  padding:clamp(var(--space-16),9vw,96px) clamp(var(--space-5),10vw,120px);
  text-align:center; position:relative; overflow:hidden;
}
.quote-sec::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(ellipse 80% 70% at 50% 50%, rgba(201,130,107,.1), transparent 60%);
}
.quote-ornament {
  font-family:'Cormorant Garamond',serif; font-style:italic;
  font-size:clamp(80px,14vw,140px); line-height:.65;
  color:rgba(212,169,106,.2); /* --color-accent at 20% */
  margin-bottom:-10px; display:block; position:relative; z-index:1;
}
.quote-text {
  font-family:'Cormorant Garamond',Georgia,serif; font-style:italic;
  font-size:clamp(var(--text-lg),3.2vw,var(--text-2xl)); font-weight:400;
  color:var(--color-text-on-dark); line-height:1.58; max-width:760px; margin:0 auto;
  position:relative; z-index:1;
}
.quote-author {
  margin-top:var(--space-8); font-size:var(--text-xs); font-weight:500;
  letter-spacing:.1em; text-transform:uppercase;
  color:rgba(253,248,243,.4); position:relative; z-index:1;
}
.quote-rule {
  width:var(--space-8); height:1.5px; background:rgba(212,169,106,.5);
  margin:var(--space-5) auto 0; position:relative; z-index:1;
}

/* ─── Testimonials ─────────────────────────────────────────── */
.testi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(var(--space-3),2vw,var(--space-5)); margin-top:clamp(var(--space-10),5vw,var(--space-12)); }
@media(max-width:840px) { .testi-grid { grid-template-columns:1fr 1fr; } }
@media(max-width:540px) { .testi-grid { grid-template-columns:1fr; } }
.testi-card {
  background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-lg);
  padding:clamp(var(--space-5),3vw,var(--space-8)); display:flex; flex-direction:column;
  transition:transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out);
}
.testi-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); }
.testi-stars { display:flex; gap:var(--space-1); margin-bottom:var(--space-4); }
.testi-q {
  font-family:'Cormorant Garamond',Georgia,serif; font-style:italic;
  font-size:var(--text-md); font-weight:400; color:var(--color-text); line-height:1.6;
  flex:1; margin-bottom:var(--space-5);
}
.testi-sep { width:var(--space-5); height:1.5px; background:var(--color-border); margin-bottom:var(--space-4); }
.testi-author { display:flex; align-items:center; gap:var(--space-3); }
.testi-av {
  width:var(--space-10); height:var(--space-10); border-radius:50%; flex-shrink:0;
  background:linear-gradient(135deg,var(--color-primary),var(--color-accent));
  display:flex; align-items:center; justify-content:center;
  font-family:'Playfair Display',serif; font-size:var(--text-sm); font-weight:600; color:var(--color-text-on-dark);
}
.testi-name { font-size:var(--text-sm); font-weight:600; color:var(--color-text); }
.testi-role { font-size:var(--text-xs); color:var(--color-text-muted); margin-top:2px; }

/* ─── Pricing ──────────────────────────────────────────────── */
.price-grid { display:grid; grid-template-columns:1fr 1fr; gap:clamp(var(--space-4),2vw,var(--space-6)); max-width:760px; margin:clamp(var(--space-10),5vw,var(--space-12)) auto 0; }
@media(max-width:560px) { .price-grid { grid-template-columns:1fr; } }
.price-card {
  border-radius:var(--radius-xl); padding:clamp(var(--space-8),4vw,var(--space-10));
  border:1.5px solid var(--color-border); background:var(--color-surface);
  display:flex; flex-direction:column;
  transition:transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out);
}
.price-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-lg); }
.price-featured { background:var(--color-primary); border-color:transparent; box-shadow:var(--shadow-primary); }
.price-featured:hover { box-shadow:var(--shadow-primary-lg); }
.price-eyebrow {
  font-size:var(--text-xs); font-weight:600; letter-spacing:.12em; text-transform:uppercase;
  color:var(--color-accent); margin-bottom:var(--space-5); display:flex; align-items:center; gap:var(--space-2);
}
.price-featured .price-eyebrow { color:rgba(253,248,243,.65); }
.price-eyebrow::after { content:''; flex:1; height:1px; background:var(--color-accent-light); opacity:.3; }
.price-featured .price-eyebrow::after { background:rgba(253,248,243,.2); opacity:1; }
.price-name { font-family:'Playfair Display',serif; font-size:var(--text-xl); font-weight:600; color:var(--color-text); margin-bottom:var(--space-3); }
.price-featured .price-name { color:var(--color-text-on-dark); }
.price-amount { font-family:'Playfair Display',serif; font-size:var(--text-4xl); font-weight:600; line-height:1; color:var(--color-text); }
.price-featured .price-amount { color:var(--color-text-on-dark); }
.price-amount sup { font-size:var(--text-md); vertical-align:top; margin-top:var(--space-3); }
.price-per { font-size:var(--text-sm); font-weight:300; color:var(--color-text-muted); margin-top:var(--space-1); margin-bottom:var(--space-5); }
.price-featured .price-per { color:rgba(253,248,243,.55); }
.price-line { height:1px; background:var(--color-border); margin-bottom:var(--space-5); }
.price-featured .price-line { background:rgba(253,248,243,.18); }
.price-list { list-style:none; flex:1; display:flex; flex-direction:column; gap:var(--space-3); margin-bottom:var(--space-8); }
.price-list li { display:flex; align-items:flex-start; gap:var(--space-3); font-size:var(--text-sm); font-weight:300; color:var(--color-text-muted); line-height:1.45; }
.price-featured .price-list li { color:rgba(253,248,243,.8); }
.chk { width:17px; height:17px; border-radius:50%; flex-shrink:0; margin-top:1px; background:var(--color-primary-light-bg); display:flex; align-items:center; justify-content:center; }
.price-featured .chk { background:rgba(253,248,243,.2); }

/* ─── FAQ ──────────────────────────────────────────────────── */
.faq-list { max-width:660px; margin:clamp(var(--space-10),5vw,var(--space-12)) auto 0; }
.fq { border-bottom:1px solid var(--color-border); }
.fq:first-child { border-top:1px solid var(--color-border); }
.fq-btn { width:100%; display:flex; align-items:center; justify-content:space-between; padding:var(--space-5) 0; gap:var(--space-4); text-align:left; }
.fq-q { font-family:'Playfair Display',serif; font-size:var(--text-md); font-weight:500; color:var(--color-text); flex:1; line-height:1.35; }
.fq-icon {
  width:26px; height:26px; border-radius:50%; flex-shrink:0;
  border:1.5px solid var(--color-border-strong); color:var(--color-primary);
  display:flex; align-items:center; justify-content:center; font-size:var(--text-md);
  transition:transform var(--duration-normal) var(--ease-out),
             background var(--duration-fast) var(--ease-out),
             border-color var(--duration-fast) var(--ease-out);
}
.fq.open .fq-icon { transform:rotate(45deg); background:var(--color-primary); border-color:var(--color-primary); color:var(--color-text-on-dark); }
.fq-a { max-height:0; overflow:hidden; transition:max-height var(--duration-slow) var(--ease-out), padding var(--duration-normal) var(--ease-out); font-size:var(--text-sm); font-weight:300; color:var(--color-text-muted); line-height:1.78; }
.fq.open .fq-a { max-height:200px; padding-bottom:var(--space-5); }

/* ─── CTA ──────────────────────────────────────────────────── */
.cta-sec {
  background:var(--color-bg-dark);
  padding:clamp(72px,10vw,108px) clamp(var(--space-5),6vw,72px);
  text-align:center; position:relative; overflow:hidden;
}
.cta-sec::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(ellipse 60% 70% at 50% 50%, rgba(201,130,107,.12), transparent 55%);
}
.cta-inner { max-width:600px; margin:0 auto; position:relative; z-index:1; }
.cta-h {
  font-family:'Playfair Display',Georgia,serif;
  font-size:clamp(var(--text-2xl),6vw,60px); font-weight:600; line-height:1.12;
  letter-spacing:-.02em; color:var(--color-text-on-dark); margin-bottom:var(--space-4);
}
.cta-h em { font-style:italic; font-weight:400; color:var(--color-accent); }
.cta-sub {
  font-family:'Cormorant Garamond',Georgia,serif; font-style:italic;
  font-size:clamp(var(--text-md),2.2vw,21px); color:rgba(253,248,243,.5);
  line-height:1.68; max-width:460px; margin:0 auto var(--space-10);
}
.cta-btns { display:flex; gap:var(--space-3); justify-content:center; flex-wrap:wrap; }

/* ─── Footer ───────────────────────────────────────────────── */
.footer {
  background:var(--color-bg-deeper);
  padding:var(--space-6) clamp(var(--space-5),6vw,72px);
  display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:var(--space-3);
}
.footer-copy { font-size:var(--text-xs); color:rgba(253,248,243,.2); }
.footer-links { display:flex; gap:var(--space-5); }
.footer-links a { font-size:var(--text-xs); color:rgba(253,248,243,.2); transition:color var(--duration-fast) var(--ease-out); }
.footer-links a:hover { color:rgba(253,248,243,.5); }
@media(max-width:480px) { .footer { flex-direction:column; align-items:flex-start; } }

/* ─── Animations ───────────────────────────────────────────── */
@keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
.up { opacity:0; transform:translateY(22px); transition:opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out); }
.up:nth-child(2) { transition-delay:70ms }  .up:nth-child(3) { transition-delay:140ms }
.up:nth-child(4) { transition-delay:210ms } .up:nth-child(5) { transition-delay:280ms }
.up:nth-child(6) { transition-delay:350ms } .up:nth-child(7) { transition-delay:420ms }
.up:nth-child(8) { transition-delay:490ms } .up:nth-child(9) { transition-delay:560ms }
.in { opacity:1 !important; transform:none !important; }

@media(max-width:480px) {
  .sec { padding:60px var(--space-5); }
  .quote-sec { padding:60px var(--space-6); }
  .cta-sec { padding:68px var(--space-6); }
}
      `}</style>

      <div className="lp">

        {/* ── NAV ──────────────────────────────────────────────── */}
        <header className="lp-nav" role="banner">
          <Logo />
          <nav className="lp-nav-links" aria-label="Navegação principal">
            <a href="#conteudo">Conteúdo</a>
            <a href="#depoimentos">Comunidade</a>
            <a href="#planos">Planos</a>
          </nav>
          <Link href="/auth/login" className="btn btn-primary btn-sm">Entrar no app</Link>
        </header>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-text">
            <div className="hero-tag" aria-hidden="true">
              <div className="hero-tag-dot">
                <Leaf size={11} color="#FDF8F3" strokeWidth={2} />
              </div>
              App oficial · Josi Vida &amp; Conteúdo
            </div>

            <h1 id="hero-heading" className="hero-h1">
              Tudo que eu vivo<br />e amo,{' '}
              <em>num lugar só<br />pra você</em>
            </h1>

            <p className="hero-sub">
              Receitas que saíram da minha cozinha, skincare do jeito que funciona, comprinhas que me apaixonei — reunido aqui, com muito carinho.
            </p>

            <div className="hero-btns">
              <Link href="/auth/login" className="btn btn-primary btn-lg">
                Quero fazer parte
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <a href="#conteudo" className="btn btn-outline btn-lg">
                Ver o conteúdo
              </a>
            </div>

            <div className="hero-proof" aria-label="Mais de 1200 membros na comunidade">
              <div className="av-stack" aria-hidden="true">
                {['A','C','M','L','R'].map((l, i) => (
                  <div key={i} className="av">{l}</div>
                ))}
              </div>
              <span>+1.200 pessoas já fazem parte</span>
            </div>
          </div>

          {/* Phone mockup — decorative */}
          <div className="hero-visual" aria-hidden="true">
            <div className="phone-wrap">
              <div className="phone">
                <div className="phone-bar"><div className="phone-notch" /></div>
                <div className="phone-body">
                  <div className="phone-greeting">Oi, bem-vinda de volta!</div>
                  <div className="phone-title">Josi · Vida &amp; Conteúdo</div>
                  <div className="phone-cat-grid">
                    {phoneCats.map(({ Icon, name, c }) => (
                      <div key={name} className="phone-cat">
                        <Icon size={13} color={c} strokeWidth={1.75} />
                        {name}
                      </div>
                    ))}
                  </div>
                  <div className="phone-divider" />
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', fontWeight: 500, letterSpacing: '.04em', textTransform: 'uppercase' }}>Hoje na chácara</div>
                  <div style={{ background: 'var(--color-primary-light-bg)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-3)', border: '1px solid var(--color-primary-light)', opacity: .9 }}>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--space-1)' }}>Receita: Pão de queijo da fazenda</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 300 }}>Simples, rápido e que todo mundo ama</div>
                  </div>
                  <div className="phone-divider" />
                  <div className="phone-bottom">
                    <div className="phone-nav-dot" />
                    <div className="phone-nav-dot inactive" />
                    <div className="phone-nav-dot inactive" />
                    <div className="phone-nav-dot inactive" />
                    <div className="phone-nav-dot inactive" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────── */}
        <div className="stats-sec" aria-label="Números da Josi nas redes sociais">
          <div className="stats-grid">
            {[
              { n: '280k',   l: 'seguidoras no TikTok'   },
              { n: '157k',   l: 'inscritas no YouTube'   },
              { n: '61,6k',  l: 'seguidoras no Instagram' },
              { n: '+1.200', l: 'membros no app'          },
            ].map(s => (
              <div key={s.l} className="stat-item up">
                <div className="stat-n">{s.n}</div>
                <div className="stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES ─────────────────────────────────────────── */}
        <section className="sec sec-bg-alt" id="sobre" aria-labelledby="features-heading">
          <div className="sec-inner">
            <div className="sec-header">
              <div className="sec-label up">Por que o app</div>
              <h2 id="features-heading" className="sec-h2 up">
                Um espaço criado com<br /><em>carinho pra você</em>
              </h2>
              <p className="sec-p up">
                Não é mais um aplicativo qualquer. É onde a Josi coloca o que ela ama — organizado, fácil de achar e com a cara dela.
              </p>
            </div>
            <div className="feat-grid">
              {[
                { Icon: Layers,      title: 'Conteúdo organizado',   desc: 'Tudo no lugar certo — sem ficar garimpando em mil plataformas. Receita, skincare, chácara: cada coisa no seu cantinho.', bg: 'var(--color-primary-light-bg)',   color: 'var(--color-primary)' },
                { Icon: MessageCircle, title: 'Comunidade de verdade', desc: 'Um espaço seguro, acolhedor e sem julgamentos. A ideia é que pareça uma roda de amigas — porque é exatamente isso.',   bg: 'var(--color-secondary-light-bg)', color: 'var(--color-secondary)' },
                { Icon: Repeat2,     title: 'Sempre tem novidade',    desc: 'A Josi adiciona conteúdo toda semana — receita nova, tutorial de skincare, comprinhas. Nunca vai faltar o que explorar.', bg: 'var(--color-accent-light)',       color: 'var(--color-accent)' },
              ].map(({ Icon, title, desc, bg, color }) => (
                <div key={title} className="feat-card up">
                  <div className="feat-icon-wrap" style={{ background: bg }}>
                    <Icon size={22} color={color} strokeWidth={1.75} />
                  </div>
                  <div className="feat-title">{title}</div>
                  <div className="feat-desc">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ───────────────────────────────────────── */}
        <section className="sec" id="conteudo" aria-labelledby="cats-heading">
          <div className="sec-inner">
            <div className="sec-header">
              <div className="sec-label up">Categorias</div>
              <h2 id="cats-heading" className="sec-h2 up">
                Cada cantinho da minha vida<br /><em>tem um espaço aqui</em>
              </h2>
              <p className="sec-p up">
                Do campo à cozinha, da skincare às comprinhas — tudo que a Josi faz com amor, organizado pra você.
              </p>
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

        {/* ── QUOTE ────────────────────────────────────────────── */}
        <blockquote className="quote-sec">
          <span className="quote-ornament up" aria-hidden="true">"</span>
          <p className="quote-text up">
            Criei esse app porque queria um espaço nosso. Só seu e meu. Como se você estivesse aqui na chácara, tomando um café comigo e a gente conversando sobre tudo.
          </p>
          <div className="quote-rule up" aria-hidden="true" />
          <footer className="quote-author up">Josiane Ferraz</footer>
        </blockquote>

        {/* ── TESTIMONIALS ─────────────────────────────────────── */}
        <section className="sec sec-bg-alt" id="depoimentos" aria-labelledby="testi-heading">
          <div className="sec-inner">
            <div className="sec-header">
              <div className="sec-label up">Comunidade</div>
              <h2 id="testi-heading" className="sec-h2 up">O que as meninas <em>estão falando</em></h2>
            </div>
            <div className="testi-grid">
              {[
                { i: 'A', name: 'Ana Paula S.', role: 'Membro desde o lançamento', text: '"Finalmente tudo num só lugar! Já fiz três receitas da Josi e as três deram certo. E a comunidade é muito acolhedora — me sinto em casa."' },
                { i: 'C', name: 'Carol M.',     role: 'Veio pelo skincare',        text: '"A rotina de pele da Josi mudou minha vida. Simples, sem complicação. Ter o passo a passo no app facilita demais — abro toda manhã."' },
                { i: 'M', name: 'Mariana T.',   role: 'Fã do canal no YouTube',   text: '"Parece que ela está do meu lado falando. O tom é tão gostoso, parece uma amiga de verdade. Adoro os vídeos da chácara no app."' },
              ].map((t, i) => (
                <article key={t.name} className="testi-card up" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="testi-stars" aria-label="5 estrelas">
                    {[...Array(5)].map((_, k) => <Star key={k} size={12} color="#D4A96A" fill="#D4A96A" aria-hidden="true" />)}
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

        {/* ── PRICING ──────────────────────────────────────────── */}
        <section className="sec" id="planos" aria-labelledby="pricing-heading">
          <div className="sec-inner" style={{ textAlign: 'center' }}>
            <div className="sec-label up" style={{ justifyContent: 'center' }}>Planos</div>
            <h2 id="pricing-heading" className="sec-h2 up">Comece de graça,<br /><em>vá mais longe com Premium</em></h2>
            <p className="sec-p up" style={{ margin: 'var(--space-4) auto 0', textAlign: 'center' }}>
              Crie sua conta agora — sem precisar de cartão.
            </p>
            <div className="price-grid">
              <div className="price-card up">
                <div className="price-name">Gratuito</div>
                <div className="price-amount">R$<sup></sup>0</div>
                <div className="price-per">para sempre</div>
                <div className="price-line" />
                <ul className="price-list" aria-label="Benefícios do plano Gratuito">
                  {['Acesso à comunidade','Conteúdo introdutório','Perfil personalizado','Publicações e interações'].map(item => (
                    <li key={item}>
                      <span className="chk" aria-hidden="true"><Check size={9} color="var(--color-primary)" strokeWidth={3} /></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/login" className="btn btn-outline" style={{ width: '100%' }}>
                  Criar conta grátis
                </Link>
              </div>
              <div className="price-card price-featured up">
                <div className="price-eyebrow">Mais escolhido</div>
                <div className="price-name">Premium</div>
                <div className="price-amount"><sup>R$</sup>47</div>
                <div className="price-per">por mês · cancele quando quiser</div>
                <div className="price-line" />
                <ul className="price-list" aria-label="Benefícios do plano Premium">
                  {['Tudo do plano Gratuito','Cursos completos da Josi','Receitas e tutoriais exclusivos','Rotina completa de skincare','Conteúdo da chácara e dos pets','Novidades toda semana'].map(item => (
                    <li key={item}>
                      <span className="chk" aria-hidden="true"><Check size={9} color="var(--color-text-on-dark)" strokeWidth={3} /></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/login" className="btn btn-dark" style={{ width: '100%', background: 'var(--color-surface)', color: 'var(--color-text)' }}>
                  Quero o Premium
                  <ArrowRight size={15} strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="sec sec-bg-alt" id="faq" style={{ paddingTop: 0 }} aria-labelledby="faq-heading">
          <div className="sec-inner" style={{ textAlign: 'center' }}>
            <div className="sec-label up" style={{ justifyContent: 'center' }}>Dúvidas</div>
            <h2 id="faq-heading" className="sec-h2 up">Perguntas <em>frequentes</em></h2>
            <div className="faq-list" style={{ textAlign: 'left' }} role="list">
              {[
                { q: 'Precisa instalar algum aplicativo?', a: 'Não! O app da Josi funciona direto no navegador do celular, tablet ou computador — é só entrar no site e usar. Simples assim.' },
                { q: 'Posso cancelar quando quiser?', a: 'Sim, sem multa e sem burocracia. Se cancelar, você continua com acesso Premium até o final do período já pago.' },
                { q: 'Com que frequência tem conteúdo novo?', a: 'A Josi adiciona novidades toda semana — receitas, tutoriais de skincare, vídeos da chácara e muito mais.' },
                { q: 'A comunidade é moderada?', a: 'Sim, com muito carinho. A ideia é que seja um espaço seguro, acolhedor e sem julgamentos — igualzinho à vibe da Josi.' },
                { q: 'O plano Gratuito vale a pena?', a: 'Com certeza! Você já tem acesso à comunidade e ao conteúdo de entrada. O Premium desbloqueia os cursos, tutoriais completos e os exclusivos.' },
              ].map(({ q, a }, idx) => (
                <div key={q} className="fq up" role="listitem">
                  <button
                    className="fq-btn"
                    aria-expanded="false"
                    aria-controls={`faq-answer-${idx}`}
                    onClick={e => toggleFaq(e.currentTarget)}
                  >
                    <span className="fq-q">{q}</span>
                    <span className="fq-icon" aria-hidden="true">+</span>
                  </button>
                  <div id={`faq-answer-${idx}`} className="fq-a" role="region">
                    {a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="cta-sec" aria-labelledby="cta-heading">
          <div className="cta-inner">
            <h2 id="cta-heading" className="cta-h up">
              Vem fazer parte<br /><em>da nossa história</em>
            </h2>
            <p className="cta-sub up">
              Cria sua conta agora e começa a explorar. É de graça, é gostoso e tem muito carinho — prometo.
            </p>
            <div className="cta-btns up">
              <Link href="/auth/login" className="btn btn-primary btn-lg">
                Criar minha conta grátis
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <Link href="/auth/login" className="btn btn-ghost-light btn-lg">
                Já tenho conta
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────── */}
        <footer className="footer" role="contentinfo">
          <Logo light />
          <div className="footer-copy">© 2025 Josi App · Josiane Szewczuk Ferraz · Todos os direitos reservados</div>
          <nav className="footer-links" aria-label="Links do rodapé">
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
          </nav>
        </footer>

      </div>
    </>
  )
}
