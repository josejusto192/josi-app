'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Staggered reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('lp-in')
          observer.unobserve(e.target)
        }
      })
    }, { threshold: 0.08 })
    document.querySelectorAll('.lp-up').forEach(el => observer.observe(el))

    // Parallax orbs on hero
    const onMove = (ev: MouseEvent) => {
      if (!heroRef.current) return
      const { clientX, clientY, currentTarget } = ev
      const el = currentTarget as HTMLElement
      const { width, height } = el.getBoundingClientRect()
      const x = (clientX / width - 0.5) * 28
      const y = (clientY / height - 0.5) * 18
      heroRef.current.querySelectorAll<HTMLElement>('.lp-orb').forEach((orb, i) => {
        const factor = i % 2 === 0 ? 1 : -1
        orb.style.transform = `translate(${x * factor * 0.6}px, ${y * factor * 0.4}px)`
      })
    }
    const hero = heroRef.current?.parentElement
    hero?.addEventListener('mousemove', onMove)
    return () => { observer.disconnect(); hero?.removeEventListener('mousemove', onMove) }
  }, [])

  const toggleFaq = (btn: HTMLButtonElement) => {
    const item = btn.closest('.faq-item') as HTMLElement
    const isOpen = item.classList.contains('open')
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'))
    if (!isOpen) item.classList.add('open')
  }

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Outfit:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        /* ─── RESET & ROOT ─── */
        .lp *, .lp *::before, .lp *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .lp {
          --cream:    #FBF5EC;
          --deep:     #190D04;
          --terra:    #C4724A;
          --terra-l:  #D4845A;
          --gold:     #C89850;
          --gold-l:   #E0B870;
          --brown:    #2A1408;
          --muted:    #8A6450;
          --border:   rgba(42,20,8,0.10);
          --serif:    'Cormorant Garamond', Georgia, serif;
          --sans:     'Outfit', system-ui, sans-serif;
          font-family: var(--sans);
          background: var(--cream);
          color: var(--brown);
          overflow-x: hidden;
        }
        .lp a { text-decoration: none; color: inherit; }

        /* ─── GRAIN OVERLAY ─── */
        .lp::after {
          content: '';
          position: fixed; inset: 0; z-index: 9999;
          pointer-events: none;
          opacity: 0.028;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        /* ─── HEADER ─── */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; height: 68px;
          background: rgba(251,245,236,0.82);
          backdrop-filter: blur(16px) saturate(1.4);
          border-bottom: 1px solid var(--border);
          transition: background 0.3s;
        }
        .lp-logo {
          font-family: var(--serif);
          font-size: 26px; font-weight: 500; font-style: italic;
          color: var(--terra); letter-spacing: 0.01em;
        }
        .lp-nav-links { display: flex; gap: 32px; }
        .lp-nav-links a {
          font-size: 13px; font-weight: 500; letter-spacing: 0.04em;
          text-transform: uppercase; color: var(--muted);
          transition: color .2s;
        }
        .lp-nav-links a:hover { color: var(--terra); }
        .btn-pill {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--sans); font-size: 13px; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase;
          padding: 10px 24px; border-radius: 100px; cursor: pointer;
          border: none; transition: all .2s;
        }
        .btn-dark {
          background: var(--deep); color: var(--cream);
          box-shadow: 0 2px 12px rgba(25,13,4,0.25);
        }
        .btn-dark:hover { background: var(--brown); box-shadow: 0 4px 20px rgba(25,13,4,0.35); transform: translateY(-1px); }
        .btn-terra {
          background: var(--terra); color: #fff;
          box-shadow: 0 4px 20px rgba(196,114,74,0.4);
        }
        .btn-terra:hover { background: var(--terra-l); box-shadow: 0 8px 28px rgba(196,114,74,0.5); transform: translateY(-2px); }
        .btn-ghost {
          background: transparent; color: var(--terra);
          border: 1.5px solid var(--terra);
        }
        .btn-ghost:hover { background: rgba(196,114,74,0.06); }
        .btn-cream {
          background: var(--cream); color: var(--deep);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .btn-cream:hover { background: #fff; transform: translateY(-2px); }
        .btn-lg { font-size: 14px; padding: 14px 32px; }
        @media(max-width:720px){ .lp-nav-links { display:none; } .lp-nav { padding: 0 20px; } }

        /* ─── HERO ─── */
        .lp-hero {
          min-height: 100svh;
          background: var(--deep);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center;
          padding: 100px 24px 80px;
          position: relative; overflow: hidden;
        }
        .lp-hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 30% 50%, rgba(196,114,74,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 70% at 70% 30%, rgba(200,152,80,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 50% 50% at 50% 90%, rgba(196,114,74,0.08) 0%, transparent 50%);
        }
        .lp-orb {
          position: absolute; border-radius: 50%; pointer-events: none;
          transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .lp-orb-1 { width:500px;height:500px;left:-120px;top:-80px;background:radial-gradient(circle,rgba(196,114,74,0.14),transparent 70%); }
        .lp-orb-2 { width:400px;height:400px;right:-80px;bottom:10%;background:radial-gradient(circle,rgba(200,152,80,0.12),transparent 70%); }
        .lp-orb-3 { width:280px;height:280px;left:20%;bottom:-60px;background:radial-gradient(circle,rgba(196,114,74,0.09),transparent 70%); }

        .lp-hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid rgba(196,114,74,0.4);
          background: rgba(196,114,74,0.08);
          color: rgba(200,152,80,0.9);
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 6px 16px; border-radius: 100px; margin-bottom: 36px;
          animation: fadeUp 0.9s ease both;
        }
        .lp-hero-tag span { width:5px;height:5px;border-radius:50%;background:var(--gold-l); }

        .lp-hero h1 {
          font-family: var(--serif);
          font-size: clamp(52px, 9vw, 100px);
          font-weight: 400; line-height: 0.95; letter-spacing: -0.02em;
          color: #FBF5EC;
          margin-bottom: 28px;
          animation: fadeUp 0.9s 0.15s ease both;
        }
        .lp-hero h1 em {
          font-style: italic; font-weight: 300;
          color: var(--gold-l);
          display: block;
        }
        .lp-hero h1 strong {
          font-weight: 600; font-style: normal;
        }
        .lp-hero-sub {
          font-size: clamp(15px, 2vw, 18px); font-weight: 300;
          color: rgba(251,245,236,0.55); max-width: 480px;
          line-height: 1.7; margin-bottom: 44px;
          animation: fadeUp 0.9s 0.28s ease both;
        }
        .lp-hero-actions {
          display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
          animation: fadeUp 0.9s 0.4s ease both;
        }
        .lp-hero-proof {
          position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 16px;
          font-size: 12px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;
          color: rgba(251,245,236,0.35);
          animation: fadeUp 0.9s 0.55s ease both;
          white-space: nowrap;
        }
        .lp-hero-proof::before, .lp-hero-proof::after {
          content: ''; flex: 1; height: 1px;
          background: rgba(251,245,236,0.12);
          width: 60px;
        }
        .lp-scroll-hint {
          position: absolute; bottom: 36px; right: 40px;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          color: rgba(251,245,236,0.25); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
          animation: fadeIn 1.2s 1s ease both;
        }
        .lp-scroll-line {
          width: 1px; height: 48px;
          background: linear-gradient(to bottom, rgba(251,245,236,0.3), transparent);
          animation: scrollLine 2s 1.5s ease-in-out infinite;
        }
        @keyframes scrollLine {
          0%,100%{height:48px;opacity:1} 50%{height:28px;opacity:0.4}
        }

        /* ─── STATS STRIP ─── */
        .lp-stats {
          background: var(--terra);
          padding: 22px 40px;
          display: flex; justify-content: center; gap: clamp(32px, 6vw, 80px);
          flex-wrap: wrap;
        }
        .lp-stat { text-align: center; }
        .lp-stat-n {
          font-family: var(--serif); font-size: clamp(28px, 4vw, 38px);
          font-weight: 500; color: #fff; line-height: 1;
        }
        .lp-stat-l { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.65); margin-top: 4px; }

        /* ─── SECTION ─── */
        .lp-section { padding: 110px 40px; }
        .lp-section-inner { max-width: 1160px; margin: 0 auto; }
        .lp-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--terra); margin-bottom: 14px; display: flex; align-items: center; gap: 10px;
        }
        .lp-label::before { content:''; width:24px; height:1px; background:var(--terra); }
        .lp-h2 {
          font-family: var(--serif);
          font-size: clamp(36px, 5vw, 60px); font-weight: 400;
          line-height: 1.05; letter-spacing: -0.02em;
          color: var(--brown);
        }
        .lp-h2 em { font-style: italic; font-weight: 300; color: var(--terra); }
        .lp-body { font-size: 16px; font-weight: 300; color: var(--muted); line-height: 1.75; }

        /* ─── FEATURES ─── */
        .feats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 24px;
          overflow: hidden;
        }
        @media(max-width:900px){ .feats-grid { grid-template-columns: 1fr 1fr; } }
        @media(max-width:560px){ .feats-grid { grid-template-columns: 1fr; } }
        .feat {
          background: var(--cream);
          padding: 36px 32px 32px;
          transition: background 0.25s;
          position: relative; overflow: hidden;
        }
        .feat::before {
          content: attr(data-n);
          position: absolute; top: -10px; right: 16px;
          font-family: var(--serif); font-size: 96px; font-weight: 600;
          color: rgba(196,114,74,0.05); line-height: 1;
          pointer-events: none;
        }
        .feat:hover { background: #fff; }
        .feat-emoji { font-size: 28px; margin-bottom: 20px; display: block; }
        .feat-title {
          font-family: var(--serif); font-size: 22px; font-weight: 500;
          color: var(--brown); margin-bottom: 10px; line-height: 1.2;
        }
        .feat-desc { font-size: 14px; font-weight: 300; color: var(--muted); line-height: 1.65; }
        .feat-badge {
          display: inline-block; margin-top: 16px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 3px 10px; border-radius: 100px;
        }
        .feat-badge-free { background: rgba(196,114,74,0.1); color: var(--terra); }
        .feat-badge-prem { background: rgba(200,152,80,0.12); color: #9A7230; }

        /* ─── TESTIMONIALS ─── */
        .testi-bg { background: var(--deep); }
        .testi-bg .lp-label { color: rgba(200,152,80,0.7); }
        .testi-bg .lp-label::before { background: rgba(200,152,80,0.5); }
        .testi-bg .lp-h2 { color: var(--cream); }
        .testi-bg .lp-h2 em { color: var(--gold-l); }
        .testi-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 20px;
        }
        @media(max-width:900px){ .testi-grid { grid-template-columns: 1fr 1fr; } }
        @media(max-width:560px){ .testi-grid { grid-template-columns: 1fr; } }
        .testi-card {
          border: 1px solid rgba(251,245,236,0.08);
          border-radius: 20px; padding: 32px 28px;
          background: rgba(251,245,236,0.03);
          transition: background 0.25s, border-color 0.25s;
          position: relative;
        }
        .testi-card:hover { background: rgba(251,245,236,0.06); border-color: rgba(200,152,80,0.2); }
        .testi-quote {
          font-family: var(--serif); font-size: 64px; line-height: 0.8;
          color: var(--terra); opacity: 0.4; margin-bottom: 16px;
          display: block;
        }
        .testi-text {
          font-family: var(--serif); font-size: 17px; font-style: italic;
          font-weight: 300; line-height: 1.6; color: rgba(251,245,236,0.8);
          margin-bottom: 24px;
        }
        .testi-divider { width: 32px; height: 1px; background: rgba(200,152,80,0.3); margin-bottom: 20px; }
        .testi-name { font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(251,245,236,0.6); }
        .testi-role { font-size: 12px; color: rgba(251,245,236,0.3); margin-top: 3px; }
        .testi-stars { color: var(--gold-l); font-size: 12px; letter-spacing: 3px; margin-bottom: 18px; }

        /* ─── PRICING ─── */
        .price-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-width: 820px;
          margin: 0 auto;
        }
        @media(max-width:640px){ .price-grid { grid-template-columns: 1fr; } }
        .price-card {
          border-radius: 24px; padding: 40px 36px;
          border: 1.5px solid var(--border);
          background: #fff;
          display: flex; flex-direction: column;
          transition: box-shadow 0.25s, transform 0.25s;
        }
        .price-card:hover { box-shadow: 0 12px 40px rgba(42,20,8,0.1); transform: translateY(-3px); }
        .price-card-feat {
          background: var(--deep); border-color: transparent;
          box-shadow: 0 20px 60px rgba(25,13,4,0.35);
        }
        .price-card-feat:hover { box-shadow: 0 28px 70px rgba(25,13,4,0.45); }
        .price-highlight {
          font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--gold-l); margin-bottom: 28px;
          display: flex; align-items: center; gap: 8px;
        }
        .price-highlight::after { content:''; flex:1; height:1px; background:rgba(200,152,80,0.2); }
        .price-name {
          font-family: var(--serif); font-size: 28px; font-weight: 500;
          color: var(--brown); margin-bottom: 6px;
        }
        .price-card-feat .price-name { color: var(--cream); }
        .price-amount {
          font-family: var(--serif); font-size: 56px; font-weight: 400;
          line-height: 1; margin-bottom: 6px;
          color: var(--brown);
        }
        .price-card-feat .price-amount { color: var(--cream); }
        .price-amount sup { font-size: 22px; vertical-align: top; margin-top: 14px; }
        .price-amount .per { font-size: 16px; font-weight: 300; opacity: 0.5; }
        .price-desc { font-size: 13px; font-weight: 300; color: var(--muted); margin-bottom: 32px; }
        .price-card-feat .price-desc { color: rgba(251,245,236,0.45); }
        .price-divider { height: 1px; background: var(--border); margin-bottom: 28px; }
        .price-card-feat .price-divider { background: rgba(251,245,236,0.08); }
        .price-list { list-style: none; flex: 1; margin-bottom: 36px; display: flex; flex-direction: column; gap: 14px; }
        .price-list li {
          display: flex; align-items: flex-start; gap: 12px;
          font-size: 14px; font-weight: 300; color: var(--muted); line-height: 1.4;
        }
        .price-card-feat .price-list li { color: rgba(251,245,236,0.65); }
        .price-check {
          width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; margin-top: 1px;
          background: rgba(196,114,74,0.12);
          display: flex; align-items: center; justify-content: center;
        }
        .price-check svg { width: 9px; height: 9px; }
        .price-card-feat .price-check { background: rgba(200,152,80,0.2); }

        /* ─── FAQ ─── */
        .faq-wrap { max-width: 720px; margin: 0 auto; }
        .faq-item { border-bottom: 1px solid var(--border); }
        .faq-item:first-child { border-top: 1px solid var(--border); }
        .faq-btn {
          width: 100%; background: none; border: none; cursor: pointer; text-align: left;
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px 4px; gap: 16px;
        }
        .faq-q { font-family: var(--serif); font-size: 19px; font-weight: 400; color: var(--brown); line-height: 1.3; }
        .faq-icon {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          border: 1.5px solid var(--border); color: var(--terra);
          display: flex; align-items: center; justify-content: center; font-size: 18px;
          transition: transform 0.3s, background 0.2s, border-color 0.2s;
        }
        .faq-item.open .faq-icon { transform: rotate(45deg); background: var(--terra); border-color: var(--terra); color: #fff; }
        .faq-a {
          max-height: 0; overflow: hidden; transition: max-height .38s ease, padding .25s;
          padding: 0 4px; font-size: 15px; font-weight: 300; color: var(--muted); line-height: 1.75;
        }
        .faq-item.open .faq-a { max-height: 240px; padding-bottom: 22px; }

        /* ─── FINAL CTA ─── */
        .lp-cta-wrap {
          background: var(--deep);
          padding: 120px 40px;
          text-align: center; position: relative; overflow: hidden;
        }
        .lp-cta-wrap::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 70% at 50% 50%, rgba(196,114,74,0.12), transparent 60%);
        }
        .lp-cta-wrap .lp-label { justify-content: center; color: rgba(200,152,80,0.6); }
        .lp-cta-wrap .lp-label::before { background: rgba(200,152,80,0.4); }
        .lp-cta-h {
          font-family: var(--serif);
          font-size: clamp(44px, 7vw, 80px);
          font-weight: 400; font-style: italic;
          color: var(--cream); line-height: 1.0;
          margin-bottom: 24px; letter-spacing: -0.02em;
        }
        .lp-cta-h strong { font-style: normal; font-weight: 600; display: block; color: var(--gold-l); }
        .lp-cta-sub { font-size: 16px; font-weight: 300; color: rgba(251,245,236,0.5); margin-bottom: 44px; max-width: 460px; margin-left: auto; margin-right: auto; line-height: 1.65; }

        /* ─── FOOTER ─── */
        .lp-footer {
          background: var(--deep); border-top: 1px solid rgba(251,245,236,0.06);
          padding: 32px 40px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
        }
        .lp-footer-logo { font-family: var(--serif); font-size: 20px; font-style: italic; color: rgba(251,245,236,0.35); }
        .lp-footer-copy { font-size: 12px; color: rgba(251,245,236,0.2); }
        .lp-footer-links { display: flex; gap: 20px; }
        .lp-footer-links a { font-size: 12px; color: rgba(251,245,236,0.2); transition: color .2s; }
        .lp-footer-links a:hover { color: rgba(251,245,236,0.5); }

        /* ─── ANIMATIONS ─── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        .lp-up {
          opacity: 0; transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .lp-up:nth-child(2) { transition-delay: 0.1s; }
        .lp-up:nth-child(3) { transition-delay: 0.18s; }
        .lp-up:nth-child(4) { transition-delay: 0.26s; }
        .lp-up:nth-child(5) { transition-delay: 0.34s; }
        .lp-up:nth-child(6) { transition-delay: 0.42s; }
        .lp-in { opacity: 1 !important; transform: none !important; }

        @media(max-width:600px){
          .lp-section { padding: 80px 20px; }
          .lp-cta-wrap { padding: 80px 20px; }
          .lp-footer { padding: 24px 20px; flex-direction: column; align-items: flex-start; gap: 12px; }
          .lp-stats { padding: 18px 20px; gap: 24px; }
        }
      `}</style>

      <div className="lp">

        {/* ── HEADER ── */}
        <header className="lp-nav">
          <div className="lp-logo">Josi</div>
          <nav className="lp-nav-links">
            <a href="#features">O App</a>
            <a href="#depoimentos">Depoimentos</a>
            <a href="#planos">Planos</a>
            <a href="#faq">FAQ</a>
          </nav>
          <Link href="/auth/login" className="btn-pill btn-dark">Entrar</Link>
        </header>

        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-hero-bg" />
          <div ref={heroRef}>
            <div className="lp-orb lp-orb-1" />
            <div className="lp-orb lp-orb-2" />
            <div className="lp-orb lp-orb-3" />
          </div>

          <div className="lp-hero-tag">
            <span /> Exclusivo para seguidoras <span />
          </div>

          <h1 className="lp-hero h1" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(52px, 9vw, 100px)', fontWeight: 400, lineHeight: 0.95, letterSpacing: '-0.02em', color: '#FBF5EC', marginBottom: 28, animation: 'fadeUp 0.9s 0.15s ease both' }}>
            <em style={{ fontStyle:'italic', fontWeight:300, color:'var(--gold-l)', display:'block' }}>Sua melhor</em>
            <strong style={{ fontWeight:600 }}>versão</strong>
            <em style={{ fontStyle:'italic', fontWeight:300, color:'var(--gold-l)', display:'block' }}>começa aqui</em>
          </h1>

          <p className="lp-hero-sub">
            O app da Josi reúne treino, nutrição, comunidade e educação em um só lugar — para você transformar sua rotina de forma leve e consistente.
          </p>

          <div className="lp-hero-actions">
            <Link href="/auth/login" className="btn-pill btn-terra btn-lg">
              Quero meu acesso ✦
            </Link>
            <a href="#features" className="btn-pill btn-ghost btn-lg">
              Conhecer o app
            </a>
          </div>

          <div className="lp-hero-proof">
            +1.200 mulheres na jornada
          </div>

          <div className="lp-scroll-hint">
            <div className="lp-scroll-line" />
            <span>scroll</span>
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="lp-stats">
          {[
            { n: '1.200+', l: 'Membros ativos' },
            { n: '47',     l: 'Aulas disponíveis' },
            { n: '6',      l: 'Módulos de conteúdo' },
            { n: '4.9★',  l: 'Avaliação média' },
          ].map(s => (
            <div key={s.l} className="lp-stat">
              <div className="lp-stat-n">{s.n}</div>
              <div className="lp-stat-l">{s.l}</div>
            </div>
          ))}
        </div>

        {/* ── FEATURES ── */}
        <section className="lp-section" id="features">
          <div className="lp-section-inner">
            <div style={{ marginBottom: 56, maxWidth: 560 }}>
              <div className="lp-label lp-up">Funcionalidades</div>
              <h2 className="lp-h2 lp-up">
                Tudo que você precisa,<br/>
                <em>em um só lugar</em>
              </h2>
              <p className="lp-body lp-up" style={{ marginTop: 16 }}>
                Do treino de hoje ao desafio do mês — a Josi curou um ecossistema completo de saúde e bem-estar feminino.
              </p>
            </div>

            <div className="feats-grid">
              {[
                { n:'01', emoji:'💪', title:'Exercícios', desc:'Treinos guiados para todos os níveis, com foco em resultados reais e respeito ao seu corpo.', free:true },
                { n:'02', emoji:'🥗', title:'Nutrição & Receitas', desc:'Receitas saborosas, guias de alimentação e conteúdo educativo sobre nutrição funcional.', free:false },
                { n:'03', emoji:'🏅', title:'Desafio Mensal', desc:'Um novo desafio a cada mês para manter a consistência e celebrar cada conquista.', free:false },
                { n:'04', emoji:'🧠', title:'Educação', desc:'Cursos completos sobre saúde hormonal, mentalidade e beleza — aulas em vídeo e texto.', free:false },
                { n:'05', emoji:'💬', title:'Comunidade', desc:'Um espaço seguro para trocar experiências, tirar dúvidas e se inspirar com outras mulheres.', free:true },
                { n:'06', emoji:'🌸', title:'Loja Exclusiva', desc:'Produtos curados pela Josi — suplementos e itens de bem-estar para complementar sua jornada.', free:false },
              ].map(f => (
                <div key={f.n} className="feat lp-up" data-n={f.n}>
                  <span className="feat-emoji">{f.emoji}</span>
                  <div className="feat-title">{f.title}</div>
                  <p className="feat-desc">{f.desc}</p>
                  <span className={`feat-badge ${f.free ? 'feat-badge-free' : 'feat-badge-prem'}`}>
                    {f.free ? 'Incluído' : '✦ Premium'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="lp-section testi-bg" id="depoimentos">
          <div className="lp-section-inner">
            <div style={{ marginBottom: 56, display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:24 }}>
              <div>
                <div className="lp-label lp-up">Depoimentos</div>
                <h2 className="lp-h2 lp-up">
                  O que as alunas<br/><em>estão dizendo</em>
                </h2>
              </div>
              <Link href="/auth/login" className="btn-pill btn-ghost lp-up" style={{ borderColor:'rgba(196,114,74,0.4)', color:'var(--gold-l)' }}>
                Ver todas →
              </Link>
            </div>

            <div className="testi-grid">
              {[
                { initial:'A', name:'Ana Paula S.', role:'Membro desde o lançamento', text:'Em 30 dias de desafio já sinto diferença na disposição e no humor. O app é lindo, fácil de usar e os conteúdos da Josi são incríveis. Nunca me senti tão motivada!' },
                { initial:'C', name:'Carla M.', role:'2 meses no Premium', text:'Os cursos de nutrição mudaram minha relação com a comida. Nada de dieta restritiva — aprendi a comer bem de verdade. A comunidade é um suporte que eu não sabia que precisava.' },
                { initial:'M', name:'Mariana L.', role:'3 desafios concluídos', text:'Finalmente um app que parece ter sido feito pra mim. Os treinos são práticos, as receitas são gostosas de verdade e o desafio mensal me mantém focada. Vale muito cada centavo!' },
              ].map((t, i) => (
                <div key={t.name} className={`testi-card lp-up`} style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="testi-stars">★★★★★</div>
                  <span className="testi-quote">"</span>
                  <p className="testi-text">{t.text}</p>
                  <div className="testi-divider" />
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section className="lp-section" id="planos">
          <div className="lp-section-inner">
            <div style={{ textAlign:'center', marginBottom: 64 }}>
              <div className="lp-label lp-up" style={{ justifyContent:'center' }}>Planos</div>
              <h2 className="lp-h2 lp-up" style={{ textAlign:'center' }}>
                Escolha <em>como começar</em>
              </h2>
              <p className="lp-body lp-up" style={{ maxWidth:480, margin:'16px auto 0' }}>
                Comece gratuitamente e desbloqueie o app completo quando estiver pronta.
              </p>
            </div>

            <div className="price-grid">
              {/* FREE */}
              <div className="price-card lp-up">
                <div className="price-name">Gratuito</div>
                <div className="price-amount">R$<sup></sup>0<span className="per">/mês</span></div>
                <div className="price-desc">Para começar a explorar o app</div>
                <div className="price-divider" />
                <ul className="price-list">
                  {['Comunidade completa','Treinos básicos','Perfil personalizado','Conteúdo limitado da loja'].map(item => (
                    <li key={item}>
                      <span className="price-check">
                        <svg viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2L7.5 2" stroke="#C4724A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/login" className="btn-pill btn-ghost" style={{ width:'100%', justifyContent:'center' }}>
                  Criar conta grátis
                </Link>
              </div>

              {/* PREMIUM */}
              <div className="price-card price-card-feat lp-up">
                <div className="price-highlight">✦ Mais popular</div>
                <div className="price-name">Premium</div>
                <div className="price-amount" style={{ color:'#FBF5EC' }}><sup style={{ color:'#FBF5EC' }}>R$</sup>47<span className="per">/mês</span></div>
                <div className="price-desc">Acesso completo a tudo do app</div>
                <div className="price-divider" />
                <ul className="price-list">
                  {[
                    'Tudo do plano Gratuito',
                    'Cursos de nutrição, treino e mentalidade',
                    'Desafios mensais exclusivos',
                    'Receitas e guias alimentares',
                    'Suporte prioritário na comunidade',
                    'Novos conteúdos toda semana',
                  ].map(item => (
                    <li key={item}>
                      <span className="price-check">
                        <svg viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2L7.5 2" stroke="#E0B870" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/login" className="btn-pill btn-cream" style={{ width:'100%', justifyContent:'center' }}>
                  Assinar Premium ✦
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="lp-section" id="faq" style={{ paddingTop: 0 }}>
          <div className="lp-section-inner">
            <div style={{ textAlign:'center', marginBottom: 56 }}>
              <div className="lp-label lp-up" style={{ justifyContent:'center' }}>Dúvidas</div>
              <h2 className="lp-h2 lp-up" style={{ textAlign:'center' }}>Perguntas <em>frequentes</em></h2>
            </div>

            <div className="faq-wrap">
              {[
                { q: 'Posso cancelar a qualquer momento?', a: 'Sim! Você pode cancelar sua assinatura quando quiser, sem multas ou burocracia. Após o cancelamento, seu acesso premium permanece até o fim do período já pago.' },
                { q: 'O app funciona no celular?', a: 'Sim! O app é 100% responsivo e funciona perfeitamente no navegador do seu celular (Android e iPhone). Não é necessário instalar nada — basta acessar pelo browser.' },
                { q: 'Com que frequência saem conteúdos novos?', a: 'Novos conteúdos são adicionados toda semana — entre aulas, receitas e materiais de apoio. Além disso, a cada mês há um desafio novo para manter sua motivação lá em cima.' },
                { q: 'Preciso ter experiência com treino ou dieta?', a: 'Não! O app foi pensado para mulheres em todos os estágios — desde quem está começando do zero até quem já tem uma rotina estabelecida. Os conteúdos são organizados por nível.' },
                { q: 'Como funciona a comunidade?', a: 'A comunidade é um espaço dentro do próprio app onde você pode publicar textos, fotos e vídeos, curtir e comentar posts de outras mulheres, em um ambiente acolhedor e seguro.' },
              ].map(({ q, a }) => (
                <div key={q} className="faq-item lp-up">
                  <button className="faq-btn" onClick={e => toggleFaq(e.currentTarget)}>
                    <span className="faq-q">{q}</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className="faq-a">{a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="lp-cta-wrap">
          <div style={{ position:'relative', zIndex:1, maxWidth:640, margin:'0 auto' }}>
            <div className="lp-label lp-up">Pronta para começar?</div>
            <h2 className="lp-cta-h lp-up">
              A sua jornada<br/>
              <strong>começa agora</strong>
            </h2>
            <p className="lp-cta-sub lp-up">
              Junte-se a mais de 1.200 mulheres que já deram o primeiro passo. Crie sua conta — é de graça.
            </p>
            <div className="lp-up">
              <Link href="/auth/login" className="btn-pill btn-terra btn-lg">
                Quero começar agora ✦
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <div className="lp-footer-logo">Josi</div>
          <div className="lp-footer-copy">© 2025 Josi App · Todos os direitos reservados</div>
          <div className="lp-footer-links">
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
          </div>
        </footer>

      </div>
    </>
  )
}
