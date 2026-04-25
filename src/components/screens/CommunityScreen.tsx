'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

// ── Types ─────────────────────────────────────────────────────────────────────
type Profile = { id: string; nome: string | null; is_admin: boolean }
type Post = {
  id: string; user_id: string; conteudo: string; foto_url: string | null
  video_url: string | null; tipo: string; likes_count: number
  is_pinned: boolean; is_deleted: boolean; created_at: string
  author?: Profile; comments_count?: number; i_liked?: boolean
}
type Comment = {
  id: string; post_id: string; user_id: string; conteudo: string
  parent_id: string | null; likes_count: number; is_deleted: boolean
  created_at: string; author?: Profile; i_liked?: boolean
  replies?: Comment[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const initials = (n: string | null | undefined) =>
  n ? n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : '?'

const timeAgo = (d: string) => {
  const diff = Date.now() - new Date(d).getTime()
  if (diff < 60000)  return 'agora'
  if (diff < 3600000) return `${Math.floor(diff/60000)}min`
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h`
  return `${Math.floor(diff/86400000)}d`
}

const TIPO_LABELS: Record<string, string> = {
  resultado: '🏆 Resultado', motivacao: '💪 Motivação',
  pergunta: '❓ Pergunta', receita: '🥗 Receita', dica: '💡 Dica',
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, size = 38, josi }: { name?: string | null; size?: number; josi?: boolean }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: josi ? 'linear-gradient(135deg,#2F4A3B,#C49A5A)' : '#D4E3D8',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 600,
      color: josi ? '#FAF7F2' : '#2F4A3B', border: josi ? '2px solid #C49A5A' : 'none',
    }}>
      {initials(name)}
    </div>
  )
}

// ── Create Post Modal ─────────────────────────────────────────────────────────
function CreatePostModal({ me, onClose, onCreated }: {
  me: Profile; onClose: () => void; onCreated: (p: Post) => void
}) {
  const supabase = createClient()
  const [text, setText]       = useState('')
  const [tipo, setTipo]       = useState('motivacao')
  const [file, setFile]       = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isVideo, setIsVideo] = useState(false)
  const [posting, setPosting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f); setIsVideo(f.type.startsWith('video'))
    setPreview(URL.createObjectURL(f))
  }

  const submit = async () => {
    if (!text.trim() && !file) return
    setPosting(true)
    let foto_url: string | null = null
    let video_url: string | null = null

    if (file) {
      const ext  = file.name.split('.').pop()
      const path = `${me.id}/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('community-media').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('community-media').getPublicUrl(path)
        if (isVideo) video_url = data.publicUrl
        else          foto_url = data.publicUrl
      }
    }

    const payload = { user_id: me.id, conteudo: text.trim(), tipo, foto_url, video_url }
    const { data, error } = await supabase.from('community_posts').insert(payload).select('*').single()
    setPosting(false)
    if (!error && data) {
      onCreated({ ...data, author: me, comments_count: 0, i_liked: false })
      onClose()
    }
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'flex-end', background:'rgba(47,74,59,0.45)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width:'100%', maxWidth:480, margin:'0 auto', background:'#FAF7F2', borderRadius:'24px 24px 0 0', padding:'20px 20px 32px', boxShadow:'0 -8px 40px rgba(47,74,59,0.2)' }}>
        <div style={{ width:40, height:4, background:'#DDD5C5', borderRadius:100, margin:'0 auto 18px' }} />

        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <Avatar name={me.nome} josi={me.is_admin} />
          <div>
            <div style={{ fontSize:14, fontWeight:600, color:'#2F4A3B' }}>{me.nome ?? 'Você'}</div>
            <select value={tipo} onChange={e => setTipo(e.target.value)}
              style={{ fontSize:11, color:'#6B7F63', background:'transparent', border:'none', outline:'none', cursor:'pointer', fontFamily:"'Lato',sans-serif" }}>
              {Object.entries(TIPO_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>

        <textarea
          value={text} onChange={e => setText(e.target.value)}
          placeholder="Compartilhe seu progresso, receita, dica ou pergunta... 🌿"
          autoFocus
          style={{ width:'100%', minHeight:110, background:'#F3E9DC', border:'none', borderRadius:16, padding:'12px 14px', fontSize:14, color:'#2F4A3B', fontFamily:"'Lato',sans-serif", resize:'none', outline:'none', boxSizing:'border-box', lineHeight:1.6 }}
        />

        {preview && (
          <div style={{ marginTop:10, position:'relative', display:'inline-block' }}>
            {isVideo
              ? <video src={preview} style={{ maxWidth:'100%', maxHeight:200, borderRadius:12 }} controls />
              : <img src={preview} alt="" style={{ maxWidth:'100%', maxHeight:200, borderRadius:12, objectFit:'cover' }} />}
            <button onClick={() => { setFile(null); setPreview(null) }}
              style={{ position:'absolute', top:6, right:6, width:26, height:26, borderRadius:'50%', background:'rgba(47,74,59,0.7)', border:'none', color:'#FAF7F2', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              ×
            </button>
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*,video/*" onChange={pickFile} style={{ display:'none' }} />

        <div style={{ display:'flex', gap:10, marginTop:14, alignItems:'center' }}>
          <button onClick={() => fileRef.current?.click()}
            style={{ width:40, height:40, borderRadius:12, background:'#F3E9DC', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
            📷
          </button>
          <div style={{ flex:1 }} />
          <button onClick={onClose}
            style={{ padding:'10px 18px', borderRadius:100, background:'#D4E3D8', border:'none', cursor:'pointer', fontSize:14, fontWeight:600, color:'#A06858', fontFamily:"'Lato',sans-serif" }}>
            Cancelar
          </button>
          <button onClick={submit} disabled={posting || (!text.trim() && !file)}
            style={{ padding:'10px 22px', borderRadius:100, background: posting ? '#C49A5A' : '#2F4A3B', border:'none', cursor:'pointer', fontSize:14, fontWeight:600, color:'#FAF7F2', fontFamily:"'Lato',sans-serif", opacity: (!text.trim() && !file) ? 0.5 : 1, transition:'all 150ms' }}>
            {posting ? '…' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Edit Post Modal ───────────────────────────────────────────────────────────
function EditPostModal({ post, onClose, onUpdated }: {
  post: Post; onClose: () => void; onUpdated: (p: Post) => void
}) {
  const supabase = createClient()
  const [text, setText]   = useState(post.conteudo)
  const [tipo, setTipo]   = useState(post.tipo)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!text.trim()) return
    setSaving(true)
    const { data, error } = await supabase.from('community_posts')
      .update({ conteudo: text.trim(), tipo }).eq('id', post.id).select('*').single()
    setSaving(false)
    if (!error && data) onUpdated({ ...post, conteudo: data.conteudo, tipo: data.tipo })
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'flex-end', background:'rgba(47,74,59,0.45)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width:'100%', maxWidth:480, margin:'0 auto', background:'#FAF7F2', borderRadius:'24px 24px 0 0', padding:'20px 20px 32px' }}>
        <div style={{ width:40, height:4, background:'#DDD5C5', borderRadius:100, margin:'0 auto 18px' }} />
        <div style={{ fontSize:16, fontWeight:600, color:'#2F4A3B', marginBottom:14 }}>Editar post</div>

        <select value={tipo} onChange={e => setTipo(e.target.value)}
          style={{ width:'100%', background:'#F3E9DC', border:'1.5px solid #DDD5C5', borderRadius:12, padding:'9px 12px', fontSize:13, color:'#2F4A3B', marginBottom:10, fontFamily:"'Lato',sans-serif", outline:'none' }}>
          {Object.entries(TIPO_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>

        <textarea value={text} onChange={e => setText(e.target.value)} rows={5}
          style={{ width:'100%', background:'#F3E9DC', border:'1.5px solid #DDD5C5', borderRadius:12, padding:'11px 14px', fontSize:14, color:'#2F4A3B', fontFamily:"'Lato',sans-serif", resize:'none', outline:'none', boxSizing:'border-box', lineHeight:1.6 }} />

        <div style={{ display:'flex', gap:10, marginTop:14, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'10px 18px', borderRadius:100, background:'#D4E3D8', border:'none', cursor:'pointer', fontSize:14, fontWeight:600, color:'#A06858', fontFamily:"'Lato',sans-serif" }}>
            Cancelar
          </button>
          <button onClick={save} disabled={saving || !text.trim()}
            style={{ padding:'10px 22px', borderRadius:100, background:'#2F4A3B', border:'none', cursor:'pointer', fontSize:14, fontWeight:600, color:'#FAF7F2', fontFamily:"'Lato',sans-serif" }}>
            {saving ? '…' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Comments Panel ─────────────────────────────────────────────────────────────
function CommentsPanel({ post, me, onClose, onCommentCountChange }: {
  post: Post; me: Profile; onClose: () => void; onCommentCountChange: (n: number) => void
}) {
  const supabase = createClient()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading]   = useState(true)
  const [text, setText]         = useState('')
  const [replyTo, setReplyTo]   = useState<Comment | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [sending, setSending]   = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('post_comments')
      .select('*, author:profiles!user_id(id,nome,is_admin)')
      .eq('post_id', post.id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })

    if (!data) { setLoading(false); return }

    const uid = me.id
    const likeRes = await supabase.from('comment_likes').select('comment_id').eq('user_id', uid)
    const likedSet = new Set((likeRes.data ?? []).map((r: { comment_id: string }) => r.comment_id))

    const withLiked = data.map((c: Comment) => ({
      ...c, i_liked: likedSet.has(c.id),
      author: Array.isArray(c.author) ? c.author[0] : c.author,
    }))

    // Build tree
    const roots: Comment[] = []
    const map: Record<string, Comment> = {}
    withLiked.forEach((c: Comment) => { map[c.id] = { ...c, replies: [] } })
    withLiked.forEach((c: Comment) => {
      if (c.parent_id && map[c.parent_id]) map[c.parent_id].replies!.push(map[c.id])
      else roots.push(map[c.id])
    })
    setComments(roots)
    setLoading(false)
  }, [post.id, me.id])

  useEffect(() => { fetchComments() }, [fetchComments])

  const countAll = (cs: Comment[]): number =>
    cs.reduce((n, c) => n + 1 + countAll(c.replies ?? []), 0)

  const send = async () => {
    if (!text.trim()) return
    setSending(true)
    const payload = { post_id: post.id, user_id: me.id, conteudo: text.trim(), parent_id: replyTo?.id ?? null }
    await supabase.from('post_comments').insert(payload)
    setText(''); setReplyTo(null); setSending(false)
    await fetchComments()
    const total = countAll(comments) + 1
    onCommentCountChange(total)
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const likeComment = async (c: Comment) => {
    const update = (cs: Comment[]): Comment[] => cs.map(x =>
      x.id === c.id
        ? { ...x, i_liked: !x.i_liked, likes_count: x.i_liked ? x.likes_count - 1 : x.likes_count + 1 }
        : { ...x, replies: update(x.replies ?? []) }
    )
    setComments(prev => update(prev))
    if (c.i_liked) await supabase.from('comment_likes').delete().match({ user_id: me.id, comment_id: c.id })
    else           await supabase.from('comment_likes').insert({ user_id: me.id, comment_id: c.id })
  }

  const deleteComment = async (id: string) => {
    if (!confirm('Remover comentário?')) return
    await supabase.from('post_comments').update({ is_deleted: true }).eq('id', id)
    const remove = (cs: Comment[]): Comment[] =>
      cs.filter(c => c.id !== id).map(c => ({ ...c, replies: remove(c.replies ?? []) }))
    const next = remove(comments)
    setComments(next)
    onCommentCountChange(countAll(next))
  }

  const saveEdit = async (id: string) => {
    if (!editText.trim()) return
    await supabase.from('post_comments').update({ conteudo: editText.trim() }).eq('id', id)
    const update = (cs: Comment[]): Comment[] => cs.map(c =>
      c.id === id ? { ...c, conteudo: editText.trim() }
                  : { ...c, replies: update(c.replies ?? []) }
    )
    setComments(prev => update(prev))
    setEditingId(null)
  }

  const canDelete = (c: Comment) => c.user_id === me.id || me.is_admin

  const renderComment = (c: Comment, isReply = false) => (
    <div key={c.id} style={{ marginLeft: isReply ? 36 : 0, marginTop: 12 }}>
      <div style={{ display:'flex', gap:10 }}>
        <Avatar name={c.author?.nome} size={isReply ? 28 : 34} josi={c.author?.is_admin} />
        <div style={{ flex:1 }}>
          <div style={{ background:'#F3E9DC', borderRadius: isReply ? '12px 12px 12px 0' : '0 12px 12px 12px', padding:'10px 12px', display:'inline-block', maxWidth:'100%' }}>
            <div style={{ fontSize:12, fontWeight:600, color:'#2F4A3B', marginBottom:3 }}>
              {c.author?.nome ?? 'Usuária'}
              {c.author?.is_admin && <span style={{ fontSize:9, background:'linear-gradient(90deg,#2F4A3B,#C49A5A)', color:'#FAF7F2', borderRadius:100, padding:'1px 6px', marginLeft:6, fontWeight:700 }}>CRIADORA</span>}
            </div>
            {editingId === c.id ? (
              <div>
                <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={2}
                  style={{ width:'100%', background:'#FAF7F2', border:'1px solid #DDD5C5', borderRadius:8, padding:'6px 8px', fontSize:13, color:'#2F4A3B', fontFamily:"'Lato',sans-serif", resize:'none', outline:'none', boxSizing:'border-box' }} />
                <div style={{ display:'flex', gap:6, marginTop:4 }}>
                  <button onClick={() => saveEdit(c.id)} style={{ fontSize:11, padding:'3px 10px', borderRadius:100, background:'#2F4A3B', border:'none', color:'#FAF7F2', cursor:'pointer' }}>Salvar</button>
                  <button onClick={() => setEditingId(null)} style={{ fontSize:11, padding:'3px 10px', borderRadius:100, background:'#D4E3D8', border:'none', color:'#A06858', cursor:'pointer' }}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize:13, color:'#2F4A3B', lineHeight:1.5 }}>{c.conteudo}</div>
            )}
          </div>
          <div style={{ display:'flex', gap:14, marginTop:5, alignItems:'center' }}>
            <span style={{ fontSize:10, color:'#9DB09A' }}>{timeAgo(c.created_at)}</span>
            <button onClick={() => likeComment(c)}
              style={{ fontSize:11, color: c.i_liked ? '#2F4A3B' : '#6B7F63', background:'none', border:'none', cursor:'pointer', fontWeight: c.i_liked ? 600 : 400, display:'flex', alignItems:'center', gap:3, padding:0 }}>
              {c.i_liked ? '♥' : '♡'} {c.likes_count > 0 ? c.likes_count : ''}
            </button>
            {!isReply && (
              <button onClick={() => { setReplyTo(c); setText('@' + (c.author?.nome?.split(' ')[0] ?? 'você') + ' ') }}
                style={{ fontSize:11, color:'#6B7F63', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                Responder
              </button>
            )}
            {c.user_id === me.id && editingId !== c.id && (
              <button onClick={() => { setEditingId(c.id); setEditText(c.conteudo) }}
                style={{ fontSize:11, color:'#6B7F63', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                Editar
              </button>
            )}
            {canDelete(c) && (
              <button onClick={() => deleteComment(c.id)}
                style={{ fontSize:11, color:'#9DB09A', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                Remover
              </button>
            )}
          </div>
        </div>
      </div>
      {(c.replies ?? []).map(r => renderComment(r, true))}
    </div>
  )

  const inp = { width:'100%', background:'transparent', border:'none', outline:'none', fontSize:14, color:'#2F4A3B', fontFamily:"'Lato',sans-serif" }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:150, display:'flex', alignItems:'flex-end', background:'rgba(47,74,59,0.4)' }}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width:'100%', maxWidth:480, margin:'0 auto', background:'#FAF7F2', borderRadius:'24px 24px 0 0', maxHeight:'80vh', display:'flex', flexDirection:'column', boxShadow:'0 -8px 40px rgba(47,74,59,0.2)' }}>
        {/* Header */}
        <div style={{ padding:'16px 20px 12px', borderBottom:'1px solid #F0E4DC', flexShrink:0 }}>
          <div style={{ width:40, height:4, background:'#DDD5C5', borderRadius:100, margin:'0 auto 14px' }} />
          <div style={{ fontSize:16, fontWeight:600, color:'#2F4A3B' }}>Comentários</div>
        </div>

        {/* Comments list */}
        <div style={{ flex:1, overflowY:'auto', padding:'12px 16px' }}>
          {loading ? (
            <div style={{ textAlign:'center', padding:30, color:'#6B7F63', fontSize:13 }}>Carregando…</div>
          ) : comments.length === 0 ? (
            <div style={{ textAlign:'center', padding:30, color:'#9DB09A', fontSize:13 }}>Seja a primeira a comentar 🌿</div>
          ) : (
            comments.map(c => renderComment(c))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding:'10px 14px 20px', borderTop:'1px solid #F0E4DC', flexShrink:0 }}>
          {replyTo && (
            <div style={{ fontSize:11, color:'#6B7F63', marginBottom:6, display:'flex', alignItems:'center', gap:6 }}>
              <span>↩ Respondendo {replyTo.author?.nome?.split(' ')[0] ?? 'comentário'}</span>
              <button onClick={() => { setReplyTo(null); setText('') }} style={{ fontSize:11, color:'#2F4A3B', background:'none', border:'none', cursor:'pointer', padding:0 }}>✕</button>
            </div>
          )}
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <Avatar name={me.nome} size={32} josi={me.is_admin} />
            <div style={{ flex:1, background:'#F3E9DC', borderRadius:100, padding:'9px 14px', display:'flex', alignItems:'center' }}>
              <input value={text} onChange={e => setText(e.target.value)} placeholder="Adicionar comentário…"
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                style={inp} />
            </div>
            <button onClick={send} disabled={sending || !text.trim()}
              style={{ width:36, height:36, borderRadius:'50%', background: text.trim() ? '#2F4A3B' : '#D4E3D8', border:'none', cursor: text.trim() ? 'pointer' : 'default', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 150ms' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={text.trim() ? '#FAF7F2' : '#2F4A3B'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Post Card ─────────────────────────────────────────────────────────────────
function PostCard({ post, me, onLike, onCommentOpen, onDelete, onEdit }: {
  post: Post; me: Profile
  onLike: () => void; onCommentOpen: () => void
  onDelete: () => void; onEdit: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isOwn  = post.user_id === me.id
  const isAdmin = me.is_admin
  const showMenu = isOwn || isAdmin

  const TIPO_BG: Record<string, string> = {
    resultado: '#D6E4CE', motivacao: '#D4E3D8', pergunta: '#D0E4F0',
    receita: '#F0E8CC', dica: '#E4D6F0',
  }
  const TIPO_COL: Record<string, string> = {
    resultado: '#3A5A42', motivacao: '#7A3A2A', pergunta: '#2A4A6A',
    receita: '#6A4A1A', dica: '#4A2A6A',
  }

  return (
    <div style={{
      background: '#FAF7F2', borderRadius: 20, padding: 16,
      boxShadow: post.is_pinned ? '0 4px 20px rgba(212,169,106,0.25)' : '0 2px 8px rgba(47,74,59,0.08)',
      border: post.is_pinned ? '1.5px solid #C49A5A' : '1.5px solid transparent',
      position: 'relative',
    }}>
      {post.is_pinned && (
        <div style={{ fontSize:10, fontWeight:700, color:'#7A5020', marginBottom:8 }}>📌 Fixado pela Josi</div>
      )}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
        <Avatar name={post.author?.nome} josi={post.author?.is_admin} />
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:14, fontWeight:600, color:'#2F4A3B' }}>{post.author?.nome ?? 'Usuária'}</span>
            {post.author?.is_admin && (
              <span style={{ fontSize:9, background:'linear-gradient(90deg,#2F4A3B,#C49A5A)', color:'#FAF7F2', borderRadius:100, padding:'2px 7px', fontWeight:700 }}>CRIADORA</span>
            )}
          </div>
          <div style={{ fontSize:11, color:'#6B7F63', marginTop:1 }}>{timeAgo(post.created_at)}</div>
        </div>
        <span style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:100, background: TIPO_BG[post.tipo] ?? '#F3E9DC', color: TIPO_COL[post.tipo] ?? '#6B7F63' }}>
          {TIPO_LABELS[post.tipo] ?? post.tipo}
        </span>
        {showMenu && (
          <div style={{ position:'relative' }}>
            <button onClick={() => setMenuOpen(m => !m)}
              style={{ width:28, height:28, borderRadius:'50%', background:'#F3E9DC', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'#6B7F63' }}>
              ···
            </button>
            {menuOpen && (
              <div style={{ position:'absolute', right:0, top:34, background:'#FAF7F2', borderRadius:14, boxShadow:'0 4px 20px rgba(47,74,59,0.18)', zIndex:50, minWidth:130, overflow:'hidden' }}>
                {isOwn && (
                  <button onClick={() => { onEdit(); setMenuOpen(false) }}
                    style={{ width:'100%', padding:'10px 14px', textAlign:'left', border:'none', background:'none', cursor:'pointer', fontSize:13, color:'#2F4A3B', fontFamily:"'Lato',sans-serif" }}>
                    ✏️ Editar
                  </button>
                )}
                <button onClick={() => { onDelete(); setMenuOpen(false) }}
                  style={{ width:'100%', padding:'10px 14px', textAlign:'left', border:'none', background:'none', cursor:'pointer', fontSize:13, color:'#A06858', fontFamily:"'Lato',sans-serif" }}>
                  🗑 Excluir
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ fontSize:14, color:'#2F4A3B', lineHeight:1.65, marginBottom:10, whiteSpace:'pre-wrap' }}>
        {post.conteudo}
      </div>

      {/* Media */}
      {post.foto_url && (
        <img src={post.foto_url} alt="" style={{ width:'100%', borderRadius:14, maxHeight:320, objectFit:'cover', marginBottom:10 }} />
      )}
      {post.video_url && (
        <video src={post.video_url} controls style={{ width:'100%', borderRadius:14, maxHeight:320, marginBottom:10 }} />
      )}

      {/* Actions */}
      <div style={{ display:'flex', gap:18, paddingTop:10, borderTop:'1px solid #F0E4DC' }}>
        <button onClick={onLike} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <svg width="17" height="17" viewBox="0 0 24 24"
            fill={post.i_liked ? '#2F4A3B' : 'none'}
            stroke={post.i_liked ? '#2F4A3B' : '#9DB09A'}
            strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span style={{ fontSize:12, color: post.i_liked ? '#2F4A3B' : '#6B7F63', fontWeight: post.i_liked ? 600 : 400 }}>
            {post.likes_count}
          </span>
        </button>
        <button onClick={onCommentOpen} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9DB09A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span style={{ fontSize:12, color:'#6B7F63' }}>{post.comments_count ?? 0}</span>
        </button>
      </div>
    </div>
  )
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function CommunityScreen() {
  const supabase = createClient()
  const [me, setMe]               = useState<Profile | null>(null)
  const [posts, setPosts]         = useState<Post[]>([])
  const [loading, setLoading]     = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [commentPost, setCommentPost] = useState<Post | null>(null)

  // Load current user
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('id,nome,is_admin').eq('id', user.id).single()
      if (data) setMe(data as Profile)
    }
    init()
  }, [])

  // Load posts
  const loadPosts = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const uid = user?.id

    const { data } = await supabase
      .from('community_posts')
      .select('*, author:profiles!user_id(id,nome,is_admin)')
      .eq('is_deleted', false)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50)

    if (!data) { setLoading(false); return }

    // Fetch comment counts
    const ids = data.map((p: Post) => p.id)
    const { data: commentCounts } = await supabase
      .from('post_comments')
      .select('post_id')
      .in('post_id', ids)
      .eq('is_deleted', false)

    const countMap: Record<string, number> = {}
    ;(commentCounts ?? []).forEach((r: { post_id: string }) => {
      countMap[r.post_id] = (countMap[r.post_id] ?? 0) + 1
    })

    // Fetch my likes
    let likedSet = new Set<string>()
    if (uid) {
      const { data: likes } = await supabase.from('post_likes').select('post_id').eq('user_id', uid)
      likedSet = new Set((likes ?? []).map((l: { post_id: string }) => l.post_id))
    }

    const enriched: Post[] = data.map((p: Post) => ({
      ...p,
      author: Array.isArray(p.author) ? p.author[0] : p.author,
      comments_count: countMap[p.id] ?? 0,
      i_liked: likedSet.has(p.id),
    }))

    setPosts(enriched)
    setLoading(false)
  }, [])

  useEffect(() => { loadPosts() }, [loadPosts])

  const toggleLike = async (post: Post) => {
    if (!me) return
    const optimistic = posts.map(p =>
      p.id === post.id ? { ...p, i_liked: !p.i_liked, likes_count: p.i_liked ? p.likes_count - 1 : p.likes_count + 1 } : p
    )
    setPosts(optimistic)
    if (post.i_liked) {
      await supabase.from('post_likes').delete().match({ user_id: me.id, post_id: post.id })
    } else {
      await supabase.from('post_likes').insert({ user_id: me.id, post_id: post.id })
    }
  }

  const deletePost = async (post: Post) => {
    if (!confirm('Excluir este post?')) return
    await supabase.from('community_posts').update({ is_deleted: true }).eq('id', post.id)
    setPosts(prev => prev.filter(p => p.id !== post.id))
  }

  const handleCreated = (p: Post) => {
    setPosts(prev => [p, ...prev])
  }

  const handleUpdated = (p: Post) => {
    setPosts(prev => prev.map(x => x.id === p.id ? { ...x, conteudo: p.conteudo, tipo: p.tipo } : x))
    setEditingPost(null)
  }

  if (!me) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'#F3E9DC' }}>
      <div style={{ color:'#6B7F63', fontSize:13 }}>Carregando…</div>
    </div>
  )

  return (
    <div style={{ flex:1, overflowY:'auto', background:'#F3E9DC' }}>
      {/* Hero header */}
      <div style={{ background:'#2F4A3B', padding:'20px 22px 18px', position:'sticky', top:0, zIndex:10, overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-30, top:-30, width:130, height:130, borderRadius:'50%', background:'rgba(196,154,90,0.07)', pointerEvents:'none' }} />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, position:'relative', zIndex:1 }}>
          <div style={{ fontSize:11, color:'#C49A5A', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:600 }}>Sua tribo</div>
          <a href="/perfil" style={{ textDecoration:'none', width:30, height:30, borderRadius:'50%', background:'rgba(250,247,242,0.10)', border:'1px solid rgba(196,154,90,0.35)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(196,154,90,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </a>
        </div>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:20, fontWeight:600, color:'#FAF7F2', position:'relative', zIndex:1 }}>Comunidade</div>
      </div>

      {/* Compose bar */}
      <div style={{ padding:'12px 20px', background:'#FAF7F2', borderBottom:'1px solid #EBE0CF' }}>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <Avatar name={me.nome} size={36} josi={me.is_admin} />
          <div onClick={() => setShowCreate(true)}
            style={{ flex:1, background:'#F3E9DC', borderRadius:100, padding:'10px 16px', fontSize:13, color:'#9DB09A', cursor:'pointer' }}>
            Compartilhe seu progresso hoje...
          </div>
          <div onClick={() => setShowCreate(true)}
            style={{ width:36, height:36, borderRadius:'50%', background:'#2F4A3B', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAF7F2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div style={{ padding:'12px 20px', display:'flex', flexDirection:'column', gap:12 }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:40, color:'#6B7F63', fontSize:13 }}>Carregando…</div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 20px' }}>
            <div style={{ fontSize:36, marginBottom:12 }}>🌿</div>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:18, color:'#2F4A3B', marginBottom:8 }}>Nenhum post ainda</div>
            <div style={{ fontSize:13, color:'#6B7F63', marginBottom:20 }}>Seja a primeira a compartilhar!</div>
            <button onClick={() => setShowCreate(true)}
              style={{ background:'#2F4A3B', borderRadius:100, padding:'10px 24px', color:'#FAF7F2', fontSize:14, fontWeight:600, border:'none', cursor:'pointer', fontFamily:"'Lato',sans-serif" }}>
              + Criar post
            </button>
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              me={me}
              onLike={() => toggleLike(post)}
              onCommentOpen={() => setCommentPost(post)}
              onDelete={() => deletePost(post)}
              onEdit={() => setEditingPost(post)}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <CreatePostModal me={me} onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      )}
      {editingPost && (
        <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} onUpdated={handleUpdated} />
      )}
      {commentPost && (
        <CommentsPanel
          post={commentPost}
          me={me}
          onClose={() => setCommentPost(null)}
          onCommentCountChange={n =>
            setPosts(prev => prev.map(p => p.id === commentPost.id ? { ...p, comments_count: n } : p))
          }
        />
      )}
    </div>
  )
}
