import { createClient } from '@supabase/supabase-js'

/**
 * Client com service_role — ignora RLS completamente.
 * Use APENAS em Server Components/Route Handlers do painel admin.
 * NUNCA exponha a service role key no cliente (browser).
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
