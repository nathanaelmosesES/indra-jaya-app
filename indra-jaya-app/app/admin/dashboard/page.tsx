import type { Metadata } from 'next'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'
import { requireUser } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const user = await requireUser()

  return (
    <AdminShell user={user} currentPage="dashboard">
      <h1 className="admin-page__title">Halo, {user.username}</h1>
      <p className="admin-page__sub">
        Pengelolaan produk dari panel ini sedang disiapkan.
      </p>

      {user.role === 'developer' && (
        <section className="admin-panel">
          <h2>Akun internal</h2>
          <p>Buat akun owner dan staff satu per satu sebelum dipakai tim.</p>
          <Link href="/admin/users" className="admin-btn">
            Kelola akun
          </Link>
        </section>
      )}
    </AdminShell>
  )
}
