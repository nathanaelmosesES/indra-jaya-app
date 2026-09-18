'use client'

import { useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { deleteTransaction, type TransactionActionState } from '@/app/admin/transactions/actions'
import type { TransactionRow } from '@/app/admin/transactions/page'

type Props = {
  rows: TransactionRow[]
  page: number
  totalPages: number
  total: number
  dateFormat: Intl.DateTimeFormat
  idrFormat: Intl.NumberFormat
}

function DeleteBtn() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="admin-btn admin-btn--danger admin-btn--sm" disabled={pending} aria-disabled={pending}>
      {pending ? '...' : 'Hapus'}
    </button>
  )
}

function DeleteForm({ id }: { id: string }) {
  const [confirm, setConfirm] = useState(false)
  const [state, action] = useActionState<TransactionActionState, FormData>(deleteTransaction, undefined)

  if (!confirm) {
    return (
      <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setConfirm(true)}>
        Hapus
      </button>
    )
  }

  return (
    <div className="admin-confirm trx-confirm">
      <span className="admin-confirm__text">Hapus transaksi ini? Stok akan dibalikkan.</span>
      <div className="admin-confirm__actions">
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <DeleteBtn />
        </form>
        <button className="admin-btn admin-btn--ghost" onClick={() => setConfirm(false)}>Batal</button>
      </div>
      {state?.error && <p className="admin-note admin-note--error" role="alert">{state.error}</p>}
    </div>
  )
}

export default function TransactionList({ rows, page, totalPages, total, dateFormat, idrFormat }: Props) {
  return (
    <div className="trx-list">
      {!rows.length ? (
        <p className="admin-empty">Belum ada transaksi.</p>
      ) : (
        <>
          <div className="trx-scroll">
            <table className="trx-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Jenis</th>
                  <th>Keterangan</th>
                  <th>Item</th>
                  <th>Total</th>
                  <th aria-label="Aksi"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const rowTotal = row.transaction_items.reduce(
                    (sum, i) => sum + i.jumlah * i.harga_satuan,
                    0,
                  )
                  return (
                    <tr key={row.id} className="trx-tr">
                      <td className="trx-td--date">
                        {dateFormat.format(new Date(row.tanggal + 'T00:00:00'))}
                      </td>
                      <td>
                        <span className={`jenis-badge jenis-badge--${row.jenis}`}>
                          {row.jenis === 'masuk' ? 'Masuk' : 'Keluar'}
                        </span>
                      </td>
                      <td className="trx-td--ket">{row.keterangan ?? '-'}</td>
                      <td className="trx-td--items">
                        <ul className="trx-items-list">
                          {row.transaction_items.map((item) => (
                            <li key={item.id}>
                              <strong>{item.products?.name ?? '-'}</strong>
                              {' '}x{item.jumlah}
                              {item.harga_satuan > 0 && (
                                <span className="trx-item-price"> @ {idrFormat.format(item.harga_satuan)}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="trx-td--total">
                        {rowTotal > 0 ? idrFormat.format(rowTotal) : '-'}
                      </td>
                      <td className="trx-td--actions">
                        <DeleteForm id={row.id} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav className="trx-pagination" aria-label="Halaman transaksi">
              <span className="trx-pag-info">
                {total} transaksi · halaman {page}/{totalPages}
              </span>
              <div className="trx-pag-btns">
                {page > 1 && (
                  <Link href={`?page=${page - 1}`} className="admin-btn admin-btn--ghost admin-btn--sm">
                    Sebelumnya
                  </Link>
                )}
                {page < totalPages && (
                  <Link href={`?page=${page + 1}`} className="admin-btn admin-btn--sm">
                    Berikutnya
                  </Link>
                )}
              </div>
            </nav>
          )}
        </>
      )}
    </div>
  )
}
