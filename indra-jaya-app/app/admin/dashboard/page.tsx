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
  const canManageInventory = user.role === 'developer' || user.role === 'owner'

  return (
    <AdminShell user={user} currentPage="dashboard">
      <h1 className="admin-page__title">Halo, {user.username}</h1>
      <p className="admin-page__sub">
        Selamat datang di panel admin Indra Jaya Kenari Mas.
      </p>

      {canManageInventory && (
        <div className="admin-grid admin-grid--dashboard">
          <section className="admin-panel">
            <h2>Produk</h2>
            <p>Lihat dan ubah stok, harga, serta status produk SUMATO.</p>
            <Link href="/admin/products" className="admin-btn">
              Kelola produk
            </Link>
          </section>

          <section className="admin-panel">
            <h2>Stock Opname</h2>
            <p>Catat penghitungan fisik stok dan sinkronkan dengan sistem.</p>
            <Link href="/admin/opname" className="admin-btn">
              Catat opname
            </Link>
          </section>

          <section className="admin-panel">
            <h2>Transaksi</h2>
            <p>Rekam barang masuk dan keluar. Stok otomatis diperbarui.</p>
            <Link href="/admin/transactions" className="admin-btn">
              Lihat transaksi
            </Link>
          </section>
        </div>
      )}

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
