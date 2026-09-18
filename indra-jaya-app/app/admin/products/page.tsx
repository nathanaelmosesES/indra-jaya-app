import type { Metadata } from 'next'
import AdminShell from '@/components/AdminShell'
import { requireOwner } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import ProductsTable from '@/components/ProductsTable'

export const metadata: Metadata = {
  title: 'Produk',
  robots: { index: false, follow: false },
}

const idrFormat = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })

export type Product = {
  id: string
  code: string
  name: string
  stock: number
  price_current: number
  price_original: number | null
  is_active: boolean
  sort_order: number
  updated_at: string
}

export default async function ProductsPage() {
  const user = await requireOwner()

  const { data: products, error } = await getSupabaseAdmin()
    .from('products')
    .select('id, code, name, stock, price_current, price_original, is_active, sort_order, updated_at')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  return (
    <AdminShell user={user} currentPage="products">
      <h1 className="admin-page__title">Produk</h1>
      <p className="admin-page__sub">Kelola daftar produk dan stok SUMATO.</p>

      {error ? (
        <p className="admin-note admin-note--error" role="alert">
          Daftar produk gagal dimuat. Muat ulang halaman ini.
        </p>
      ) : (
        <ProductsTable products={products ?? []} idrFormat={idrFormat} />
      )}
    </AdminShell>
  )
}
