import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AdminLogin from '../../components/AdminLogin'
import { getCurrentUser } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Masuk',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  if (await getCurrentUser()) redirect('/admin/dashboard')
  return <AdminLogin />
}
