'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Author = { id: string; nome: string | null }
type Post = {
  id: string; user_id: string; conteudo: string; tipo: string
  foto_url: string | null; video_url: string | null
  likes_count: number; is_pinned: boolean; is_deleted: boolean
  created_at: string; author?: Author; comments_count: number
}

const TIPO_COLORS: Record<string, string> = {
  resultado: '#8A9E7B', motivacao: '#C9826B', pergunta: '#6BA3BE',
  receita: '#D4A96A', dica: '#A06858',
}

const timeAgo = (d: string) => new Date(d).toLocaleDateString('pt-BR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })

export default function AdminComunidadeClient({ initialPosts }: { initialPosts: Post[] }) {
  const supabase = createClient()
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [filter, setFilter] = useState<'todos' | 'pinned' | 'deletados'>('todos')
  const [expandedMedia, setExpandedMedia] = useState<string | null>(null)

  const pin = async (id: string, current: boolean) => {
    await supabase.from('community_posts').update({ is_pinned: !current }).eq('id', id)
    setPosts(prev => prev.map(p => p.id === id ? { ...p, is_pinned: !current } : p))
  }

  const remove = async (id: string) => {
    if (!confirm('Remover este post?')) return
    await supabase.from('community_posts').update({ is_deleted: true }).eq('id', id)
    setPosts(prev => prev.map(p => p.id === id ? { ...p, is_deleted: true } : p))
  }

  const restore = async (id: string) => {
    await supabase.from('community_posts').update({ is_deleted: false }).eq('id', id)
    setPosts(prev => prev.map(p => p.id === id ? { ...p, is_deleted: false } : p))
  }

  const filtered = posts.filter(p => {
    if (filter === 'pinned')    return p.is_pinned && !p.is_deleted
    if (filter === 'deletados') return p.is_deleted
    return !p.is_deleted
  })

  const stats = {
    total:    posts.filter(p => !p.is_deleted).length,
    pinned:   posts.filter(p => p.is_pinned && !p.is_deleted).length,
    removed:  posts.filter(p => p.is_deleted).length,
    likes:    posts.filter(p => !p.is_deleted).reduce((s, p) => s + (p.likes_count || 0), 0),
    comments: posts.filter(p => !p.is_deleted).reduce((s, p) => s + (p.comments_count || 0), 0),
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:600, color:'#4A2E22', margin:'0 0 4px' }}>Comunidade</h1>
        <p style={{ color:'#8A6A5A', fontSize:14, margin:0 }}>Modere posts, fixe conteúdos e remova spam</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:24 }}>
        {[
          { label:'Posts ativos', value: stats.total,    color:'#C9826B' },
          { label:'Fixados',      value: stats.pinned,   color:'#D4A96A' },
          { label:'Removidos',    value: stats.removed,  color:'#B89B8C' },
          { label:'Curtidas',     value: stats.likes,    color:'#8A9E7B' },
          { label:'Comentários',  value: stats.comments, color:'#6BA3BE' },
        ].map(s => (
          <div key={s.label} style={{ background:'#FDF8F3', borderRadius:14, padding:'14px 16px', boxShadow:'0 2px 8px rgba(74,46,34,0.08)' }}>
            <div style={{ fontSize:10, color:'#8A6A5A', letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:6 }}>{s.label}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:600, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {(['todos','pinned','deletados'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:'7px 16px', borderRadius:100, border:'none', cursor:'pointer', fontSize:13, fontWeight:500, fontFamily:"'DM Sans',sans-serif",
              background: filter === f ? '#4A2E22' : '#FDF8F3',
              color: filter === f ? '#FDF8F3' : '#4A2E22',
              boxShadow:'0 1px 4px rgba(74,46,34,0.1)',
            }}>
            {f === 'todos' ? `Todos (${stats.total})` : f === 'pinned' ? `📌 Fixados (${stats.pinned})` : `🗑 Removidos (${stats.removed})`}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'40px 20px', color:'#8A6A5A', fontSize:14 }}>Nenhum post aqui.</div>
        )}
        {filtered.map(post => (
          <div key={post.id} style={{
            background:'#FDF8F3', borderRadius:16, padding:'16px 18px',
            boxShadow:'0 2px 8px rgba(74,46,34,0.08)',
            opacity: post.is_deleted ? 0.55 : 1,
            border: post.is_pinned ? '2px solid #D4A96A' : '2px solid transparent',
          }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
              {/* Avatar */}
              <div style={{ width:38, height:38, borderRadius:'50%', background:'#F0D5C8', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:14, fontWeight:600, color:'#C9826B' }}>
                {post.author?.nome?.[0]?.toUpperCase() ?? '?'}
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                {/* Meta */}
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, flexWrap:'wrap' }}>
                  <span style={{ fontSize:13, fontWeight:600, color:'#4A2E22' }}>{post.author?.nome ?? 'Usuária'}</span>
                  {post.is_pinned && <span style={{ fontSize:9, fontWeight:700, color:'#7A5020', background:'#F5E6CE', padding:'2px 8px', borderRadius:100 }}>📌 FIXADO</span>}
                  {post.is_deleted && <span style={{ fontSize:9, fontWeight:700, color:'#8A6A5A', background:'#F0D5C8', padding:'2px 8px', borderRadius:100 }}>REMOVIDO</span>}
                  <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:100, background:'#F5EDE3', color: TIPO_COLORS[post.tipo] ?? '#8A6A5A' }}>{post.tipo}</span>
                  <span style={{ fontSize:11, color:'#B89B8C', marginLeft:'auto' }}>{timeAgo(post.created_at)}</span>
                </div>

                {/* Conteúdo */}
                <div style={{ fontSize:13, color:'#4A2E22', lineHeight:1.6, marginBottom:8 }}>{post.conteudo}</div>

                {/* Mídia */}
                {(post.foto_url || post.video_url) && (
                  <div style={{ marginBottom:8 }}>
                    {post.foto_url && (
                      <img
                        src={post.foto_url}
                        alt=""
                        onClick={() => setExpandedMedia(expandedMedia === post.id ? null : post.id)}
                        style={{ maxWidth: expandedMedia === post.id ? '100%' : 120, height: expandedMedia === post.id ? 'auto' : 80, objectFit:'cover', borderRadius:10, cursor:'pointer' }}
                      />
                    )}
                    {post.video_url && (
                      <video src={post.video_url} controls style={{ maxWidth:'100%', maxHeight:200, borderRadius:10 }} />
                    )}
                  </div>
                )}

                {/* Stats */}
                <div style={{ display:'flex', gap:14 }}>
                  <span style={{ fontSize:11, color:'#8A6A5A' }}>♥ {post.likes_count}</span>
                  <span style={{ fontSize:11, color:'#8A6A5A' }}>💬 {post.comments_count}</span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div style={{ display:'flex', gap:8, marginTop:12, paddingTop:12, borderTop:'1px solid #F0E4DC' }}>
              {!post.is_deleted && (
                <button onClick={() => pin(post.id, post.is_pinned)}
                  style={{ fontSize:12, padding:'5px 12px', borderRadius:100, border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", background: post.is_pinned ? '#F5E6CE' : '#F5EDE3', color:'#7A5020' }}>
                  {post.is_pinned ? '📌 Desafixar' : '📌 Fixar'}
                </button>
              )}
              {!post.is_deleted ? (
                <button onClick={() => remove(post.id)}
                  style={{ fontSize:12, padding:'5px 12px', borderRadius:100, border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", background:'#F0D5C8', color:'#A06858' }}>
                  🗑 Remover
                </button>
              ) : (
                <button onClick={() => restore(post.id)}
                  style={{ fontSize:12, padding:'5px 12px', borderRadius:100, border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", background:'#D6E4CE', color:'#3A5A42' }}>
                  ↩ Restaurar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
