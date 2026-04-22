'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const CATEGORIAS = ['plano','ebook','consultoria','suplemento','roupa','acessorio']

type Form = {
  nome: string; descricao: string; preco: string; preco_original: string
  foto_url: string; categoria: string; estoque: string
  is_active: boolean; destaque: boolean
}
const EMPTY: Form = { nome: '', descricao: '', preco: '', preco_original: '', foto_url: '', categoria: 'plano', estoque: '', is_active: true, destaque: false }

export default function EditProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [id, setId]       = useState('')
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState<Form>(EMPTY)

  const supabase = createClient()

  useEffect(() => {
    params.then(async p => {
      setId(p.id); const novo = p.id === 'novo'; setIsNew(novo)
      if (!novo) {
        const { data } = await supabase.from('products').select('*').eq('id', p.id).single()
        if (data) setForm({ nome: data.nome ?? '', descricao: data.descricao ?? '', preco: data.preco?.toString() ?? '', preco_original: data.preco_original?.toString() ?? '', foto_url: data.foto_url ?? '', categoria: data.categoria ?? 'plano', estoque: data.estoque?.toString() ?? '', is_active: data.is_active ?? true, destaque: data.destaque ?? false })
      }
      setLoading(false)
    })
  }, [])

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

  const save = async () => {
    if (!form.nome.trim() || !form.preco) return
    setSaving(true)
    const payload = { nome: form.nome, descricao: form.descricao || null, preco: parseFloat(form.preco), preco_original: form.preco_original ? parseFloat(form.preco_original) : null, foto_url: form.foto_url || null, categoria: form.categoria, estoque: form.estoque ? parseInt(form.estoque) : null, is_active: form.is_active, destaque: form.destaque }
    if (isNew) { await supabase.from('products').insert(payload) }
    else { await supabase.from('products').update(payload).eq('id', id) }
    setSaving(false); setSaved(true)
    setTimeout(() => { setSaved(false); if (isNew) router.push('/admin/loja') }, 1500)
  }

  const del = async () => {
    if (!confirm('Remover este produto?')) return
    setDeleting(true)
    await supabase.from('products').delete().eq('id', id)
    router.push('/admin/loja')
  }

  const discount = form.preco && form.preco_original
    ? Math.round((1 - parseFloat(form.preco) / parseFloat(form.preco_original)) * 100)
    : null

  const inp: React.CSSProperties = { width: '100%', background: '#F5EDE3', border: '1.5px solid #E8D8CC', borderRadius: 12, padding: '11px 14px', fontSize: 14, color: '#4A2E22', fontFamily: "'DM Sans',sans-serif", outline: 'none', boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: '#8A6A5A', display: 'block', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }

  if (loading) return <div style={{ color: '#8A6A5A', padding: 20 }}>Carregando…</div>

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => router.push('/admin/loja')} style={{ background: '#F0D5C8', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9826B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 600, color: '#4A2E22' }}>{isNew ? 'Novo produto' : 'Editar produto'}</div>
          <div style={{ fontSize: 12, color: '#8A6A5A' }}>{isNew ? 'Plano, ebook, consultoria ou produto físico' : form.nome}</div>
        </div>
      </div>

      <div style={{ background: '#FDF8F3', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(74,46,34,0.10)' }}>

        <div style={{ marginBottom: 18 }}>
          <label style={lbl}>Nome do produto *</label>
          <input value={form.nome} onChange={set('nome')} placeholder="ex: Plano Desafio Premium" style={inp} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
          <div>
            <label style={lbl}>Categoria</label>
            <select value={form.categoria} onChange={set('categoria')} style={{ ...inp, cursor: 'pointer' }}>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Estoque (vazio = digital ilimitado)</label>
            <input type="number" value={form.estoque} onChange={set('estoque')} placeholder="ilimitado" min={0} style={inp} />
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={lbl}>Descrição</label>
          <textarea value={form.descricao} onChange={set('descricao')} rows={3} placeholder="O que está incluído, benefícios..." style={{ ...inp, resize: 'vertical' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
          <div>
            <label style={lbl}>Preço (R$) *</label>
            <input type="number" value={form.preco} onChange={set('preco')} placeholder="97.00" min={0} step={0.01} style={inp} />
          </div>
          <div>
            <label style={lbl}>Preço original (para mostrar desconto)</label>
            <input type="number" value={form.preco_original} onChange={set('preco_original')} placeholder="197.00" min={0} step={0.01} style={inp} />
          </div>
        </div>

        {discount !== null && discount > 0 && (
          <div style={{ background: '#D6E4CE', borderRadius: 10, padding: '8px 14px', marginBottom: 18, fontSize: 13, color: '#3A5A42', fontWeight: 600 }}>
            ✓ Desconto de {discount}% vai aparecer no app
          </div>
        )}

        <div style={{ marginBottom: 22 }}>
          <label style={lbl}>URL da foto do produto</label>
          <input value={form.foto_url} onChange={set('foto_url')} placeholder="https://..." style={inp} />
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#F5EDE3', borderRadius: 12, flex: 1 }}>
            <input type="checkbox" id="active" checked={form.is_active} onChange={set('is_active')} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#8A9E7B' }} />
            <label htmlFor="active" style={{ fontSize: 14, color: '#4A2E22', cursor: 'pointer' }}>Produto ativo <span style={{ fontSize: 11, color: '#8A6A5A' }}>(visível na loja)</span></label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#F5EDE3', borderRadius: 12, flex: 1 }}>
            <input type="checkbox" id="dest" checked={form.destaque} onChange={set('destaque')} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#D4A96A' }} />
            <label htmlFor="dest" style={{ fontSize: 14, color: '#4A2E22', cursor: 'pointer' }}>Em destaque <span style={{ fontSize: 11, color: '#8A6A5A' }}>(topo da loja)</span></label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={save} disabled={saving || !form.nome.trim() || !form.preco}
            style={{ flex: 1, border: 'none', borderRadius: 100, padding: '13px 0', fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: saving || !form.nome.trim() || !form.preco ? 'not-allowed' : 'pointer', background: saved ? '#8A9E7B' : saving ? '#D4A96A' : '#C9826B', color: '#FDF8F3', transition: 'background 200ms' }}>
            {saved ? '✓ Salvo!' : saving ? 'Salvando…' : isNew ? 'Criar produto' : 'Salvar alterações'}
          </button>
          {!isNew && (
            <button onClick={del} disabled={deleting} style={{ background: '#F0D5C8', border: 'none', borderRadius: 100, padding: '13px 18px', fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: 'pointer', color: '#A06858' }}>
              {deleting ? '…' : '🗑'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
