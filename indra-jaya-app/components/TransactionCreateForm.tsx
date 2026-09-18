'use client'

import { useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createTransaction, type TransactionActionState } from '@/app/admin/transactions/actions'
import type { ProductOption } from '@/app/admin/opname/page'

type Props = { products: ProductOption[] }

type ItemState = { product_id: string; jumlah: number; harga_satuan: number }

function today() {
  return new Date().toISOString().slice(0, 10)
}

function SubmitBtn() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="admin-submit" disabled={pending} aria-disabled={pending}>
      {pending ? 'Menyimpan...' : 'Simpan transaksi'}
    </button>
  )
}

function emptyItem(): ItemState {
  return { product_id: '', jumlah: 1, harga_satuan: 0 }
}

export default function TransactionCreateForm({ products }: Props) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<ItemState[]>([emptyItem()])
  const [state, action] = useActionState<TransactionActionState, FormData>(createTransaction, undefined)

  function addItem() {
    setItems((prev) => [...prev, emptyItem()])
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateItem(idx: number, patch: Partial<ItemState>) {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, ...patch } : item)))
  }

  async function handleSubmit(formData: FormData) {
    formData.set('items', JSON.stringify(items))
    await action(formData)
  }

  if (!open) {
    return (
      <button className="admin-btn" onClick={() => setOpen(true)}>
        + Transaksi baru
      </button>
    )
  }

  const total = items.reduce((sum, i) => sum + i.jumlah * i.harga_satuan, 0)
  const idrFmt = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })

  return (
    <div className="trx-form-wrap">
      <div className="trx-form-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="trx-form-panel" role="dialog" aria-modal="true" aria-label="Transaksi baru">
        <div className="trx-form-head">
          <h2>Transaksi baru</h2>
          <button className="admin-btn admin-btn--ghost admin-btn--icon" onClick={() => setOpen(false)} aria-label="Tutup">
            &times;
          </button>
        </div>

        <form
          action={async (fd) => {
            await handleSubmit(fd)
            if (!state?.error) {
              setOpen(false)
              setItems([emptyItem()])
            }
          }}
          className="admin-form"
        >
          <div className="trx-form-row">
            <label className="admin-field">
              <span className="admin-field__label">Tanggal</span>
              <input type="date" name="tanggal" defaultValue={today()} required max={today()} inputMode="none" />
            </label>

            <fieldset className="admin-choice">
              <legend className="admin-field__label">Jenis transaksi</legend>
              <div className="admin-choice__options">
                <label className="admin-choice__option">
                  <input type="radio" name="jenis" value="masuk" defaultChecked required />
                  <div className="admin-choice__text"><strong>Masuk</strong><small>Stok bertambah</small></div>
                </label>
                <label className="admin-choice__option">
                  <input type="radio" name="jenis" value="keluar" />
                  <div className="admin-choice__text"><strong>Keluar</strong><small>Stok berkurang</small></div>
                </label>
              </div>
            </fieldset>
          </div>

          <label className="admin-field">
            <span className="admin-field__label">Keterangan (opsional)</span>
            <input type="text" name="keterangan" placeholder="Misal: dari supplier PT XYZ, order #123..." maxLength={255} />
          </label>

          <label className="admin-field">
            <span className="admin-field__label">Catatan (opsional)</span>
            <input type="text" name="notes" placeholder="Catatan tambahan..." maxLength={255} />
          </label>

          <div className="trx-items">
            <div className="trx-items-head">
              <span className="admin-field__label">Item</span>
              <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={addItem}>
                + Tambah item
              </button>
            </div>

            {items.map((item, idx) => (
              <div key={idx} className="trx-item-row">
                <div className="trx-item-fields">
                  <label className="admin-field">
                    <span className="admin-field__label">Produk</span>
                    <select
                      className="admin-select"
                      value={item.product_id}
                      onChange={(e) => updateItem(idx, { product_id: e.target.value })}
                      required
                    >
                      <option value="">Pilih produk...</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.code}) - Stok: {p.stock}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="admin-field trx-item-jumlah">
                    <span className="admin-field__label">Jumlah</span>
                    <input
                      type="number"
                      min="1"
                      value={item.jumlah}
                      onChange={(e) => updateItem(idx, { jumlah: parseInt(e.target.value) || 1 })}
                      required
                      inputMode="numeric"
                    />
                  </label>

                  <label className="admin-field trx-item-harga">
                    <span className="admin-field__label">Harga satuan (Rp)</span>
                    <input
                      type="number"
                      min="0"
                      value={item.harga_satuan}
                      onChange={(e) => updateItem(idx, { harga_satuan: parseInt(e.target.value) || 0 })}
                      inputMode="numeric"
                    />
                  </label>
                </div>

                <div className="trx-item-meta">
                  <span className="trx-item-subtotal">
                    {idrFmt.format(item.jumlah * item.harga_satuan)}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      onClick={() => removeItem(idx)}
                      aria-label="Hapus item ini"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="trx-total">
              Total: <strong>{idrFmt.format(total)}</strong>
            </div>
          </div>

          {state?.error && (
            <p className="admin-note admin-note--error" role="alert">{state.error}</p>
          )}

          <SubmitBtn />
        </form>
      </div>
    </div>
  )
}
