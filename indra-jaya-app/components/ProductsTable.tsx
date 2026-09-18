'use client'

import React, { useState, useActionState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { updateProduct, updateProductStock, type ProductActionState } from '@/app/admin/products/actions'
import type { Product } from '@/app/admin/products/page'

type Props = { products: Product[]; idrFormat: Intl.NumberFormat }

function SaveBtn({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="admin-btn" disabled={pending} aria-disabled={pending}>
      {pending ? 'Menyimpan...' : label}
    </button>
  )
}

function StockQuickForm({ product }: { product: Product }) {
  const [state, action] = useActionState<ProductActionState, FormData>(updateProductStock, undefined)
  const [editing, setEditing] = useState(false)

  if (!editing) {
    return (
      <button
        className="stock-badge"
        onClick={() => setEditing(true)}
        title="Klik untuk ubah stok"
        aria-label={`Stok ${product.name}: ${product.stock}. Klik untuk ubah.`}
      >
        {product.stock}
      </button>
    )
  }

  return (
    <form action={async (fd) => { await action(fd); setEditing(false) }} className="stock-edit-form">
      <input type="hidden" name="id" value={product.id} />
      <input type="hidden" name="name" value={product.name} />
      <input
        type="number"
        name="stock"
        defaultValue={product.stock}
        min="0"
        required
        className="stock-edit-input"
        autoFocus
        aria-label="Stok baru"
        onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
      />
      <SaveBtn label="OK" />
      <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setEditing(false)}>Batal</button>
      {state?.error && <span className="admin-field__error stock-edit-err">{state.error}</span>}
    </form>
  )
}

function EditRow({ product, idrFormat, onClose }: { product: Product; idrFormat: Intl.NumberFormat; onClose: () => void }) {
  const [state, action] = useActionState<ProductActionState, FormData>(updateProduct, undefined)

  return (
    <tr className="products-tr products-tr--edit" aria-label={`Edit ${product.name}`}>
      <td colSpan={6}>
        <form action={action} className="product-edit-form">
          <input type="hidden" name="id" value={product.id} />
          <div className="product-edit-grid">
            <label className="admin-field">
              <span className="admin-field__label">Kode</span>
              <input name="code" defaultValue={product.code} required minLength={1} maxLength={32} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Nama produk</span>
              <input name="name" defaultValue={product.name} required minLength={1} maxLength={128} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Stok</span>
              <input name="stock" type="number" defaultValue={product.stock} min="0" required />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Harga jual (Rp)</span>
              <input name="price_current" type="number" defaultValue={product.price_current} min="0" required />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Harga coret (Rp, kosong = tidak ada)</span>
              <input name="price_original" type="number" defaultValue={product.price_original ?? ''} min="0" />
            </label>
            <fieldset className="admin-choice">
              <legend className="admin-field__label">Status</legend>
              <div className="admin-choice__options">
                <label className="admin-choice__option">
                  <input type="radio" name="is_active" value="true" defaultChecked={product.is_active} />
                  <div className="admin-choice__text"><strong>Aktif</strong><small>Tampil di landing</small></div>
                </label>
                <label className="admin-choice__option">
                  <input type="radio" name="is_active" value="false" defaultChecked={!product.is_active} />
                  <div className="admin-choice__text"><strong>Nonaktif</strong><small>Tersembunyi</small></div>
                </label>
              </div>
            </fieldset>
          </div>
          {state?.error && <p className="admin-note admin-note--error" role="alert">{state.error}</p>}
          {state?.success && <p className="admin-note admin-note--success" role="status">{state.success}</p>}
          <div className="product-edit-actions">
            <SaveBtn label="Simpan perubahan" />
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>Batal</button>
          </div>
        </form>
      </td>
    </tr>
  )
}

export default function ProductsTable({ products, idrFormat }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  if (!products.length) {
    return <p className="admin-empty">Belum ada produk. Tambahkan lewat migrasi atau Supabase dashboard.</p>
  }

  return (
    <div className="products-wrap">
      <div className="products-scroll">
        <table className="products-table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama produk</th>
              <th>Stok</th>
              <th>Harga jual</th>
              <th>Status</th>
              <th aria-label="Aksi"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <React.Fragment key={p.id}>
                <tr className={`products-tr${editingId === p.id ? ' products-tr--active' : ''}`}>
                  <td className="products-td--code">{p.code}</td>
                  <td className="products-td--name">{p.name}</td>
                  <td className="products-td--stock">
                    <StockQuickForm product={p} />
                  </td>
                  <td className="products-td--price">
                    {idrFormat.format(p.price_current)}
                    {p.price_original ? (
                      <s className="products-price-original">{idrFormat.format(p.price_original)}</s>
                    ) : null}
                  </td>
                  <td>
                    <span className={`admin-status admin-status--${p.is_active ? 'active' : 'inactive'}`}>
                      {p.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="products-td--actions">
                    <button
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => startTransition(() => setEditingId(editingId === p.id ? null : p.id))}
                      aria-expanded={editingId === p.id}
                      aria-controls={`edit-${p.id}`}
                    >
                      {editingId === p.id ? 'Tutup' : 'Edit'}
                    </button>
                  </td>
                </tr>
                {editingId === p.id && (
                  <EditRow
                    product={p}
                    idrFormat={idrFormat}
                    onClose={() => setEditingId(null)}
                  />
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
