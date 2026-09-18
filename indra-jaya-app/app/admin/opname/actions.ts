'use server'

import { revalidatePath } from 'next/cache'
import { requireOwner } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export type OpnameActionState = { error?: string; success?: string } | undefined

const OPNAME_PAGE = '/admin/opname'

function readInt(formData: FormData, field: string): number {
  return parseInt(String(formData.get(field) ?? '0'), 10) || 0
}
function readText(formData: FormData, field: string): string {
  return String(formData.get(field) ?? '').trim()
}

export async function createOpname(
  _prev: OpnameActionState,
  formData: FormData,
): Promise<OpnameActionState> {
  const user = await requireOwner()

  const product_id = readText(formData, 'product_id')
  const tanggal = readText(formData, 'tanggal')
  const stock_terhitung = readInt(formData, 'stock_terhitung')
  const notes = readText(formData, 'notes') || null

  if (!product_id) return { error: 'Pilih produk.' }
  if (!tanggal) return { error: 'Tanggal wajib diisi.' }
  if (stock_terhitung < 0) return { error: 'Stok terhitung tidak boleh negatif.' }

  const supabase = getSupabaseAdmin()
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('stock, name')
    .eq('id', product_id)
    .maybeSingle()

  if (productError || !product) return { error: 'Produk tidak ditemukan.' }

  const { error } = await supabase.from('opname').insert({
    product_id,
    tanggal,
    stock_sistem: product.stock,
    stock_terhitung,
    notes,
    created_by: user.id === 'developer' ? null : user.id,
  })

  if (error) {
    console.error('createOpname', error)
    return { error: 'Gagal menyimpan opname. Coba lagi.' }
  }

  revalidatePath(OPNAME_PAGE)
  revalidatePath('/admin/products')
  return { success: `Opname ${product.name} berhasil dicatat.` }
}

export async function deleteOpname(
  _prev: OpnameActionState,
  formData: FormData,
): Promise<OpnameActionState> {
  await requireOwner()

  const id = readText(formData, 'id')
  if (!id) return { error: 'Data tidak ditemukan.' }

  const { error } = await getSupabaseAdmin().from('opname').delete().eq('id', id)
  if (error) {
    console.error('deleteOpname', error)
    return { error: 'Gagal menghapus.' }
  }

  revalidatePath(OPNAME_PAGE)
  return undefined
}
