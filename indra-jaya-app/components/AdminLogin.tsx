'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import './admin.css'

/**
 * Admin login, tampilan saja.
 *
 * Autentikasi belum diaktifkan (sesuai permintaan). Submit sengaja tidak
 * memanggil Supabase Auth apa pun; ia hanya menampilkan catatan bahwa auth
 * masih tahap berikutnya. Tempat menyambungkan auth ditandai dengan TODO.
 */
function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO(auth): sambungkan ke Supabase Auth (signInWithPassword) di sini.
  }

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
          <span className="admin-card__tag">Pratinjau</span>
          <h2 className="admin-card__title">Masuk ke Dashboard</h2>
          <p className="admin-card__sub">
            Gunakan akun admin untuk mengelola produk.
          </p>

          <form className="admin-form" onSubmit={handleSubmit} noValidate>
            <label className="admin-field">
              <span className="admin-field__label">Email</span>
              <input
                type="email"
                name="email"
                autoComplete="username"
                placeholder="admin@indrajaya.co.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="admin-field">
              <span className="admin-field__label">Kata sandi</span>
              <div className="admin-field__wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button type="submit" className="admin-submit">
              Masuk
            </button>

            <p className="admin-note" role="status">
              Autentikasi belum diaktifkan. Halaman ini masih tahap tampilan;
              login akan berfungsi setelah auth dipasang.
            </p>
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
