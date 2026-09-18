'use server'

import { revalidatePath } from 'next/cache'
import { requireOwner } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export type ProductActionState = { error?: string; success?: string } | undefined

const PRODUCTS_PAGE = '/admin/products'

function readInt(formData: FormData, field: string): number {
  return parseInt(String(formData.get(field) ?? '0'), 10) || 0
}
function readText(formData: FormData, field: string): string {
  return String(formData.get(field) ?? '').trim()
}

export async function updateProduct(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requireOwner()

  const id = readText(formData, 'id')
  if (!id) return { error: 'Produk tidak ditemukan.' }

  const name = readText(formData, 'name')
  const code = readText(formData, 'code')
  const stock = readInt(formData, 'stock')
  const price_current = readInt(formData, 'price_current')
  const price_original = readInt(formData, 'price_original') || null
  const is_active = formData.get('is_active') === 'true'

  if (!name) return { error: 'Nama produk wajib diisi.' }
  if (!code) return { error: 'Kode produk wajib diisi.' }
  if (stock < 0) return { error: 'Stok tidak boleh negatif.' }
  if (price_current < 0) return { error: 'Harga tidak boleh negatif.' }

  const { error } = await getSupabaseAdmin()
    .from('products')
    .update({ name, code, stock, price_current, price_original, is_active })
    .eq('id', id)

  if (error) {
    console.error('updateProduct', error)
    return { error: 'Gagal menyimpan. Coba lagi.' }
  }

  revalidatePath(PRODUCTS_PAGE)
  return { success: `Produk ${name} berhasil disimpan.` }
}

export async function updateProductStock(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  await requireOwner()

  const id = readText(formData, 'id')
  const stock = readInt(formData, 'stock')
  const name = readText(formData, 'name')

  if (!id) return { error: 'Produk tidak ditemukan.' }
  if (stock < 0) return { error: 'Stok tidak boleh negatif.' }

  const { error } = await getSupabaseAdmin()
    .from('products')
    .update({ stock })
    .eq('id', id)

  if (error) {
    console.error('updateProductStock', error)
    return { error: 'Gagal menyimpan stok.' }
  }

  revalidatePath(PRODUCTS_PAGE)
  return { success: `Stok ${name} diperbarui ke ${stock}.` }
}
