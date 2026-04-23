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
    document.querySelectorAll('.fq.open').forEach(i => i.classList.remove('open'))
    if (!open) item.classList.add('open')
  }

  const Logo = ({ light }: { light?: boolean }) => (
    <svg viewBox="0 0 200 44" width="126" height="38" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={light ? 'lgg-l' : 'lgg-d'} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={light ? '#E8A890' : '#C9826B'}/>
          <stop offset="100%" stopColor={light ? '#E4C08A' : '#D4A96A'}/>
        </linearGradient>
      </defs>
      <text x="0" y="38" fontFamily="'Cormorant Garamond',Georgia,serif" fontSize="46" fontWeight="500" fontStyle="italic" fill={`url(#${light ? 'lgg-l' : 'lgg-d'})`}>J</text>
      <text x="28" y="36" fontFamily="'Cormorant Garamond',Georgia,serif" fontSize="38" fontWeight="400" fontStyle="italic" fill={light ? '#FDF8F3' : '#4A2E22'}>osi</text>
      <circle cx="98" cy="32" r="2.5" fill={light ? 'rgba(253,248,243,.45)' : '#D4A96A'}/>
      <text x="106" y="36" fontFamily="'DM Sans',system-ui,sans-serif" fontSize="10" fontWeight="400" letterSpacing="2" fill={light ? 'rgba(253,248,243,.4)' : '#8A6A5A'}>VIDA &amp; CONTEÚDO</text>
    </svg>
  )

  const cats = [
    { Icon: ShoppingBag, name: 'Comprinhas',  iconColor: '#C9826B', iconBg: 'rgba(201,130,107,.1)', desc: 'Hauls da Shopee e Shein — tudo que eu amei de verdade' },
    { Icon: Heart,        name: 'Casal',        iconColor: '#C9826B', iconBg: 'rgba(201,130,107,.1)', desc: 'A vida com o Jeck, os perrengues e os momentos mais lindos' },
    { Icon: Users,        name: 'Família',      iconColor: '#8A9E7B', iconBg: 'rgba(138,158,123,.1)', desc: 'A Isabeli e tudo que ser mãe ensina' },
    { Icon: PawPrint,     name: 'Pets',         iconColor: '#B08A50', iconBg: 'rgba(212,169,106,.1)', desc: 'Nossos bichinhos e as aventuras no campo' },
    { Icon: BookOpen,     name: 'Cursos',       iconColor: '#C9826B', iconBg: 'rgba(201,130,107,.1)', desc: 'Aprenda com a Josi — passo a passo, sem enrolação' },
    { Icon: Sparkles,     name: 'Skincare',     iconColor: '#9E7090', iconBg: 'rgba(158,112,144,.1)', desc: 'Rotina de pele simples que funciona — eu uso, juro' },
    { Icon: Leaf,         name: 'Chácara',      iconColor: '#8A9E7B', iconBg: 'rgba(138,158,123,.1)', desc: 'Vida no campo, natureza e a liberdade que eu escolhi' },
    { Icon: ChefHat,      name: 'Receitas',     iconColor: '#C9826B', iconBg: 'rgba(201,130,107,.1)', desc: 'Da minha cozinha pra sua mesa — testadas e aprovadas' },
    { Icon: Baby,         name: 'Maternidade',  iconColor: '#C96B6B', iconBg: 'rgba(201,107,107,.1)', desc: 'O que ninguém te conta sobre ser mãe — real e sem filtro' },
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
/* ─── Reset & base ─────────────────────────────────────────── */
.lp, .lp *, .lp *::before, .lp *::after { box-sizing:border-box; margin:0; padding:0; }
.lp { font-family:'DM Sans',system-ui,sans-serif; background:#F5EDE3; color:#4A2E22; overflow-x:hidden; -webkit-font-smoothing:antialiased; }
.lp a { text-decoration:none; color:inherit; }
.lp button { font-family:'DM Sans',system-ui,sans-serif; cursor:pointer; border:none; background:none; }

/* ─── Navigation ───────────────────────────────────────────── */
.lp-nav {
  position:fixed; top:0; left:0; right:0; z-index:200;
  height:60px; padding:0 clamp(20px,5vw,56px);
  display:flex; align-items:center; justify-content:space-between;
  background:rgba(245,237,227,.88); backdrop-filter:blur(16px) saturate(1.4);
  border-bottom:1px solid rgba(232,216,204,.6);
}
.lp-nav-links { display:flex; align-items:center; gap:28px; }
.lp-nav-links a { font-size:13px; font-weight:400; color:#8A6A5A; letter-spacing:.01em; transition:color .18s; }
.lp-nav-links a:hover { color:#C9826B; }
@media(max-width:700px) { .lp-nav-links { display:none; } }

/* ─── Buttons ──────────────────────────────────────────────── */
.btn {
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  font-family:'DM Sans',system-ui,sans-serif; font-weight:500;
  border-radius:100px; border:none; cursor:pointer;
  transition:transform .2s, box-shadow .2s, background .18s;
  white-space:nowrap; letter-spacing:.01em;
}
.btn-primary {
  background:#C9826B; color:#FDF8F3;
  box-shadow:0 4px 18px rgba(201,130,107,.32);
  font-size:14px; padding:13px 28px;
}
.btn-primary:hover { background:#B8705A; transform:translateY(-2px); box-shadow:0 8px 28px rgba(201,130,107,.42); }
.btn-outline {
  background:transparent; border:1.5px solid rgba(201,130,107,.5);
  color:#C9826B; font-size:14px; padding:12px 26px;
}
.btn-outline:hover { background:rgba(201,130,107,.06); border-color:#C9826B; }
.btn-lg { font-size:15px; padding:15px 34px; }
.btn-sm { font-size:13px; padding:10px 20px; }
.btn-dark { background:#4A2E22; color:#FDF8F3; font-size:14px; padding:13px 28px; box-shadow:0 4px 18px rgba(74,46,34,.22); }
.btn-dark:hover { background:#3A2218; transform:translateY(-2px); }
.btn-ghost-light { background:rgba(253,248,243,.12); border:1px solid rgba(253,248,243,.25); color:#FDF8F3; font-size:14px; padding:12px 26px; }
.btn-ghost-light:hover { background:rgba(253,248,243,.2); }

/* ─── Hero ─────────────────────────────────────────────────── */
.hero {
  min-height:100svh; background:#F5EDE3;
  display:flex; align-items:center;
  padding:80px clamp(20px,6vw,72px) 60px;
  gap:clamp(40px,6vw,80px);
}
.hero-text { flex:1; max-width:560px; }
.hero-visual { flex-shrink:0; display:flex; align-items:center; justify-content:center; }
@media(max-width:860px) { .hero { flex-direction:column; text-align:center; padding-top:100px; } .hero-visual { display:none; } }

.hero-tag {
  display:inline-flex; align-items:center; gap:8px;
  background:#FDF8F3; border:1px solid #E8D8CC; border-radius:100px;
  padding:5px 14px 5px 8px; margin-bottom:28px;
  font-size:11.5px; font-weight:500; color:#8A6A5A; letter-spacing:.02em;
  box-shadow:0 2px 8px rgba(74,46,34,.07);
  animation:fadeUp .6s ease both;
}
.hero-tag-dot {
  width:22px; height:22px; border-radius:50%;
  background:linear-gradient(135deg,#C9826B,#D4A96A);
  display:flex; align-items:center; justify-content:center;
}

.hero-h1 {
  font-family:'Playfair Display',Georgia,serif;
  font-size:clamp(40px,7vw,76px); font-weight:600;
  line-height:1.06; letter-spacing:-.025em; color:#4A2E22;
  margin-bottom:22px; animation:fadeUp .7s .08s ease both;
}
.hero-h1 em { font-style:italic; font-weight:400; color:#C9826B; }

.hero-sub {
  font-family:'Cormorant Garamond',Georgia,serif;
  font-style:italic; font-size:clamp(17px,2.4vw,22px); font-weight:400;
  color:#8A6A5A; line-height:1.65; max-width:480px; margin-bottom:36px;
  animation:fadeUp .7s .16s ease both;
}
@media(max-width:860px) { .hero-sub { margin:0 auto 36px; } }

.hero-btns { display:flex; gap:12px; flex-wrap:wrap; animation:fadeUp .7s .24s ease both; }
@media(max-width:860px) { .hero-btns { justify-content:center; } }

.hero-proof {
  display:flex; align-items:center; gap:12px; margin-top:36px;
  animation:fadeUp .7s .32s ease both; font-size:13px; color:#8A6A5A; font-weight:400;
}
@media(max-width:860px) { .hero-proof { justify-content:center; } }
.av-stack { display:flex; }
.av {
  width:30px; height:30px; border-radius:50%;
  border:2px solid #F5EDE3; margin-left:-7px;
  background:linear-gradient(135deg,#C9826B,#D4A96A);
  display:flex; align-items:center; justify-content:center;
  font-family:'Playfair Display',serif; font-size:11px; font-weight:600; color:#FDF8F3;
}
.av:first-child { margin-left:0; }

/* Phone mockup */
.phone-wrap { transform:rotate(3.5deg); filter:drop-shadow(0 24px 48px rgba(74,46,34,.18)); }
.phone {
  width:228px; height:454px; border-radius:36px;
  background:#FDF8F3; border:2px solid #E0CEBC;
  overflow:hidden; position:relative;
}
.phone-bar {
  height:12px; background:#F5EDE3;
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.phone-notch { width:52px; height:5px; border-radius:100px; background:#DCCABB; }
.phone-body { padding:10px 14px 14px; }
.phone-greeting { font-size:10.5px; color:#8A6A5A; margin-bottom:5px; font-weight:400; }
.phone-title { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:19px; font-weight:500; color:#C9826B; margin-bottom:14px; }
.phone-cat-grid { display:grid; grid-template-columns:1fr 1fr; gap:7px; }
.phone-cat {
  background:#F5EDE3; border-radius:11px; padding:9px 8px;
  display:flex; align-items:center; gap:6px;
  font-size:10px; font-weight:500; color:#4A2E22;
  border:1px solid #EAD8CA;
}
.phone-divider { height:1px; background:#EDDFD3; margin:13px 0; }
.phone-bottom { display:flex; justify-content:space-around; }
.phone-nav-dot { width:5px; height:5px; border-radius:50%; background:#C9826B; }
.phone-nav-dot.inactive { background:#DDD0C4; }

/* ─── Stats ────────────────────────────────────────────────── */
.stats-sec {
  background:#FDF8F3;
  border-top:1px solid #E8D8CC; border-bottom:1px solid #E8D8CC;
  padding:clamp(48px,6vw,72px) clamp(20px,6vw,64px);
}
.stats-grid { max-width:900px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:2px; }
@media(max-width:680px) { .stats-grid { grid-template-columns:1fr 1fr; gap:clamp(24px,5vw,40px); } }
.stat-item { text-align:center; padding:16px 8px; }
.stat-n {
  font-family:'Playfair Display',Georgia,serif;
  font-size:clamp(32px,5vw,52px); font-weight:600;
  color:#C9826B; line-height:1; letter-spacing:-.02em;
}
.stat-l { font-size:12px; font-weight:400; color:#8A6A5A; margin-top:7px; letter-spacing:.01em; }

/* ─── Section scaffolding ──────────────────────────────────── */
.sec { padding:clamp(72px,9vw,108px) clamp(20px,6vw,72px); }
.sec-inner { max-width:1080px; margin:0 auto; }
.sec-bg-alt { background:#FDF8F3; }
.sec-header { margin-bottom:clamp(36px,5vw,52px); }
.sec-label {
  font-size:10.5px; font-weight:600; letter-spacing:.14em; text-transform:uppercase;
  color:#C9826B; margin-bottom:14px; display:flex; align-items:center; gap:10px;
}
.sec-label::before { content:''; width:20px; height:1.5px; background:#C9826B; border-radius:2px; }
.sec-h2 {
  font-family:'Playfair Display',Georgia,serif;
  font-size:clamp(28px,4.2vw,46px); font-weight:600;
  line-height:1.12; letter-spacing:-.02em; color:#4A2E22;
}
.sec-h2 em { font-style:italic; font-weight:400; color:#C9826B; }
.sec-p { font-size:15px; font-weight:300; color:#8A6A5A; line-height:1.78; max-width:500px; margin-top:14px; }

/* ─── Features (why) ───────────────────────────────────────── */
.feat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(12px,2vw,24px); margin-top:clamp(36px,5vw,52px); }
@media(max-width:780px) { .feat-grid { grid-template-columns:1fr; } }
.feat-card {
  background:#F5EDE3; border-radius:20px; padding:clamp(24px,3vw,34px);
  border:1px solid rgba(232,216,204,.8);
  transition:transform .22s, box-shadow .22s;
}
.feat-card:hover { transform:translateY(-3px); box-shadow:0 10px 30px rgba(74,46,34,.1); }
.feat-icon-wrap {
  width:44px; height:44px; border-radius:14px;
  display:flex; align-items:center; justify-content:center;
  margin-bottom:18px;
}
.feat-title { font-family:'Playfair Display',serif; font-size:18px; font-weight:600; color:#4A2E22; margin-bottom:10px; line-height:1.2; }
.feat-desc { font-size:14px; font-weight:300; color:#8A6A5A; line-height:1.72; }

/* ─── Category grid ────────────────────────────────────────── */
.cat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(10px,1.5vw,16px); margin-top:clamp(36px,5vw,52px); }
@media(max-width:820px) { .cat-grid { grid-template-columns:1fr 1fr; } }
@media(max-width:500px) { .cat-grid { grid-template-columns:1fr; } }
.cat-card {
  background:#FDF8F3; border:1px solid #E8D8CC; border-radius:18px;
  padding:20px 18px; display:flex; align-items:flex-start; gap:14px;
  transition:transform .2s, box-shadow .2s, border-color .2s;
}
.cat-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(74,46,34,.09); border-color:#D4BEB2; }
.cat-icon { width:38px; height:38px; border-radius:10px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
.cat-name { font-family:'Playfair Display',serif; font-size:15px; font-weight:600; color:#4A2E22; margin-bottom:5px; }
.cat-desc { font-size:12.5px; font-weight:300; color:#8A6A5A; line-height:1.55; }

/* ─── Quote ────────────────────────────────────────────────── */
.quote-sec {
  background:#4A2E22; padding:clamp(64px,9vw,96px) clamp(20px,10vw,120px);
  text-align:center; position:relative; overflow:hidden;
}
.quote-sec::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(ellipse 80% 70% at 50% 50%, rgba(201,130,107,.12), transparent 60%);
}
.quote-ornament {
  font-family:'Cormorant Garamond',serif; font-style:italic;
  font-size:clamp(80px,14vw,140px); line-height:.65; color:rgba(212,169,106,.2);
  margin-bottom:-10px; display:block; position:relative; z-index:1;
}
.quote-text {
  font-family:'Cormorant Garamond',Georgia,serif; font-style:italic;
  font-size:clamp(20px,3.2vw,32px); font-weight:400; color:#FDF8F3;
  line-height:1.58; max-width:760px; margin:0 auto;
  position:relative; z-index:1;
}
.quote-author {
  margin-top:28px; font-size:12px; font-weight:500; letter-spacing:.1em;
  text-transform:uppercase; color:rgba(253,248,243,.4); position:relative; z-index:1;
}
.quote-rule {
  width:32px; height:1.5px; background:rgba(212,169,106,.5);
  margin:18px auto 0; position:relative; z-index:1;
}

/* ─── Testimonials ─────────────────────────────────────────── */
.testi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(12px,2vw,20px); margin-top:clamp(36px,5vw,52px); }
@media(max-width:840px) { .testi-grid { grid-template-columns:1fr 1fr; } }
@media(max-width:540px) { .testi-grid { grid-template-columns:1fr; } }
.testi-card {
  background:#FDF8F3; border:1px solid #E8D8CC; border-radius:20px;
  padding:clamp(20px,3vw,28px); display:flex; flex-direction:column;
  transition:transform .2s, box-shadow .2s;
}
.testi-card:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(74,46,34,.1); }
.testi-stars { display:flex; gap:3px; margin-bottom:16px; }
.testi-q {
  font-family:'Cormorant Garamond',Georgia,serif; font-style:italic;
  font-size:17px; font-weight:400; color:#4A2E22; line-height:1.6;
  flex:1; margin-bottom:20px;
}
.testi-sep { width:20px; height:1.5px; background:#E8D8CC; margin-bottom:16px; }
.testi-author { display:flex; align-items:center; gap:10px; }
.testi-av {
  width:34px; height:34px; border-radius:50%; flex-shrink:0;
  background:linear-gradient(135deg,#C9826B,#D4A96A);
  display:flex; align-items:center; justify-content:center;
  font-family:'Playfair Display',serif; font-size:13px; font-weight:600; color:#FDF8F3;
}
.testi-name { font-size:13px; font-weight:600; color:#4A2E22; }
.testi-role { font-size:11px; color:#8A6A5A; margin-top:2px; }

/* ─── Pricing ──────────────────────────────────────────────── */
.price-grid { display:grid; grid-template-columns:1fr 1fr; gap:clamp(14px,2vw,24px); max-width:760px; margin:clamp(36px,5vw,52px) auto 0; }
@media(max-width:560px) { .price-grid { grid-template-columns:1fr; } }
.price-card {
  border-radius:24px; padding:clamp(28px,4vw,38px);
  border:1.5px solid #E8D8CC; background:#FDF8F3;
  display:flex; flex-direction:column;
  transition:transform .22s, box-shadow .22s;
}
.price-card:hover { transform:translateY(-4px); box-shadow:0 14px 40px rgba(74,46,34,.12); }
.price-featured { background:#C9826B; border-color:transparent; box-shadow:0 16px 44px rgba(201,130,107,.38); }
.price-featured:hover { box-shadow:0 24px 56px rgba(201,130,107,.48); }
.price-eyebrow {
  font-size:10px; font-weight:600; letter-spacing:.12em; text-transform:uppercase;
  color:#D4A96A; margin-bottom:18px; display:flex; align-items:center; gap:8px;
}
.price-featured .price-eyebrow { color:rgba(253,248,243,.65); }
.price-eyebrow::after { content:''; flex:1; height:1px; background:rgba(212,169,106,.18); }
.price-featured .price-eyebrow::after { background:rgba(253,248,243,.18); }
.price-name { font-family:'Playfair Display',serif; font-size:22px; font-weight:600; color:#4A2E22; margin-bottom:10px; }
.price-featured .price-name { color:#FDF8F3; }
.price-amount { font-family:'Playfair Display',serif; font-size:48px; font-weight:600; line-height:1; color:#4A2E22; }
.price-featured .price-amount { color:#FDF8F3; }
.price-amount sup { font-size:16px; vertical-align:top; margin-top:10px; }
.price-per { font-size:14px; font-weight:300; color:#8A6A5A; margin-top:4px; margin-bottom:20px; }
.price-featured .price-per { color:rgba(253,248,243,.55); }
.price-line { height:1px; background:#E8D8CC; margin-bottom:20px; }
.price-featured .price-line { background:rgba(253,248,243,.18); }
.price-list { list-style:none; flex:1; display:flex; flex-direction:column; gap:11px; margin-bottom:28px; }
.price-list li { display:flex; align-items:flex-start; gap:10px; font-size:13.5px; font-weight:300; color:#8A6A5A; line-height:1.45; }
.price-featured .price-list li { color:rgba(253,248,243,.8); }
.chk { width:17px; height:17px; border-radius:50%; flex-shrink:0; margin-top:1px; background:rgba(201,130,107,.1); display:flex; align-items:center; justify-content:center; }
.price-featured .chk { background:rgba(253,248,243,.2); }

/* ─── FAQ ──────────────────────────────────────────────────── */
.faq-list { max-width:660px; margin:clamp(36px,5vw,52px) auto 0; }
.fq { border-bottom:1px solid #E8D8CC; }
.fq:first-child { border-top:1px solid #E8D8CC; }
.fq-btn { width:100%; display:flex; align-items:center; justify-content:space-between; padding:19px 0; gap:14px; text-align:left; }
.fq-q { font-family:'Playfair Display',serif; font-size:16.5px; font-weight:500; color:#4A2E22; flex:1; line-height:1.35; }
.fq-icon {
  width:26px; height:26px; border-radius:50%; flex-shrink:0;
  border:1.5px solid #D4BEB2; color:#C9826B;
  display:flex; align-items:center; justify-content:center; font-size:16px;
  transition:transform .26s, background .2s, border-color .2s;
}
.fq.open .fq-icon { transform:rotate(45deg); background:#C9826B; border-color:#C9826B; color:#FDF8F3; }
.fq-a { max-height:0; overflow:hidden; transition:max-height .34s ease, padding .22s; font-size:14px; font-weight:300; color:#8A6A5A; line-height:1.78; }
.fq.open .fq-a { max-height:200px; padding-bottom:18px; }

/* ─── CTA ──────────────────────────────────────────────────── */
.cta-sec {
  background:#3A2218; padding:clamp(72px,10vw,108px) clamp(20px,6vw,72px);
  text-align:center; position:relative; overflow:hidden;
}
.cta-sec::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(ellipse 60% 70% at 50% 50%, rgba(201,130,107,.14), transparent 55%);
}
.cta-inner { max-width:600px; margin:0 auto; position:relative; z-index:1; }
.cta-h {
  font-family:'Playfair Display',Georgia,serif;
  font-size:clamp(32px,6vw,60px); font-weight:600; line-height:1.12;
  letter-spacing:-.02em; color:#FDF8F3; margin-bottom:16px;
}
.cta-h em { font-style:italic; font-weight:400; color:#D4A96A; }
.cta-sub {
  font-family:'Cormorant Garamond',Georgia,serif; font-style:italic;
  font-size:clamp(16px,2.2vw,21px); color:rgba(253,248,243,.5);
  line-height:1.68; max-width:460px; margin:0 auto 38px;
}
.cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }

/* ─── Footer ───────────────────────────────────────────────── */
.footer {
  background:#2E1A10; padding:24px clamp(20px,6vw,72px);
  display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;
}
.footer-copy { font-size:11.5px; color:rgba(253,248,243,.2); }
.footer-links { display:flex; gap:18px; }
.footer-links a { font-size:11.5px; color:rgba(253,248,243,.2); transition:color .18s; }
.footer-links a:hover { color:rgba(253,248,243,.5); }
@media(max-width:480px) { .footer { flex-direction:column; align-items:flex-start; } }

/* ─── Animations ───────────────────────────────────────────── */
@keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
.up { opacity:0; transform:translateY(22px); transition:opacity .55s ease, transform .55s ease; }
.up:nth-child(2) { transition-delay:.07s } .up:nth-child(3) { transition-delay:.14s }
.up:nth-child(4) { transition-delay:.21s } .up:nth-child(5) { transition-delay:.28s }
.up:nth-child(6) { transition-delay:.35s } .up:nth-child(7) { transition-delay:.42s }
.up:nth-child(8) { transition-delay:.49s } .up:nth-child(9) { transition-delay:.56s }
.in { opacity:1 !important; transform:none !important; }

@media(max-width:480px) {
  .sec { padding:60px 20px; }
  .quote-sec { padding:60px 24px; }
  .cta-sec { padding:68px 24px; }
}
      `}</style>

      <div className="lp">

        {/* ── NAV ──────────────────────────────────────────────── */}
        <header className="lp-nav">
          <Logo />
          <nav className="lp-nav-links">
            <a href="#conteudo">Conteúdo</a>
            <a href="#depoimentos">Comunidade</a>
            <a href="#planos">Planos</a>
          </nav>
          <Link href="/auth/login" className="btn btn-primary btn-sm">Entrar no app</Link>
        </header>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero-text">
            <div className="hero-tag">
              <div className="hero-tag-dot">
                <Leaf size={11} color="#FDF8F3" strokeWidth={2} />
              </div>
              App oficial · Josi Vida &amp; Conteúdo
            </div>

            <h1 className="hero-h1">
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

            <div className="hero-proof">
              <div className="av-stack">
                {['A','C','M','L','R'].map((l, i) => (
                  <div key={i} className="av">{l}</div>
                ))}
              </div>
              <span>+1.200 pessoas já fazem parte</span>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="hero-visual">
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
                  <div style={{ fontSize: 10, color: '#8A6A5A', marginBottom: 8, fontWeight: 500, letterSpacing: '.04em', textTransform: 'uppercase' }}>Hoje na chácara</div>
                  <div style={{ background: 'linear-gradient(135deg,rgba(201,130,107,.12),rgba(212,169,106,.1))', borderRadius: 12, padding: '10px 12px', border: '1px solid rgba(201,130,107,.18)' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#4A2E22', marginBottom: 3 }}>Receita: Pão de queijo da fazenda</div>
                    <div style={{ fontSize: 10, color: '#8A6A5A', fontWeight: 300 }}>Simples, rápido e que todo mundo ama</div>
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
        <div className="stats-sec">
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

        {/* ── FEATURES / POR QUÊ ───────────────────────────────── */}
        <section className="sec sec-bg-alt" id="sobre">
          <div className="sec-inner">
            <div className="sec-header">
              <div className="sec-label up">Por que o app</div>
              <h2 className="sec-h2 up">
                Um espaço criado com<br /><em>carinho pra você</em>
              </h2>
              <p className="sec-p up">
                Não é mais um aplicativo qualquer. É onde a Josi coloca o que ela ama — organizado, fácil de achar e com a cara dela.
              </p>
            </div>
            <div className="feat-grid">
              {[
                {
                  Icon: Layers,
                  title: 'Conteúdo organizado',
                  desc: 'Tudo no lugar certo — sem ficar garimpando em mil plataformas. Receita, skincare, chácara: cada coisa no seu cantinho.',
                  bg: 'rgba(201,130,107,.1)',
                  color: '#C9826B',
                },
                {
                  Icon: MessageCircle,
                  title: 'Comunidade de verdade',
                  desc: 'Um espaço seguro, acolhedor e sem julgamentos. A ideia é que pareça uma roda de amigas — porque é exatamente isso.',
                  bg: 'rgba(138,158,123,.1)',
                  color: '#8A9E7B',
                },
                {
                  Icon: Repeat2,
                  title: 'Sempre tem novidade',
                  desc: 'A Josi adiciona conteúdo toda semana — receita nova, tutorial de skincare, comprinhas. Nunca vai faltar o que explorar.',
                  bg: 'rgba(212,169,106,.1)',
                  color: '#D4A96A',
                },
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
        <section className="sec" id="conteudo">
          <div className="sec-inner">
            <div className="sec-header">
              <div className="sec-label up">Categorias</div>
              <h2 className="sec-h2 up">
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
        <div className="quote-sec">
          <span className="quote-ornament up">"</span>
          <p className="quote-text up">
            Criei esse app porque queria um espaço nosso. Só seu e meu. Como se você estivesse aqui na chácara, tomando um café comigo e a gente conversando sobre tudo.
          </p>
          <div className="quote-rule up" />
          <p className="quote-author up">Josiane Ferraz</p>
        </div>

        {/* ── TESTIMONIALS ─────────────────────────────────────── */}
        <section className="sec sec-bg-alt" id="depoimentos">
          <div className="sec-inner">
            <div className="sec-header">
              <div className="sec-label up">Comunidade</div>
              <h2 className="sec-h2 up">O que as meninas <em>estão falando</em></h2>
            </div>
            <div className="testi-grid">
              {[
                {
                  i: 'A', name: 'Ana Paula S.', role: 'Membro desde o lançamento',
                  text: '"Finalmente tudo num só lugar! Já fiz três receitas da Josi e as três deram certo. E a comunidade é muito acolhedora — me sinto em casa."',
                },
                {
                  i: 'C', name: 'Carol M.', role: 'Veio pelo skincare',
                  text: '"A rotina de pele da Josi mudou minha vida. Simples, sem complicação. Ter o passo a passo no app facilita demais — abro toda manhã."',
                },
                {
                  i: 'M', name: 'Mariana T.', role: 'Fã do canal no YouTube',
                  text: '"Parece que ela está do meu lado falando. O tom é tão gostoso, parece uma amiga de verdade. Adoro os vídeos da chácara no app."',
                },
              ].map((t, i) => (
                <div key={t.name} className="testi-card up" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="testi-stars">
                    {[...Array(5)].map((_, k) => <Star key={k} size={12} color="#D4A96A" fill="#D4A96A" />)}
                  </div>
                  <p className="testi-q">{t.text}</p>
                  <div className="testi-sep" />
                  <div className="testi-author">
                    <div className="testi-av">{t.i}</div>
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

        {/* ── PRICING ──────────────────────────────────────────── */}
        <section className="sec" id="planos">
          <div className="sec-inner" style={{ textAlign: 'center' }}>
            <div className="sec-label up" style={{ justifyContent: 'center' }}>Planos</div>
            <h2 className="sec-h2 up">Comece de graça,<br /><em>vá mais longe com Premium</em></h2>
            <p className="sec-p up" style={{ margin: '14px auto 0', textAlign: 'center' }}>
              Crie sua conta agora — sem precisar de cartão.
            </p>
            <div className="price-grid">
              {/* Free */}
              <div className="price-card up">
                <div className="price-name">Gratuito</div>
                <div className="price-amount">R$<sup></sup>0</div>
                <div className="price-per">para sempre</div>
                <div className="price-line" />
                <ul className="price-list">
                  {['Acesso à comunidade', 'Conteúdo introdutório', 'Perfil personalizado', 'Publicações e interações'].map(item => (
                    <li key={item}>
                      <span className="chk"><Check size={9} color="#C9826B" strokeWidth={3} /></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/login" className="btn btn-outline" style={{ width: '100%' }}>
                  Criar conta grátis
                </Link>
              </div>
              {/* Premium */}
              <div className="price-card price-featured up">
                <div className="price-eyebrow">Mais escolhido</div>
                <div className="price-name">Premium</div>
                <div className="price-amount"><sup>R$</sup>47</div>
                <div className="price-per">por mês · cancele quando quiser</div>
                <div className="price-line" />
                <ul className="price-list">
                  {[
                    'Tudo do plano Gratuito',
                    'Cursos completos da Josi',
                    'Receitas e tutoriais exclusivos',
                    'Rotina completa de skincare',
                    'Conteúdo da chácara e dos pets',
                    'Novidades toda semana',
                  ].map(item => (
                    <li key={item}>
                      <span className="chk"><Check size={9} color="#FDF8F3" strokeWidth={3} /></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/login" className="btn btn-dark" style={{ width: '100%', background: '#FDF8F3', color: '#4A2E22' }}>
                  Quero o Premium
                  <ArrowRight size={15} strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="sec sec-bg-alt" id="faq" style={{ paddingTop: 0 }}>
          <div className="sec-inner" style={{ textAlign: 'center' }}>
            <div className="sec-label up" style={{ justifyContent: 'center' }}>Dúvidas</div>
            <h2 className="sec-h2 up">Perguntas <em>frequentes</em></h2>
            <div className="faq-list" style={{ textAlign: 'left' }}>
              {[
                {
                  q: 'Precisa instalar algum aplicativo?',
                  a: 'Não! O app da Josi funciona direto no navegador do celular, tablet ou computador — é só entrar no site e usar. Simples assim.',
                },
                {
                  q: 'Posso cancelar quando quiser?',
                  a: 'Sim, sem multa e sem burocracia. Se cancelar, você continua com acesso Premium até o final do período já pago.',
                },
                {
                  q: 'Com que frequência tem conteúdo novo?',
                  a: 'A Josi adiciona novidades toda semana — receitas, tutoriais de skincare, vídeos da chácara e muito mais.',
                },
                {
                  q: 'A comunidade é moderada?',
                  a: 'Sim, com muito carinho. A ideia é que seja um espaço seguro, acolhedor e sem julgamentos — igualzinho à vibe da Josi.',
                },
                {
                  q: 'O plano Gratuito vale a pena?',
                  a: 'Com certeza! Você já tem acesso à comunidade e ao conteúdo de entrada. O Premium desbloqueia os cursos, tutoriais completos e os exclusivos.',
                },
              ].map(({ q, a }) => (
                <div key={q} className="fq up">
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

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="cta-sec">
          <div className="cta-inner">
            <h2 className="cta-h up">
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
        <footer className="footer">
          <Logo light />
          <div className="footer-copy">© 2025 Josi App · Josiane Szewczuk Ferraz · Todos os direitos reservados</div>
          <div className="footer-links">
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
          </div>
        </footer>

      </div>
    </>
  )
}
