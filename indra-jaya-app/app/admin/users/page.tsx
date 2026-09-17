import type { Metadata } from 'next'
import AdminShell from '@/components/AdminShell'
import CreateUserForm from '@/components/CreateUserForm'
import { requireDeveloper } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import DeleteUserButton from '@/components/DeleteUserButton'

export const metadata: Metadata = {
  title: 'Akun internal',
  robots: { index: false, follow: false },
}

const dateFormat = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeZone: 'Asia/Jakarta' })

export default async function UsersPage() {
  const user = await requireDeveloper()

  const { data: users, error } = await getSupabaseAdmin()
    .from('internal_users')
    .select('id, username, role, created_at')
    .order('created_at', { ascending: true })

  if (error) console.error('UsersPage', error)

  return (
    <AdminShell user={user} currentPage="users">
      <h1 className="admin-page__title">Akun internal</h1>
      <p className="admin-page__sub">
        Owner dan staff masuk dengan username dan kata sandi yang dibuat di sini.
      </p>

      <div className="admin-grid">
        <section className="admin-panel">
          <h2>Tambah akun</h2>
          <CreateUserForm />
        </section>

        <section className="admin-panel">
          <h2>
            Terdaftar{users?.length ? <span className="admin-count">{users.length}</span> : null}
          </h2>
          {error ? (
            <p className="admin-note admin-note--error" role="alert">
              Daftar akun gagal dimuat. Muat ulang halaman ini.
            </p>
          ) : !users?.length ? (
            <p className="admin-empty">Belum ada akun. Mulai dengan membuat akun owner.</p>
          ) : (
            <ul className="admin-list">
              {users.map((u) => (
                <li key={u.id}>
                  <div className="admin-list__info">
                    <strong>{u.username}</strong>
                    <span className={`admin-role admin-role--${u.role}`}>{u.role}</span>
                    <small>Dibuat {dateFormat.format(new Date(u.created_at))}</small>
                  </div>
                  <DeleteUserButton userId={u.id} username={u.username} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  )
}
