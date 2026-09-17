'use server'

import { revalidatePath } from 'next/cache'
import { requireOwner } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export type TransactionActionState = { error?: string; success?: string } | undefined

const TRANSACTIONS_PAGE = '/admin/transactions'

function readText(formData: FormData, field: string): string {
  return String(formData.get(field) ?? '').trim()
}
function readInt(formData: FormData, field: string): number {
  return parseInt(String(formData.get(field) ?? '0'), 10) || 0
}

export type TransactionItem = {
  product_id: string
  jumlah: number
  harga_satuan: number
}

export async function createTransaction(
  _prev: TransactionActionState,
  formData: FormData,
): Promise<TransactionActionState> {
  const user = await requireOwner()

  const tanggal = readText(formData, 'tanggal')
  const jenis = readText(formData, 'jenis')
  const keterangan = readText(formData, 'keterangan') || null
  const notes = readText(formData, 'notes') || null
  const itemsRaw = readText(formData, 'items')

  if (!tanggal) return { error: 'Tanggal wajib diisi.' }
  if (jenis !== 'masuk' && jenis !== 'keluar') return { error: 'Jenis transaksi tidak valid.' }

  let items: TransactionItem[] = []
  try {
    items = JSON.parse(itemsRaw)
  } catch {
    return { error: 'Data item tidak valid.' }
  }

  if (!items.length) return { error: 'Tambahkan minimal satu item.' }

  for (const item of items) {
    if (!item.product_id) return { error: 'Pilih produk untuk setiap item.' }
    if (!item.jumlah || item.jumlah <= 0) return { error: 'Jumlah setiap item harus lebih dari 0.' }
    if (item.harga_satuan < 0) return { error: 'Harga satuan tidak boleh negatif.' }
  }

  const supabase = getSupabaseAdmin()
  const { data: trx, error: trxError } = await supabase
    .from('transactions')
    .insert({
      tanggal,
      jenis,
      keterangan,
      notes,
      created_by: user.id === 'developer' ? null : user.id,
    })
    .select('id')
    .single()

  if (trxError || !trx) {
    console.error('createTransaction', trxError)
    return { error: 'Gagal membuat transaksi. Coba lagi.' }
  }

  const { error: itemsError } = await supabase.from('transaction_items').insert(
    items.map((item) => ({
      transaction_id: trx.id,
      product_id: item.product_id,
      jumlah: item.jumlah,
      harga_satuan: item.harga_satuan,
    })),
  )

  if (itemsError) {
    await supabase.from('transactions').delete().eq('id', trx.id)
    console.error('createTransaction items', itemsError)
    return { error: 'Gagal menyimpan item transaksi. Coba lagi.' }
  }

  revalidatePath(TRANSACTIONS_PAGE)
  revalidatePath('/admin/products')
  return { success: `Transaksi ${jenis} berhasil dicatat.` }
}

export async function deleteTransaction(
  _prev: TransactionActionState,
  formData: FormData,
): Promise<TransactionActionState> {
  await requireOwner()

  const id = readText(formData, 'id')
  if (!id) return { error: 'Transaksi tidak ditemukan.' }

  const { error } = await getSupabaseAdmin().from('transactions').delete().eq('id', id)
  if (error) {
    console.error('deleteTransaction', error)
    return { error: 'Gagal menghapus transaksi.' }
  }

  revalidatePath(TRANSACTIONS_PAGE)
  revalidatePath('/admin/products')
  return undefined
}
