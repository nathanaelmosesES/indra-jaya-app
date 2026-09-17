import type { ReactNode } from 'react'
import Link from 'next/link'
import { logout } from '@/app/admin/actions'
import type { CurrentUser } from '@/lib/auth'
import './admin.css'

const ROLE_LABEL: Record<CurrentUser['role'], string> = {
  developer: 'Developer',
  owner: 'Owner',
  staff: 'Staff',
}

type AdminPage = 'dashboard' | 'users' | 'products' | 'opname' | 'transactions'

type AdminShellProps = { user: CurrentUser; currentPage: AdminPage; children: ReactNode }

function AdminShell({ user, currentPage, children }: AdminShellProps) {
  const ariaCurrent = (page: AdminPage) => (page === currentPage ? 'page' : undefined)
  const canManageInventory = user.role === 'developer' || user.role === 'owner'

  return (
    <div className="admin-shell">
      <header className="admin-shell__bar">
        <Link href="/admin/dashboard" className="admin-shell__brand">
          <span className="admin-brand__mark" aria-hidden="true">IJ</span>
          <span>Panel Admin</span>
        </Link>

        <nav className="admin-shell__nav" aria-label="Menu admin">
          <Link href="/admin/dashboard" aria-current={ariaCurrent('dashboard')}>
            Dashboard
          </Link>
          {canManageInventory && (
            <>
              <Link href="/admin/products" aria-current={ariaCurrent('products')}>
                Produk
              </Link>
              <Link href="/admin/opname" aria-current={ariaCurrent('opname')}>
                Opname
              </Link>
              <Link href="/admin/transactions" aria-current={ariaCurrent('transactions')}>
                Transaksi
              </Link>
            </>
          )}
          {user.role === 'developer' && (
            <Link href="/admin/users" aria-current={ariaCurrent('users')}>
              Akun internal
            </Link>
          )}
        </nav>

        <div className="admin-shell__user">
          <span className="admin-shell__who">
            {user.username} · <strong>{ROLE_LABEL[user.role]}</strong>
          </span>
          <form action={logout}>
            <button type="submit" className="admin-btn admin-btn--ghost">
              Keluar
            </button>
          </form>
        </div>
      </header>

      <main className="admin-shell__main">{children}</main>
    </div>
  )
}

export default AdminShell
