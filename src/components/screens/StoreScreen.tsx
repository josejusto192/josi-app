'use client'

import { useState } from 'react'

const PRODUCTS = [
  { id:1, name:'Whey Protein Natural',    cat:'Suplementos', price:'R$ 129,90', priceOld:'R$ 159,90', emoji:'🥛', badge:'Mais vendido', badgeColor:{bg:'#2F4A3B',c:'#FAF7F2'}, color:'#D4E3D8' },
  { id:2, name:'Colágeno com Vitamina C', cat:'Suplementos', price:'R$ 79,90',  priceOld:null,         emoji:'✨', badge:'Novo',        badgeColor:{bg:'#A0526A',c:'#FAF7F2'}, color:'#F9EAF0' },
  { id:3, name:'Creatina Monohidratada',  cat:'Suplementos', price:'R$ 89,90',  priceOld:'R$ 109,90',  emoji:'💊', badge:null,          badgeColor:null,                       color:'#D6E4CE' },
  { id:4, name:'Kit Skincare Natural',    cat:'Beleza',      price:'R$ 189,90', priceOld:null,         emoji:'🌸', badge:'Exclusivo',   badgeColor:{bg:'#C49A5A',c:'#FAF7F2'}, color:'#F0DEBB' },
  { id:5, name:'Coqueteleira da Josi',    cat:'Acessórios',  price:'R$ 59,90',  priceOld:null,         emoji:'🥤', badge:null,          badgeColor:null,                       color:'#D4E3D8' },
  { id:6, name:'Elástico de Treino Kit',  cat:'Acessórios',  price:'R$ 49,90',  priceOld:'R$ 69,90',   emoji:'🏋️', badge:'Oferta',      badgeColor:{bg:'#6B7F63',c:'#FAF7F2'}, color:'#D6E4CE' },
]

const CATS = ['Todos','Suplementos','Beleza','Acessórios']

export default function StoreScreen() {
  const [cat, setCat]   = useState('Todos')
  const [cart, setCart] = useState<number[]>([])

  const filtered   = cat === 'Todos' ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat)
  const toggleCart = (id: number) => setCart(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <div style={{ flex:1, overflowY:'auto', background:'#F3E9DC' }}>
      <div style={{ background:'#FAF7F2', padding:'16px 20px 14px', borderBottom:'1px solid #DDD5C5' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:22, fontWeight:600, color:'#2F4A3B' }}>Loja</div>
          <div style={{ position:'relative', cursor:'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2F4A3B" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cart.length > 0 && (
              <div style={{ position:'absolute', top:-5, right:-5, width:16, height:16, borderRadius:'50%', background:'#2F4A3B', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:9, color:'#FAF7F2', fontWeight:700 }}>{cart.length}</span>
              </div>
            )}
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'#F3E9DC', borderRadius:14, padding:'10px 14px', border:'1.5px solid #DDD5C5' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9DB09A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span style={{ fontSize:13, color:'#9DB09A' }}>Buscar produtos...</span>
        </div>
      </div>

      <div style={{ margin:'14px 20px 0', background:'linear-gradient(135deg,#2F4A3B,#C49A5A)', borderRadius:20, padding:'18px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 6px 20px rgba(47,74,59,0.30)' }}>
        <div>
          <div style={{ fontSize:10, color:'rgba(253,248,243,0.75)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:4 }}>Oferta especial</div>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:18, fontWeight:600, color:'#FAF7F2', lineHeight:1.2, marginBottom:8 }}>Kit Desafio 21 Dias</div>
          <div style={{ background:'rgba(253,248,243,0.2)', borderRadius:100, padding:'6px 14px', display:'inline-block', cursor:'pointer' }}>
            <span style={{ fontSize:13, color:'#FAF7F2', fontWeight:600 }}>Ver kit completo →</span>
          </div>
        </div>
        <div style={{ fontSize:48 }}>🎁</div>
      </div>

      <div style={{ display:'flex', gap:8, padding:'14px 20px 4px', overflowX:'auto' }}>
        {CATS.map(c => (
          <div key={c} onClick={() => setCat(c)} style={{ padding:'7px 16px', borderRadius:100, fontSize:12, fontWeight:500, whiteSpace:'nowrap', cursor:'pointer', background: cat===c?'#2F4A3B':'#FAF7F2', color: cat===c?'#FAF7F2':'#2F4A3B', border: cat===c?'1.5px solid #2F4A3B':'1.5px solid #DDD5C5', transition:'all 150ms', flexShrink:0 }}>
            {c}
          </div>
        ))}
      </div>

      <div style={{ padding:'12px 20px 24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {filtered.map(p => {
          const inCart = cart.includes(p.id)
          return (
            <div key={p.id} style={{ background:'#FAF7F2', borderRadius:18, overflow:'hidden', boxShadow:'0 3px 12px rgba(47,74,59,0.09)', cursor:'pointer' }}>
              <div style={{ background:p.color, padding:'20px 0 16px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, position:'relative' }}>
                {p.badge && p.badgeColor && (
                  <div style={{ position:'absolute', top:8, left:8, background:p.badgeColor.bg, color:p.badgeColor.c, borderRadius:100, padding:'2px 9px', fontSize:9, fontWeight:700 }}>{p.badge}</div>
                )}
                {p.emoji}
              </div>
              <div style={{ padding:'10px 12px 12px' }}>
                <div style={{ fontSize:9, color:'#6B7F63', fontWeight:500, letterSpacing:'0.04em', textTransform:'uppercase', marginBottom:3 }}>{p.cat}</div>
                <div style={{ fontSize:13, fontWeight:500, color:'#2F4A3B', lineHeight:1.3, marginBottom:6 }}>{p.name}</div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                  <span style={{ fontFamily:"'Cinzel',serif", fontSize:16, fontWeight:600, color:'#2F4A3B' }}>{p.price}</span>
                  {p.priceOld && <span style={{ fontSize:11, color:'#9DB09A', textDecoration:'line-through' }}>{p.priceOld}</span>}
                </div>
                <button onClick={e => { e.stopPropagation(); toggleCart(p.id) }}
                  style={{ width:'100%', background: inCart?'#6B7F63':'#2F4A3B', color:'#FAF7F2', border:'none', borderRadius:100, padding:8, fontSize:12, fontWeight:500, fontFamily:"'Lato',sans-serif", cursor:'pointer', transition:'background 200ms' }}>
                  {inCart ? '✓ Adicionado' : 'Adicionar'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
