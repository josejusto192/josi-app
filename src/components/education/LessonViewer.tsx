'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type LessonFull = {
  id: string; titulo: string; descricao: string | null; tipo: string
  conteudo: string | null; video_url: string | null; imagem_url: string | null
  duracao_min: number | null; is_premium: boolean
}

// ── YouTube embed ─────────────────────────────────────────────────────────────
function getYouTubeId(url: string | null) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|v=|\/embed\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

// ── Markdown renderer (minimal) ───────────────────────────────────────────────
function MarkdownContent({ text }: { text: string }) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // H1
    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} style={{ fontFamily:"'Cinzel',serif", fontSize:20, fontWeight:600, color:'#2F4A3B', margin:'20px 0 10px', lineHeight:1.3 }}>{line.slice(2)}</h1>)
    }
    // H2
    else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} style={{ fontFamily:"'Cinzel',serif", fontSize:17, fontWeight:600, color:'#2F4A3B', margin:'18px 0 8px', lineHeight:1.3 }}>{line.slice(3)}</h2>)
    }
    // H3
    else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} style={{ fontSize:15, fontWeight:600, color:'#2F4A3B', margin:'14px 0 6px' }}>{line.slice(4)}</h3>)
    }
    // Blockquote
    else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} style={{ borderLeft:'3px solid #2F4A3B', paddingLeft:14, margin:'12px 0', color:'#6B7F63', fontStyle:'italic', fontSize:14, lineHeight:1.6 }}>
          {line.slice(2)}
        </blockquote>
      )
    }
    // Code block
    else if (line.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++ }
      elements.push(
        <pre key={i} style={{ background:'#F0E4DC', borderRadius:10, padding:'12px 14px', fontSize:12, overflowX:'auto', margin:'10px 0', color:'#2F4A3B', lineHeight:1.6 }}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
    }
    // Table (simple)
    else if (line.startsWith('|')) {
      const tableLines: string[] = [line]
      i++
      while (i < lines.length && lines[i].startsWith('|')) { tableLines.push(lines[i]); i++ }
      const rows = tableLines.filter(r => !r.match(/^\|[-| ]+\|$/))
      elements.push(
        <div key={i} style={{ overflowX:'auto', margin:'12px 0' }}>
          <table style={{ borderCollapse:'collapse', width:'100%', fontSize:13 }}>
            {rows.map((row, ri) => (
              <tr key={ri} style={{ background: ri === 0 ? '#D4E3D8' : ri % 2 === 0 ? '#F3E9DC' : '#FAF7F2' }}>
                {row.split('|').filter(c => c.trim()).map((cell, ci) => (
                  <td key={ci} style={{ padding:'8px 12px', color:'#2F4A3B', fontWeight: ri === 0 ? 600 : 400, borderBottom:'1px solid #DDD5C5' }}>{cell.trim()}</td>
                ))}
              </tr>
            ))}
          </table>
        </div>
      )
      continue
    }
    // Bullet list
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [line.slice(2)]
      while (i + 1 < lines.length && (lines[i+1].startsWith('- ') || lines[i+1].startsWith('* '))) {
        i++; items.push(lines[i].slice(2))
      }
      elements.push(
        <ul key={i} style={{ paddingLeft:18, margin:'8px 0', display:'flex', flexDirection:'column', gap:4 }}>
          {items.map((item, ii) => <li key={ii} style={{ fontSize:14, color:'#2F4A3B', lineHeight:1.6 }} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />)}
        </ul>
      )
    }
    // Numbered list
    else if (/^\d+\. /.test(line)) {
      const items: string[] = [line.replace(/^\d+\. /, '')]
      while (i + 1 < lines.length && /^\d+\. /.test(lines[i+1])) {
        i++; items.push(lines[i].replace(/^\d+\. /, ''))
      }
      elements.push(
        <ol key={i} style={{ paddingLeft:20, margin:'8px 0', display:'flex', flexDirection:'column', gap:4 }}>
          {items.map((item, ii) => <li key={ii} style={{ fontSize:14, color:'#2F4A3B', lineHeight:1.6 }} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />)}
        </ol>
      )
    }
    // Horizontal rule
    else if (line.match(/^---+$/)) {
      elements.push(<hr key={i} style={{ border:'none', borderTop:'1px solid #DDD5C5', margin:'16px 0' }} />)
    }
    // Empty line
    else if (line.trim() === '') {
      elements.push(<div key={i} style={{ height: 8 }} />)
    }
    // Paragraph
    else {
      elements.push(
        <p key={i} style={{ fontSize:14, color:'#2F4A3B', lineHeight:1.7, margin:'4px 0' }} dangerouslySetInnerHTML={{ __html: parseInline(line) }} />
      )
    }
    i++
  }
  return <div>{elements}</div>
}

function parseInline(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:#D4E3D8;padding:1px 5px;border-radius:4px;font-size:0.9em">$1</code>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
}

// ── Main Viewer ───────────────────────────────────────────────────────────────
export default function LessonViewer({ lessonId, onBack, onComplete, isCompleted, courseGradient }: {
  lessonId: string
  onBack: () => void
  onComplete: () => void
  isCompleted: boolean
  courseGradient: string
}) {
  const [lesson, setLesson]   = useState<LessonFull | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('lessons').select('*').eq('id', lessonId).single().then(({ data }) => {
      if (data) setLesson(data as LessonFull)
      setLoading(false)
    })
  }, [lessonId])

  if (loading) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'#F3E9DC' }}>
      <div style={{ color:'#6B7F63', fontSize:13 }}>Carregando aula…</div>
    </div>
  )

  if (!lesson) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'#F3E9DC' }}>
      <div style={{ color:'#6B7F63', fontSize:13 }}>Aula não encontrada.</div>
    </div>
  )

  const ytId = lesson.tipo === 'video' ? getYouTubeId(lesson.video_url) : null

  return (
    <div style={{ flex:1, overflowY:'auto', background:'#F3E9DC' }}>
      {/* Top bar */}
      <div style={{ background: courseGradient, padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={onBack}
          style={{ width:34, height:34, borderRadius:'50%', background:'rgba(0,0,0,0.2)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAF7F2" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{ flex:1, fontFamily:"'Cinzel',serif", fontSize:16, fontWeight:600, color:'#FAF7F2', lineHeight:1.2 }}>{lesson.titulo}</div>
        {isCompleted && <span style={{ fontSize:18 }}>✅</span>}
      </div>

      {/* Content */}
      <div style={{ padding: '0 0 32px' }}>

        {/* VIDEO */}
        {lesson.tipo === 'video' && (
          <div style={{ background:'#1A1A1A' }}>
            {ytId ? (
              <div style={{ position:'relative', paddingTop:'56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                  style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div style={{ height:200, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)', fontSize:13 }}>
                Vídeo não disponível
              </div>
            )}
          </div>
        )}

        {/* IMAGEM */}
        {lesson.tipo === 'imagem' && lesson.imagem_url && (
          <img src={lesson.imagem_url} alt={lesson.titulo} style={{ width:'100%', maxHeight:400, objectFit:'cover' }} />
        )}

        {/* Title + meta */}
        <div style={{ padding:'18px 20px 0' }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:20, fontWeight:600, color:'#2F4A3B', marginBottom:6, lineHeight:1.3 }}>{lesson.titulo}</div>
          <div style={{ display:'flex', gap:10, marginBottom: lesson.descricao ? 12 : 0 }}>
            {lesson.duracao_min && (
              <span style={{ fontSize:11, color:'#6B7F63', background:'#D4E3D8', borderRadius:100, padding:'2px 10px' }}>
                ⏱ {lesson.duracao_min}min
              </span>
            )}
            {lesson.is_premium && (
              <span style={{ fontSize:11, color:'#7A5020', background:'#F5E6CE', borderRadius:100, padding:'2px 10px', fontWeight:600 }}>
                ✦ Premium
              </span>
            )}
          </div>
          {lesson.descricao && (
            <div style={{ fontSize:13, color:'#6B7F63', lineHeight:1.65, marginBottom:4 }}>{lesson.descricao}</div>
          )}
        </div>

        {/* TEXT / MARKDOWN */}
        {(lesson.tipo === 'texto' || lesson.tipo === 'markdown') && lesson.conteudo && (
          <div style={{ padding:'16px 20px 0' }}>
            <div style={{ background:'#FAF7F2', borderRadius:18, padding:'18px 18px', boxShadow:'0 2px 8px rgba(47,74,59,0.07)' }}>
              {lesson.tipo === 'markdown' ? (
                <MarkdownContent text={lesson.conteudo} />
              ) : (
                <div style={{ fontSize:14, color:'#2F4A3B', lineHeight:1.75, whiteSpace:'pre-wrap' }}>{lesson.conteudo}</div>
              )}
            </div>
          </div>
        )}

        {/* Complete button */}
        <div style={{ padding:'24px 20px 0' }}>
          {isCompleted ? (
            <div style={{ background:'#D6E4CE', borderRadius:100, padding:'14px', textAlign:'center', fontSize:15, fontWeight:600, color:'#3A5A42' }}>
              ✓ Aula concluída!
            </div>
          ) : (
            <button onClick={onComplete}
              style={{ width:'100%', background: courseGradient, border:'none', borderRadius:100, padding:'14px', fontSize:15, fontWeight:600, color:'#FAF7F2', fontFamily:"'Lato',sans-serif", cursor:'pointer', boxShadow:'0 4px 16px rgba(47,74,59,0.3)' }}>
              Marcar como concluída ✓
            </button>
          )}
          <button onClick={onBack}
            style={{ width:'100%', background:'none', border:'none', marginTop:12, fontSize:13, color:'#6B7F63', cursor:'pointer' }}>
            ← Voltar para o curso
          </button>
        </div>
      </div>
    </div>
  )
}
