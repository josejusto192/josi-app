'use client'

import { useState } from 'react'

const POSTS = [
  { id:1, user:'Ana Paula',   avatar:'A', day:7, text:'Gente, que orgulho! Terminei o dia 7 e meu corpo já tá diferente 😭🙏 quem mais tá sentindo?', likes:34, comments:12, time:'há 20min', tag:'Progresso' },
  { id:2, user:'Camila R.',   avatar:'C', day:5, text:'Fiz minha tarefa do diário hoje e chorei kkk Nunca pensei que me conhecia tão pouco. Obrigada Josi 🌿✨', likes:87, comments:28, time:'há 1h', tag:'Emoção' },
  { id:3, user:'Fernanda M.', avatar:'F', day:7, text:'Minha foto do antes e depois da semana 1! Já dá pra ver diferença na postura 💪', likes:156, comments:43, time:'há 3h', tag:'Resultado' },
  { id:4, user:'Josi',        avatar:'J', day:null, text:'Oi meninas! Vocês estão me emocionando com tanto carinho e dedicação 🥺🌸 Continuem firmes, o melhor ainda tá por vir!', likes:312, comments:67, time:'há 5h', tag:'Josi', josi:true },
]

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  Progresso: { bg:'#D6E4CE', color:'#3A5A42' },
  Emoção:    { bg:'#F9EAF0', color:'#A0526A' },
  Resultado: { bg:'#F0DEBB', color:'#7A5020' },
  Josi:      { bg:'linear-gradient(90deg,#C9826B,#D4A96A)', color:'#FDF8F3' },
}

export default function CommunityScreen() {
  const [liked, setLiked] = useState<Record<number, boolean>>({})
  const [tab, setTab]     = useState<'feed'|'ranking'>('feed')

  return (
    <div style={{ flex:1, overflowY:'auto', background:'#F5EDE3' }}>
      <div style={{ background:'#FDF8F3', padding:'16px 20px 0', borderBottom:'1px solid #E8D8CC' }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:'#4A2E22', marginBottom:12 }}>Comunidade</div>
        <div style={{ display:'flex' }}>
          {(['feed','ranking'] as const).map(t => (
            <div key={t} onClick={() => setTab(t)} style={{ flex:1, textAlign:'center', paddingBottom:10, fontSize:13, fontWeight:500, color: tab===t?'#C9826B':'#8A6A5A', borderBottom: tab===t?'2px solid #C9826B':'2px solid transparent', cursor:'pointer', transition:'all 150ms' }}>
              {t === 'feed' ? 'Feed' : 'Ranking 🏆'}
            </div>
          ))}
        </div>
      </div>

      {tab === 'feed' ? (
        <>
          <div style={{ padding:'14px 20px', background:'#FDF8F3', borderBottom:'1px solid #E8D8CC' }}>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'#F0D5C8', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:14, fontWeight:600, color:'#C9826B' }}>Eu</div>
              <div style={{ flex:1, background:'#F5EDE3', borderRadius:100, padding:'10px 16px', fontSize:13, color:'#B89B8C' }}>Compartilhe seu progresso hoje... 🌿</div>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'#C9826B', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, boxShadow:'0 4px 10px rgba(201,130,107,0.35)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FDF8F3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
            </div>
          </div>
          <div style={{ padding:'12px 20px', display:'flex', flexDirection:'column', gap:12 }}>
            {POSTS.map(post => {
              const tc  = TAG_COLORS[post.tag] || { bg:'#F0D5C8', color:'#C9826B' }
              const isLiked = liked[post.id]
              return (
                <div key={post.id} style={{ background:'#FDF8F3', borderRadius:20, padding:16, boxShadow: post.josi?'0 4px 20px rgba(201,130,107,0.18)':'0 2px 8px rgba(74,46,34,0.08)', border: post.josi?'1.5px solid rgba(201,130,107,0.2)':'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                    <div style={{ width:38, height:38, borderRadius:'50%', background: post.josi?'linear-gradient(135deg,#C9826B,#D4A96A)':'#F0D5C8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:600, color: post.josi?'#FDF8F3':'#C9826B', flexShrink:0 }}>
                      {post.avatar}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ fontSize:14, fontWeight:600, color:'#4A2E22' }}>{post.user}</span>
                        {post.josi && <span style={{ fontSize:9, background:'linear-gradient(90deg,#C9826B,#D4A96A)', color:'#FDF8F3', borderRadius:100, padding:'2px 7px', fontWeight:600 }}>CRIADORA</span>}
                      </div>
                      <div style={{ fontSize:11, color:'#8A6A5A', marginTop:1 }}>{post.day?`Dia ${post.day} · `:''}{post.time}</div>
                    </div>
                    <div style={{ padding:'3px 10px', borderRadius:100, background:tc.bg, color:tc.color, fontSize:10, fontWeight:600 }}>{post.tag}</div>
                  </div>
                  <div style={{ fontSize:14, color:'#4A2E22', lineHeight:1.6, marginBottom:12 }}>{post.text}</div>
                  <div style={{ display:'flex', gap:16, paddingTop:10, borderTop:'1px solid #F0E4DC' }}>
                    <div onClick={() => setLiked(p => ({...p,[post.id]:!p[post.id]}))} style={{ display:'flex', alignItems:'center', gap:5, cursor:'pointer' }}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill={isLiked?'#C9826B':'none'} stroke={isLiked?'#C9826B':'#B89B8C'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                      <span style={{ fontSize:12, color: isLiked?'#C9826B':'#8A6A5A', fontWeight: isLiked?600:400 }}>{post.likes+(isLiked?1:0)}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#B89B8C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      <span style={{ fontSize:12, color:'#8A6A5A' }}>{post.comments}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:500, color:'#4A2E22', marginBottom:4 }}>Top participantes 🌿</div>
          {[
            { pos:1, user:'Fernanda M.', days:7, streak:7, pts:420 },
            { pos:2, user:'Ana Paula',   days:7, streak:6, pts:380 },
            { pos:3, user:'Camila R.',   days:7, streak:5, pts:355 },
            { pos:4, user:'Bianca S.',   days:6, streak:6, pts:310 },
            { pos:5, user:'Você',        days:7, streak:7, pts:290, me:true },
          ].map(r => (
            <div key={r.pos} style={{ background: r.me?'#F0D5C8':'#FDF8F3', borderRadius:16, padding:'12px 16px', display:'flex', alignItems:'center', gap:12, boxShadow: r.pos<=3?'0 4px 14px rgba(74,46,34,0.10)':'0 2px 8px rgba(74,46,34,0.06)', border: r.me?'1.5px solid #C9826B':'none' }}>
              <div style={{ width:32, height:32, borderRadius:12, background: r.pos===1?'linear-gradient(135deg,#D4A96A,#E8C878)':r.pos===2?'#C0C8D4':r.pos===3?'#D4B898':'#F0E4DC', display:'flex', alignItems:'center', justifyContent:'center', fontSize: r.pos<=3?16:14, fontWeight:700, color: r.pos<=3?'#FDF8F3':'#8A6A5A', flexShrink:0 }}>
                {r.pos<=3?['🥇','🥈','🥉'][r.pos-1]:r.pos}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight: r.me?600:500, color:'#4A2E22' }}>{r.user}{r.me?' (você)':''}</div>
                <div style={{ fontSize:11, color:'#8A6A5A', marginTop:1 }}>Dia {r.days} · 🔥{r.streak} seguidos</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color: r.me?'#C9826B':'#4A2E22' }}>{r.pts}</div>
                <div style={{ fontSize:9, color:'#8A6A5A' }}>pontos</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
