'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { login } from '@/app/admin/actions'
import './admin.css'

function AdminLogin() {
  const [state, formAction, pending] = useActionState(login, undefined)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="admin-auth">
      <aside className="admin-auth__brand">
        <Link href="/" className="admin-brand" aria-label="Indra Jaya, ke beranda">
          <span className="admin-brand__mark" aria-hidden="true">IJ</span>
          <span className="admin-brand__text">
            Indra Jaya<em>Kenari Mas</em>
          </span>
        </Link>
        <div className="admin-auth__pitch">
          <h1>Panel Admin</h1>
          <p>
            Kelola produk yang tampil di halaman: harga, spesifikasi, urutan,
            dan status tampil. Satu tempat untuk seluruh etalase SUMATO.
          </p>
        </div>
        <p className="admin-auth__foot">Akses internal Indra Jaya Kenari Mas</p>
      </aside>

      <main className="admin-auth__panel">
        <div className="admin-card">
          <span className="admin-card__tag">Internal</span>
          <h2 className="admin-card__title">Masuk ke Dashboard</h2>
          <p className="admin-card__sub">
            Gunakan akun yang dibuatkan developer.
          </p>

          <form className="admin-form" action={formAction}>
            <label className="admin-field">
              <span className="admin-field__label">Username</span>
              <input
                type="text"
                name="username"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
              />
            </label>

            <label className="admin-field">
              <span className="admin-field__label">Kata sandi</span>
              <div className="admin-field__wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="admin-field__toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
            </label>

            <button type="submit" className="admin-submit" disabled={pending}>
              {pending ? 'Memeriksa...' : 'Masuk'}
            </button>

            {state?.error && (
              <p className="admin-note admin-note--error" role="alert">
                {state.error}
              </p>
            )}
          </form>
        </div>

        <Link href="/" className="admin-back">
          ← Kembali ke halaman utama
        </Link>
      </main>
    </div>
  )
}

export default AdminLogin
