import type { Metadata } from 'next'
import AdminShell from '@/components/AdminShell'
import { requireOwner } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import TransactionList from '@/components/TransactionList'
import TransactionCreateForm from '@/components/TransactionCreateForm'
import type { ProductOption } from '@/app/admin/opname/page'

export const metadata: Metadata = {
  title: 'Transaksi',
  robots: { index: false, follow: false },
}

const PAGE_SIZE = 20
const dateFormat = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeZone: 'Asia/Jakarta' })
const idrFormat = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })

export type TransactionItemRow = {
  id: string
  product_id: string
  jumlah: number
  harga_satuan: number
  products: { id: string; name: string; code: string } | null
}

export type TransactionRow = {
  id: string
  tanggal: string
  jenis: 'masuk' | 'keluar'
  keterangan: string | null
  notes: string | null
  created_at: string
  transaction_items: TransactionItemRow[]
}

type SearchParams = { page?: string }

export default async function TransactionsPage(props: { searchParams: Promise<SearchParams> }) {
  const user = await requireOwner()
  const { page: pageParam } = await props.searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const supabase = getSupabaseAdmin()

  const [countResult, trxResult, productsResult] = await Promise.all([
    supabase.from('transactions').select('id', { count: 'exact', head: true }),
    supabase
      .from('transactions')
      .select(
        'id, tanggal, jenis, keterangan, notes, created_at, transaction_items(id, product_id, jumlah, harga_satuan, products(id, name, code))',
      )
      .order('tanggal', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1),
    supabase
      .from('products')
      .select('id, name, code, stock')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
  ])

  const total = countResult.count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <AdminShell user={user} currentPage="transactions">
      <div className="trx-header">
        <div>
          <h1 className="admin-page__title">Transaksi</h1>
          <p className="admin-page__sub">Catat barang masuk dan keluar. Stok otomatis diperbarui.</p>
        </div>
        {!productsResult.error && (
          <TransactionCreateForm products={productsResult.data as ProductOption[] ?? []} />
        )}
      </div>

      {trxResult.error ? (
        <p className="admin-note admin-note--error" role="alert">Data transaksi gagal dimuat.</p>
      ) : (
        <TransactionList
          rows={trxResult.data as unknown as TransactionRow[] ?? []}
          page={page}
          totalPages={totalPages}
          total={total}
          dateFormat={dateFormat}
          idrFormat={idrFormat}
        />
      )}
    </AdminShell>
  )
}
