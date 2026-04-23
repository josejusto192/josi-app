'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {
  ShoppingBag, Heart, Users, PawPrint, BookOpen, Sparkles,
  Leaf, ChefHat, Baby, Check, ArrowRight, Star, Sprout,
  Play, Smile,
} from 'lucide-react'

export default function LandingPage() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: 0.08 }
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

  const Logo = () => (
    <svg viewBox="0 0 200 44" width="130" height="40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lgg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9826B"/>
          <stop offset="100%" stopColor="#D4A96A"/>
        </linearGradient>
      </defs>
      <text x="0" y="38" fontFamily="'Cormorant Garamond',Georgia,serif" fontSize="46" fontWeight="500" fontStyle="italic" fill="url(#lgg)">J</text>
      <text x="28" y="36" fontFamily="'Cormorant Garamond',Georgia,serif" fontSize="38" fontWeight="400" fontStyle="italic" fill="#4A2E22">osi</text>
      <circle cx="98" cy="32" r="2.5" fill="#D4A96A"/>
      <text x="106" y="36" fontFamily="'DM Sans',system-ui,sans-serif" fontSize="10" fontWeight="400" letterSpacing="2" fill="#8A6A5A">VIDA &amp; CONTEÚDO</text>
    </svg>
  )

  const cats = [
    { Icon: ShoppingBag, name:'Comprinhas',  color:'#F0D5C8', border:'#E0BBA8', iconColor:'#C9826B', desc:'Hauls Shopee, Shein e tudo que eu amei' },
    { Icon: Heart,       name:'Casal',        color:'#FDE8D8', border:'#F0CDB8', iconColor:'#C9826B', desc:'Momentos com o Jeck e nossa vida a dois' },
    { Icon: Users,       name:'Família',      color:'#E8F0E0', border:'#C8DDB8', iconColor:'#8A9E7B', desc:'Vida com a Isabeli e tudo sobre maternidade' },
    { Icon: PawPrint,    name:'Pets',         color:'#F5F0E0', border:'#E0D8B8', iconColor:'#B08A50', desc:'Nossos animais e a vida no campo' },
    { Icon: BookOpen,    name:'Cursos',       color:'#F0E8D8', border:'#DCCAB0', iconColor:'#C9826B', desc:'Conteúdo exclusivo para você crescer' },
    { Icon: Sparkles,    name:'Skincare',     color:'#F8E8F0', border:'#E8C8DC', iconColor:'#B07090', desc:'Rotina de pele — simples e que funciona' },
    { Icon: Leaf,        name:'Chácara',      color:'#E0EDD8', border:'#BCDAB0', iconColor:'#8A9E7B', desc:'Vida no campo, natureza e liberdade' },
    { Icon: ChefHat,     name:'Receitas',     color:'#FDE8D0', border:'#F0CCAC', iconColor:'#C9826B', desc:'Tudo que saiu da minha cozinha hoje' },
    { Icon: Baby,        name:'Maternidade',  color:'#F8EAE8', border:'#E8C8C4', iconColor:'#C96B6B', desc:'O que ninguém te conta sobre ser mãe' },
  ]

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Cormorant+Garamond:ital,wght@1,300;1,400;1,500;1,600&display=swap" rel="stylesheet"/>
      <style>{`
.lp, .lp *, .lp *::before, .lp *::after { box-sizing:border-box; margin:0; padding:0; }
.lp { font-family:'DM Sans',system-ui,sans-serif; background:#F5EDE3; color:#4A2E22; overflow-x:hidden; }
.lp a { text-decoration:none; color:inherit; }
.lp button { font-family:'DM Sans',system-ui,sans-serif; cursor:pointer; border:none; background:none; }

/* nav */
.lp-nav {
  position:fixed; top:0; left:0; right:0; z-index:200;
  height:62px; padding:0 clamp(16px,5vw,48px);
  display:flex; align-items:center; justify-content:space-between;
  background:rgba(253,248,243,0.92); backdrop-filter:blur(12px);
  border-bottom:1px solid #E8D8CC;
}
.lp-nav-links { display:flex; gap:24px; }
.lp-nav-links a { font-size:13px; font-weight:500; color:#8A6A5A; transition:color .2s; }
.lp-nav-links a:hover { color:#C9826B; }
@media(max-width:680px){ .lp-nav-links { display:none; } }

/* buttons */
.btn {
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  font-family:'DM Sans',system-ui,sans-serif; font-weight:600;
  border-radius:100px; border:none; cursor:pointer; transition:all .22s; white-space:nowrap;
}
.btn-primary {
  background:linear-gradient(135deg,#C9826B,#D4A96A); color:#FDF8F3;
  box-shadow:0 4px 16px rgba(201,130,107,.35); font-size:14px; padding:12px 26px;
}
.btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(201,130,107,.45); }
.btn-outline { background:transparent; border:1.5px solid #C9826B; color:#C9826B; font-size:14px; padding:11px 24px; }
.btn-outline:hover { background:rgba(201,130,107,.07); }
.btn-lg { font-size:15px; padding:14px 32px; }
.btn-sm { font-size:13px; padding:9px 20px; }
.btn-white { background:#FDF8F3; color:#4A2E22; box-shadow:0 4px 14px rgba(74,46,34,.15); font-size:14px; padding:12px 26px; }
.btn-white:hover { background:#fff; transform:translateY(-1px); }

/* hero */
.hero {
  min-height:100svh; background:#F5EDE3;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  text-align:center; padding:80px clamp(20px,6vw,80px) 60px;
  position:relative; overflow:hidden;
}
.hero-deco { position:absolute; pointer-events:none; border-radius:50%; opacity:.45; }
.hero-deco-1 { width:480px;height:480px;background:radial-gradient(circle,rgba(201,130,107,.18),transparent 65%);top:-15%;left:-10%; }
.hero-deco-2 { width:360px;height:360px;background:radial-gradient(circle,rgba(138,158,123,.14),transparent 65%);bottom:-8%;right:-8%; }
.hero-deco-3 { width:200px;height:200px;background:radial-gradient(circle,rgba(212,169,106,.16),transparent 65%);top:35%;right:8%; }
.hero-badge {
  display:inline-flex; align-items:center; gap:8px;
  background:#FDF8F3; border:1px solid #E8D8CC; border-radius:100px;
  padding:6px 16px; margin-bottom:28px;
  font-size:12px; font-weight:500; color:#8A6A5A;
  box-shadow:0 2px 8px rgba(74,46,34,.08);
  animation:fadeUp .7s ease both;
}
.hero-badge-dot { width:6px;height:6px;border-radius:50%;background:linear-gradient(135deg,#C9826B,#D4A96A); }
.hero-h1 {
  font-family:'Playfair Display',Georgia,serif;
  font-size:clamp(38px,7.5vw,82px); font-weight:600;
  line-height:1.08; letter-spacing:-.02em; color:#4A2E22;
  margin-bottom:20px; animation:fadeUp .75s .1s ease both;
}
.hero-h1 em { font-style:italic; font-weight:400; color:#C9826B; }
.hero-callout {
  font-family:'Cormorant Garamond',Georgia,serif;
  font-style:italic; font-size:clamp(18px,2.8vw,26px); font-weight:400;
  color:#8A6A5A; max-width:560px; line-height:1.6; margin-bottom:36px;
  animation:fadeUp .75s .2s ease both;
}
.hero-btns { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; animation:fadeUp .75s .3s ease both; }
.hero-avatars {
  display:flex; align-items:center; gap:12px; margin-top:44px; flex-wrap:wrap; justify-content:center;
  animation:fadeUp .75s .42s ease both; font-size:13px; font-weight:400; color:#8A6A5A;
}
.av-stack { display:flex; }
.av { width:32px;height:32px;border-radius:50%;border:2px solid #F5EDE3;margin-left:-8px;background:linear-gradient(135deg,#C9826B,#D4A96A);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:13px;font-weight:600;color:#FDF8F3; }
.av:first-child { margin-left:0; }

/* sections */
.sec { padding:clamp(64px,9vw,100px) clamp(20px,6vw,64px); }
.sec-inner { max-width:1120px; margin:0 auto; }
.sec-label { font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#C9826B;margin-bottom:12px;display:flex;align-items:center;gap:8px; }
.sec-label::before { content:'';width:18px;height:1.5px;background:#C9826B;border-radius:2px; }
.sec-h2 { font-family:'Playfair Display',Georgia,serif;font-size:clamp(28px,4.5vw,48px);font-weight:600;line-height:1.15;letter-spacing:-.015em;color:#4A2E22; }
.sec-h2 em { font-style:italic; font-weight:400; color:#C9826B; }
.sec-sub { font-size:16px;font-weight:300;color:#8A6A5A;line-height:1.72;max-width:520px; }
.sec-bg { background:#FDF8F3; }

/* about strip */
.about-strip { background:linear-gradient(135deg,#C9826B 0%,#D4A96A 100%);padding:clamp(40px,6vw,64px) clamp(20px,6vw,64px);display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:2px; }
@media(max-width:720px){ .about-strip { grid-template-columns:1fr 1fr; } }
.about-stat { background:rgba(253,248,243,.12);padding:28px 24px;text-align:center;border-radius:4px; }
.about-n { font-family:'Playfair Display',serif;font-size:clamp(28px,4vw,42px);font-weight:600;color:#FDF8F3;line-height:1; }
.about-l { font-size:12px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:rgba(253,248,243,.7);margin-top:6px; }

/* category grid */
.cat-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:48px; }
@media(max-width:800px){ .cat-grid { grid-template-columns:1fr 1fr; } }
@media(max-width:480px){ .cat-grid { grid-template-columns:1fr; } }
.cat-card { border-radius:20px;padding:22px 20px;display:flex;align-items:flex-start;gap:14px;transition:transform .22s,box-shadow .22s;border:1.5px solid transparent; }
.cat-card:hover { transform:translateY(-3px);box-shadow:0 8px 28px rgba(74,46,34,.10); }
.cat-icon-wrap { width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:rgba(255,255,255,.55); }
.cat-name { font-family:'Playfair Display',serif;font-size:16px;font-weight:600;color:#4A2E22;margin-bottom:4px; }
.cat-desc { font-size:13px;font-weight:300;color:#8A6A5A;line-height:1.5; }

/* testimonials */
.testi-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px; }
@media(max-width:820px){ .testi-grid { grid-template-columns:1fr 1fr; } }
@media(max-width:520px){ .testi-grid { grid-template-columns:1fr; } }
.testi-card { background:#FDF8F3;border:1px solid #E8D8CC;border-radius:20px;padding:26px 22px;transition:transform .22s,box-shadow .22s; }
.testi-card:hover { transform:translateY(-3px);box-shadow:0 8px 24px rgba(74,46,34,.10); }
.testi-stars { display:flex;gap:3px;margin-bottom:14px; }
.testi-text { font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:17px;font-weight:400;color:#4A2E22;line-height:1.6;margin-bottom:18px; }
.testi-rule { width:24px;height:1.5px;background:#E8D8CC;margin-bottom:16px; }
.testi-author { display:flex;align-items:center;gap:10px; }
.testi-av { width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#C9826B,#D4A96A);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:14px;font-weight:600;color:#FDF8F3;flex-shrink:0; }
.testi-name { font-size:13px;font-weight:600;color:#4A2E22; }
.testi-role { font-size:11px;color:#8A6A5A;margin-top:1px; }

/* pricing */
.price-grid { display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:780px;margin:48px auto 0; }
@media(max-width:560px){ .price-grid { grid-template-columns:1fr; } }
.price-card { border-radius:24px;padding:clamp(28px,4vw,40px);border:1.5px solid #E8D8CC;background:#FDF8F3;display:flex;flex-direction:column;transition:transform .22s,box-shadow .22s; }
.price-card:hover { transform:translateY(-4px);box-shadow:0 12px 36px rgba(74,46,34,.12); }
.price-featured { background:linear-gradient(145deg,#C9826B,#D4A96A);border-color:transparent;box-shadow:0 16px 40px rgba(201,130,107,.35); }
.price-featured:hover { box-shadow:0 22px 48px rgba(201,130,107,.45); }
.price-badge { font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#D4A96A;margin-bottom:20px;display:flex;align-items:center;gap:6px; }
.price-featured .price-badge { color:rgba(253,248,243,.8); }
.price-badge::after { content:'';flex:1;height:1px;background:rgba(212,169,106,.2); }
.price-featured .price-badge::after { background:rgba(253,248,243,.2); }
.price-name { font-family:'Playfair Display',serif;font-size:24px;font-weight:600;color:#4A2E22;margin-bottom:8px; }
.price-featured .price-name { color:#FDF8F3; }
.price-val { font-family:'Playfair Display',serif;font-size:50px;font-weight:600;line-height:1;color:#4A2E22;margin-bottom:4px; }
.price-featured .price-val { color:#FDF8F3; }
.price-val sup { font-size:18px;vertical-align:top;margin-top:12px; }
.price-val .mo { font-size:15px;font-weight:400;opacity:.5; }
.price-desc { font-size:13px;font-weight:300;color:#8A6A5A;margin-bottom:24px; }
.price-featured .price-desc { color:rgba(253,248,243,.65); }
.price-divider { height:1px;background:#E8D8CC;margin-bottom:22px; }
.price-featured .price-divider { background:rgba(253,248,243,.18); }
.price-list { list-style:none;flex:1;margin-bottom:28px;display:flex;flex-direction:column;gap:11px; }
.price-list li { display:flex;align-items:flex-start;gap:10px;font-size:14px;font-weight:300;color:#8A6A5A;line-height:1.4; }
.price-featured .price-list li { color:rgba(253,248,243,.85); }
.chk { width:17px;height:17px;border-radius:50%;flex-shrink:0;margin-top:1px;background:rgba(201,130,107,.12);display:flex;align-items:center;justify-content:center; }
.price-featured .chk { background:rgba(253,248,243,.2); }

/* faq */
.faq-list { max-width:680px;margin:44px auto 0; }
.fq { border-bottom:1px solid #E8D8CC; }
.fq:first-child { border-top:1px solid #E8D8CC; }
.fq-btn { width:100%;display:flex;align-items:center;justify-content:space-between;padding:18px 0;gap:14px;background:none;border:none;cursor:pointer;text-align:left; }
.fq-q { font-family:'Playfair Display',serif;font-size:17px;font-weight:500;color:#4A2E22;flex:1;line-height:1.3; }
.fq-icon { width:28px;height:28px;border-radius:50%;flex-shrink:0;border:1.5px solid #E8D8CC;color:#C9826B;display:flex;align-items:center;justify-content:center;font-size:17px;transition:transform .28s,background .2s,border-color .2s; }
.fq.open .fq-icon { transform:rotate(45deg);background:#C9826B;border-color:#C9826B;color:#fff; }
.fq-a { max-height:0;overflow:hidden;transition:max-height .36s ease,padding .24s;padding:0;font-size:14px;font-weight:300;color:#8A6A5A;line-height:1.75; }
.fq.open .fq-a { max-height:220px;padding-bottom:18px; }

/* cta */
.cta-sec { background:linear-gradient(135deg,#4A2E22 0%,#6A3E2A 100%);padding:clamp(64px,10vw,100px) clamp(20px,6vw,64px);text-align:center;position:relative;overflow:hidden; }
.cta-sec::before { content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 70% 60% at 50% 50%,rgba(201,130,107,.18),transparent 60%); }
.cta-h { font-family:'Playfair Display',Georgia,serif;font-size:clamp(32px,6vw,64px);font-weight:600;line-height:1.15;letter-spacing:-.015em;color:#FDF8F3;margin-bottom:18px; }
.cta-h em { font-style:italic;font-weight:400;color:#D4A96A; }
.cta-callout { font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:clamp(17px,2.5vw,22px);color:rgba(253,248,243,.6);max-width:480px;margin:0 auto 36px;line-height:1.65; }

/* footer */
.footer { background:#3A2218;padding:28px clamp(20px,6vw,64px);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px; }
.footer-copy { font-size:12px;color:rgba(253,248,243,.25); }
.footer-links { display:flex;gap:16px; }
.footer-links a { font-size:12px;color:rgba(253,248,243,.25);transition:color .2s; }
.footer-links a:hover { color:rgba(253,248,243,.55); }

/* animations */
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
.up { opacity:0;transform:translateY(26px);transition:opacity .6s ease,transform .6s ease; }
.up:nth-child(2){transition-delay:.08s} .up:nth-child(3){transition-delay:.16s}
.up:nth-child(4){transition-delay:.24s} .up:nth-child(5){transition-delay:.32s}
.up:nth-child(6){transition-delay:.40s} .up:nth-child(7){transition-delay:.48s}
.up:nth-child(8){transition-delay:.56s} .up:nth-child(9){transition-delay:.64s}
.in { opacity:1 !important;transform:none !important; }
@media(max-width:480px){ .sec{padding:56px 20px} .cta-sec{padding:60px 20px} .footer{flex-direction:column;align-items:flex-start} }
      `}</style>

      <div className="lp">

        {/* NAV */}
        <header className="lp-nav">
          <Logo />
          <nav className="lp-nav-links">
            <a href="#conteudo">Conteúdo</a>
            <a href="#depoimentos">Comunidade</a>
            <a href="#planos">Planos</a>
          </nav>
          <Link href="/auth/login" className="btn btn-primary btn-sm">Acessar o app</Link>
        </header>

        {/* HERO */}
        <section className="hero">
          <div className="hero-deco hero-deco-1" />
          <div className="hero-deco hero-deco-2" />
          <div className="hero-deco hero-deco-3" />

          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Aplicativo oficial da Josi
          </div>

          <h1 className="hero-h1">
            Tudo que eu amo<br/>
            <em>em um só lugar</em>
          </h1>

          <p className="hero-callout">
            Receitas, skincare, vida no campo, comprinhas, casal, maternidade — meu conteúdo do jeito que eu gosto de fazer, direto pra você.
          </p>

          <div className="hero-btns">
            <Link href="/auth/login" className="btn btn-primary btn-lg">
              Quero acessar agora
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
            <a href="#conteudo" className="btn btn-outline btn-lg">
              <Play size={14} strokeWidth={2.5} />
              Ver o conteúdo
            </a>
          </div>

          <div className="hero-avatars">
            <div className="av-stack">
              <div className="av">A</div><div className="av">C</div>
              <div className="av">M</div><div className="av">L</div><div className="av">R</div>
            </div>
            <span>+1.200 pessoas já fazem parte da comunidade</span>
          </div>
        </section>

        {/* STATS */}
        <div className="about-strip">
          {[
            { n:'280k', l:'seguidoras no TikTok' },
            { n:'157k', l:'inscritas no YouTube' },
            { n:'61,6k', l:'seguidoras no Instagram' },
            { n:'+1.200', l:'membros no app' },
          ].map(s => (
            <div key={s.l} className="about-stat up">
              <div className="about-n">{s.n}</div>
              <div className="about-l">{s.l}</div>
            </div>
          ))}
        </div>

        {/* CATEGORIES */}
        <section className="sec" id="conteudo">
          <div className="sec-inner">
            <div style={{ maxWidth:580, marginBottom:8 }}>
              <div className="sec-label up">Categorias</div>
              <h2 className="sec-h2 up">
                Tudo que eu compartilho,<br/><em>organizado pra você</em>
              </h2>
              <p className="sec-sub up" style={{ marginTop:12 }}>
                Do campo à cozinha, da skincare aos pets — cada cantinho da minha vida tem um espaço aqui dentro.
              </p>
            </div>

            <div className="cat-grid">
              {cats.map(({ Icon, name, color, border, iconColor, desc }) => (
                <div key={name} className="cat-card up" style={{ background:color, borderColor:border }}>
                  <div className="cat-icon-wrap">
                    <Icon size={20} color={iconColor} strokeWidth={1.75} />
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

        {/* QUOTE */}
        <div style={{ background:'#FDF8F3', borderTop:'1px solid #E8D8CC', borderBottom:'1px solid #E8D8CC', padding:'clamp(40px,7vw,72px) clamp(20px,10vw,120px)', textAlign:'center' }}>
          <div className="up" style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
            <Sprout size={28} color="#8A9E7B" strokeWidth={1.5} />
          </div>
          <p className="up" style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontStyle:'italic', fontWeight:400, fontSize:'clamp(20px,3.5vw,34px)', color:'#4A2E22', lineHeight:1.5, maxWidth:780, margin:'0 auto' }}>
            "Quero que você se sinta em casa aqui — como se fosse uma conversa de amigas, com tudo que aprendi vivendo no campo, cuidando da família e criando conteúdo com muito amor."
          </p>
          <p className="up" style={{ marginTop:20, fontSize:13, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:'#8A6A5A' }}>
            — Josi, Szewczuk Ferraz
          </p>
        </div>

        {/* TESTIMONIALS */}
        <section className="sec" id="depoimentos">
          <div className="sec-inner">
            <div style={{ marginBottom:8 }}>
              <div className="sec-label up">Comunidade</div>
              <h2 className="sec-h2 up">O que as meninas <em>estão achando</em></h2>
            </div>
            <div className="testi-grid">
              {[
                { i:'A', name:'Ana Paula', role:'Membro desde o lançamento', text:'"Finalmente tudo em um lugar só! Adoro a parte de receitas — já fiz três e ficaram incríveis. A comunidade é muito acolhedora."' },
                { i:'C', name:'Carol M.',   role:'Seguiu da skincare',        text:'"A rotina de skincare da Josi mudou minha pele. Simples, sem complicação. E ter o passo a passo no app facilita demais."' },
                { i:'M', name:'Mariana T.', role:'Fã do canal no YouTube',    text:'"Parece que a Josi está do lado falando comigo. O tom é tão gostoso, parece uma amiga mesmo. Adoro os vídeos da chácara."' },
              ].map((t, i) => (
                <div key={t.name} className="testi-card up" style={{ transitionDelay:`${i * 0.1}s` }}>
                  <div className="testi-stars">
                    {[...Array(5)].map((_, k) => <Star key={k} size={13} color="#D4A96A" fill="#D4A96A" />)}
                  </div>
                  <p className="testi-text">{t.text}</p>
                  <div className="testi-rule" />
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

        {/* PRICING */}
        <section className="sec sec-bg" id="planos">
          <div className="sec-inner" style={{ textAlign:'center' }}>
            <div className="sec-label up" style={{ justifyContent:'center' }}>Planos</div>
            <h2 className="sec-h2 up">Comece de graça,<br/><em>vá mais longe com Premium</em></h2>
            <p className="sec-sub up" style={{ margin:'12px auto 0', textAlign:'center' }}>
              Crie sua conta e explore — sem precisar de cartão de crédito.
            </p>
            <div className="price-grid">
              <div className="price-card up">
                <div className="price-name">Gratuito</div>
                <div className="price-val">R$<sup></sup>0<span className="mo">/mês</span></div>
                <div className="price-desc">Para conhecer e se conectar</div>
                <div className="price-divider" />
                <ul className="price-list">
                  {['Acesso à comunidade','Conteúdo introdutório','Perfil personalizado','Publicações e interações'].map(item => (
                    <li key={item}>
                      <span className="chk"><Check size={9} color="#C9826B" strokeWidth={3} /></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/login" className="btn btn-outline" style={{ width:'100%' }}>
                  Criar conta grátis
                </Link>
              </div>
              <div className="price-card price-featured up">
                <div className="price-badge">Mais escolhido</div>
                <div className="price-name">Premium</div>
                <div className="price-val"><sup>R$</sup>47<span className="mo">/mês</span></div>
                <div className="price-desc">Acesso completo a tudo</div>
                <div className="price-divider" />
                <ul className="price-list">
                  {['Tudo do plano Gratuito','Cursos completos da Josi','Receitas e tutoriais exclusivos','Skincare — rotina completa','Conteúdo da chácara e pets','Novos conteúdos toda semana'].map(item => (
                    <li key={item}>
                      <span className="chk"><Check size={9} color="#FDF8F3" strokeWidth={3} /></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/login" className="btn btn-white" style={{ width:'100%' }}>
                  Assinar agora
                  <ArrowRight size={15} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="sec" id="faq" style={{ paddingTop:0 }}>
          <div className="sec-inner" style={{ textAlign:'center' }}>
            <div className="sec-label up" style={{ justifyContent:'center' }}>Dúvidas</div>
            <h2 className="sec-h2 up">Perguntas <em>frequentes</em></h2>
            <div className="faq-list" style={{ textAlign:'left' }}>
              {[
                { q:'Precisa instalar algum aplicativo?', a:'Não! O app da Josi funciona direto no navegador do seu celular, tablet ou computador — é só entrar no site e usar. Simples assim.' },
                { q:'Posso cancelar quando quiser?', a:'Sim! Sem multa, sem burocracia. Se cancelar, você continua com acesso premium até o final do mês já pago.' },
                { q:'Com que frequência tem conteúdo novo?', a:'A Josi adiciona novidades toda semana — receitas, vídeos, tutoriais e muito mais. Sempre tem algo novo pra explorar.' },
                { q:'A comunidade é aberta ou moderada?', a:'É moderada com carinho! A ideia é que seja um lugar seguro, acolhedor e sem julgamentos — igual à vibe da Josi.' },
                { q:'O conteúdo gratuito vale a pena?', a:'Claro! Você já tem acesso à comunidade, ao perfil e ao conteúdo de entrada. O Premium desbloqueia os cursos, tutoriais completos e os exclusivos.' },
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

        {/* CTA */}
        <section className="cta-sec">
          <div style={{ position:'relative', zIndex:1, maxWidth:600, margin:'0 auto' }}>
            <div className="up" style={{ display:'flex', justifyContent:'center', marginBottom:24 }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(201,130,107,.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Smile size={26} color="#D4A96A" strokeWidth={1.5} />
              </div>
            </div>
            <h2 className="cta-h up">
              Vem fazer parte<br/><em>da nossa comunidade</em>
            </h2>
            <p className="cta-callout up">
              Cria sua conta agora e começa a explorar. É de graça, é gostoso e é do jeito que a Josi gosta — com carinho.
            </p>
            <div className="up">
              <Link href="/auth/login" className="btn btn-white btn-lg">
                Quero entrar agora
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <Logo />
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
