'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { deleteOpname, type OpnameActionState } from '@/app/admin/opname/actions'
import type { OpnameRow } from '@/app/admin/opname/page'

type Props = { rows: OpnameRow[]; dateFormat: Intl.DateTimeFormat }

function DeleteBtn() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="admin-btn admin-btn--danger admin-btn--sm" disabled={pending} aria-disabled={pending}>
      {pending ? 'Menghapus...' : 'Hapus'}
    </button>
  )
}

function DeleteForm({ row }: { row: OpnameRow }) {
  const [confirm, setConfirm] = useState(false)
  const [state, action] = useActionState<OpnameActionState, FormData>(deleteOpname, undefined)

  if (!confirm) {
    return (
      <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setConfirm(true)}>
        Hapus
      </button>
    )
  }

  return (
    <div className="admin-confirm">
      <span className="admin-confirm__text">Hapus catatan opname ini?</span>
      <div className="admin-confirm__actions">
        <form action={action}>
          <input type="hidden" name="id" value={row.id} />
          <DeleteBtn />
        </form>
        <button className="admin-btn admin-btn--ghost" onClick={() => setConfirm(false)}>Batal</button>
      </div>
      {state?.error && <p className="admin-note admin-note--error" role="alert">{state.error}</p>}
    </div>
  )
}

export default function OpnameList({ rows, dateFormat }: Props) {
  return (
    <div className="opname-scroll">
      <table className="opname-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Produk</th>
            <th>Stok sistem</th>
            <th>Stok terhitung</th>
            <th>Selisih</th>
            <th>Catatan</th>
            <th aria-label="Aksi"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="opname-tr">
              <td className="opname-td--date">
                {dateFormat.format(new Date(row.tanggal + 'T00:00:00'))}
              </td>
              <td className="opname-td--product">
                <strong>{row.products?.name ?? '-'}</strong>
                <small>{row.products?.code}</small>
              </td>
              <td className="opname-td--num">{row.stock_sistem}</td>
              <td className="opname-td--num">{row.stock_terhitung}</td>
              <td className="opname-td--selisih">
                <span className={`selisih-badge selisih-badge--${row.selisih > 0 ? 'plus' : row.selisih < 0 ? 'minus' : 'zero'}`}>
                  {row.selisih > 0 ? '+' : ''}{row.selisih}
                </span>
              </td>
              <td className="opname-td--notes">{row.notes ?? '-'}</td>
              <td className="opname-td--actions">
                <DeleteForm row={row} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
