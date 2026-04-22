import { redirect } from 'next/navigation'
export default function AdminPage() { redirect('/admin/dashboard') }
export const dynamic = 'force-dynamic'
