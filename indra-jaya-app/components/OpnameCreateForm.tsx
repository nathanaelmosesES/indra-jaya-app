'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createOpname, type OpnameActionState } from '@/app/admin/opname/actions'
import type { ProductOption } from '@/app/admin/opname/page'

type Props = { products: ProductOption[] }

function today() {
  return new Date().toISOString().slice(0, 10)
}

function SubmitBtn() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="admin-submit" disabled={pending} aria-disabled={pending}>
      {pending ? 'Menyimpan...' : 'Catat opname'}
    </button>
  )
}

export default function OpnameCreateForm({ products }: Props) {
  const [state, action] = useActionState<OpnameActionState, FormData>(createOpname, undefined)

  if (!products.length) {
    return <p className="admin-empty">Tidak ada produk aktif.</p>
  }

  return (
    <form action={action} className="admin-form">
      <label className="admin-field">
        <span className="admin-field__label">Produk</span>
        <select
          name="product_id"
          required
          className="admin-select"
          aria-describedby={state?.error ? 'opname-err' : undefined}
        >
          <option value="">Pilih produk...</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.code}) - Stok saat ini: {p.stock}
            </option>
          ))}
        </select>
      </label>

      <label className="admin-field">
        <span className="admin-field__label">Tanggal opname</span>
        <input
          type="date"
          name="tanggal"
          defaultValue={today()}
          required
          max={today()}
          inputMode="none"
        />
      </label>

      <label className="admin-field">
        <span className="admin-field__label">Stok terhitung (hasil hitung fisik)</span>
        <input
          type="number"
          name="stock_terhitung"
          required
          min="0"
          placeholder="0"
          inputMode="numeric"
          aria-describedby={state?.error ? 'opname-err' : undefined}
        />
      </label>

      <label className="admin-field">
        <span className="admin-field__label">Catatan (opsional)</span>
        <input
          type="text"
          name="notes"
          placeholder="Misal: pengecekan bulanan, gudang A..."
          maxLength={255}
        />
      </label>

      {state?.error && (
        <p id="opname-err" className="admin-note admin-note--error" role="alert">{state.error}</p>
      )}
      {state?.success && (
        <p className="admin-note admin-note--success" role="status">{state.success}</p>
      )}

      <SubmitBtn />
    </form>
  )
}
