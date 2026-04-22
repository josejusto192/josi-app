import { createAdminClient } from '@/lib/supabase/admin'
import AdminComunidadeClient from './AdminComunidadeClient'

export default async function AdminComunidadePage() {
  const db = createAdminClient()

  const { data: posts } = await db
    .from('community_posts')
    .select('*, author:profiles(id,nome)')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(200)

  const { data: comments } = await db
    .from('post_comments')
    .select('id,post_id,is_deleted')

  const commentCountMap: Record<string, number> = {}
  ;(comments ?? []).forEach((c: { id: string; post_id: string; is_deleted: boolean }) => {
    if (!c.is_deleted) commentCountMap[c.post_id] = (commentCountMap[c.post_id] ?? 0) + 1
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enriched = (posts ?? []).map((p: any) => ({
    ...p,
    author: Array.isArray(p.author) ? p.author[0] : p.author,
    comments_count: commentCountMap[p.id as string] ?? 0,
  }))

  return <AdminComunidadeClient initialPosts={enriched} />
}

export const dynamic = 'force-dynamic'
