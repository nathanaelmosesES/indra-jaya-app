import type { Metadata } from 'next'
import AdminShell from '@/components/AdminShell'
import { requireOwner } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import OpnameList from '@/components/OpnameList'
import OpnameCreateForm from '@/components/OpnameCreateForm'

export const metadata: Metadata = {
  title: 'Stock Opname',
  robots: { index: false, follow: false },
}

const dateFormat = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'Asia/Jakarta' })

export type OpnameRow = {
  id: string
  tanggal: string
  stock_sistem: number
  stock_terhitung: number
  selisih: number
  notes: string | null
  created_at: string
  products: { id: string; name: string; code: string } | null
}

export type ProductOption = {
  id: string
  name: string
  code: string
  stock: number
}

export default async function OpnamePage() {
  const user = await requireOwner()
  const supabase = getSupabaseAdmin()

  const [opnameResult, productsResult] = await Promise.all([
    supabase
      .from('opname')
      .select('id, tanggal, stock_sistem, stock_terhitung, selisih, notes, created_at, products(id, name, code)')
      .order('tanggal', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('products')
      .select('id, name, code, stock')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
  ])

  return (
    <AdminShell user={user} currentPage="opname">
      <h1 className="admin-page__title">Stock Opname</h1>
      <p className="admin-page__sub">Catat hasil penghitungan fisik stok. Stok produk otomatis diperbarui.</p>

      <div className="admin-grid admin-grid--opname">
        <section className="admin-panel">
          <h2>Catat opname baru</h2>
          {productsResult.error ? (
            <p className="admin-note admin-note--error" role="alert">Daftar produk gagal dimuat.</p>
          ) : (
            <OpnameCreateForm products={productsResult.data ?? []} />
          )}
        </section>

        <section className="admin-panel">
          <h2>
            Riwayat opname
            {opnameResult.data?.length ? (
              <span className="admin-count">{opnameResult.data.length}</span>
            ) : null}
          </h2>
          {opnameResult.error ? (
            <p className="admin-note admin-note--error" role="alert">Riwayat gagal dimuat. Muat ulang halaman.</p>
          ) : !opnameResult.data?.length ? (
            <p className="admin-empty">Belum ada catatan opname.</p>
          ) : (
            <OpnameList rows={opnameResult.data as unknown as OpnameRow[]} dateFormat={dateFormat} />
          )}
        </section>
      </div>
    </AdminShell>
  )
}
