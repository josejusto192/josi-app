import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

const CAT_ICON: Record<string, string> = {
  plano: '⭐', ebook: '📖', consultoria: '💬', suplemento: '💊', roupa: '👕', acessorio: '🎽',
}

// Produtos mockados para demonstração enquanto não há dados reais
const MOCK_PRODUCTS = [
  { id: 'mock-1', nome: 'Desafio 21 Dias Premium', categoria: 'plano',       preco: 97,  preco_original: 197, is_active: true,  destaque: true,  estoque: null },
  { id: 'mock-2', nome: 'Ebook Receitas Low Carb',  categoria: 'ebook',       preco: 37,  preco_original: null, is_active: true,  destaque: false, estoque: null },
  { id: 'mock-3', nome: 'Consultoria Nutricional',  categoria: 'consultoria', preco: 250, preco_original: null, is_active: true,  destaque: false, estoque: 10   },
  { id: 'mock-4', nome: 'Plano Anual Josi Fit',     categoria: 'plano',       preco: 297, preco_original: 588, is_active: false, destaque: false, estoque: null },
]

export default async function AdminLojaPage() {
  const db = createAdminClient()
  const { data: products } = await db.from('products').select('*').order('created_at', { ascending: false })

  const useReal    = (products ?? []).length > 0
  const items      = useReal ? (products ?? []) : MOCK_PRODUCTS
  const isMock     = !useReal

  const total     = items.length
  const active    = items.filter(p => p.is_active).length
  const featured  = items.filter(p => p.destaque).length
  const revenue   = items.filter(p => p.is_active).reduce((s, p) => s + p.preco, 0)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: isMock ? 12 : 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 600, color: '#4A2E22', margin: '0 0 4px' }}>Loja</h1>
          <p style={{ color: '#8A6A5A', fontSize: 14, margin: 0 }}>Gerencie produtos, planos e ofertas</p>
        </div>
        <Link href="/admin/loja/novo" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#C9826B', borderRadius: 100, padding: '10px 20px', color: '#FDF8F3', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Novo produto</div>
        </Link>
      </div>

      {isMock && (
        <div style={{ background: '#F5E6CE', borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 16 }}>👆</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#7A5020' }}>Produtos de exemplo</div>
            <div style={{ fontSize: 12, color: '#7A5020', opacity: 0.8 }}>Estes são produtos mockados. Clique em "+ Novo produto" para criar os seus produtos reais.</div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total produtos',  value: total,             color: '#C9826B' },
          { label: 'Ativos',          value: active,            color: '#8A9E7B' },
          { label: 'Em destaque',     value: featured,          color: '#D4A96A' },
          { label: 'Soma dos preços', value: `R$ ${revenue}`,   color: '#7A5020' },
        ].map(s => (
          <div key={s.label} style={{ background: '#FDF8F3', borderRadius: 16, padding: '16px 18px', boxShadow: '0 2px 8px rgba(74,46,34,0.08)' }}>
            <div style={{ fontSize: 11, color: '#8A6A5A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: isMock ? 20 : 28, fontWeight: 600, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(product => {
          const discount = product.preco_original
            ? Math.round((1 - product.preco / product.preco_original) * 100)
            : null

          return (
            <Link key={product.id} href={isMock ? '/admin/loja/novo' : `/admin/loja/${product.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#FDF8F3', borderRadius: 16, padding: '16px 20px', boxShadow: '0 2px 8px rgba(74,46,34,0.08)', display: 'flex', alignItems: 'center', gap: 16, opacity: product.is_active ? 1 : 0.55, border: product.destaque ? '2px solid #D4A96A' : '2px solid transparent', cursor: 'pointer' }}>
                {/* Ícone */}
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F0D5C8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {CAT_ICON[product.categoria] ?? '📦'}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#4A2E22' }}>{product.nome}</div>
                    {product.destaque && <span style={{ fontSize: 9, fontWeight: 700, color: '#7A5020', background: '#F5E6CE', padding: '2px 7px', borderRadius: 100 }}>DESTAQUE</span>}
                    {!product.is_active && <span style={{ fontSize: 9, fontWeight: 700, color: '#8A6A5A', background: '#F0E4DC', padding: '2px 7px', borderRadius: 100 }}>INATIVO</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: '#F5EDE3', color: '#8A6A5A' }}>{product.categoria}</span>
                    {product.estoque !== null && <span style={{ fontSize: 11, color: '#8A6A5A' }}>Estoque: {product.estoque}</span>}
                    {!product.estoque && product.estoque !== 0 && <span style={{ fontSize: 11, color: '#8A9E7B' }}>Digital ∞</span>}
                  </div>
                </div>

                {/* Preço */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {product.preco_original && (
                    <div style={{ fontSize: 11, color: '#B89B8C', textDecoration: 'line-through' }}>
                      R$ {product.preco_original}
                    </div>
                  )}
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, color: '#C9826B' }}>
                    R$ {product.preco}
                  </div>
                  {discount && <div style={{ fontSize: 10, color: '#8A9E7B', fontWeight: 600 }}>−{discount}% OFF</div>}
                </div>

                <div style={{ fontSize: 12, color: '#C9826B', flexShrink: 0 }}>
                  {isMock ? 'Criar →' : 'Editar →'}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
