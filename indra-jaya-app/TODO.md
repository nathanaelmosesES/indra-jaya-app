# TODO

## 1. Migrasi Supabase (project `feacfxvayhykrboapfyt`)

Status: CLI sudah login + link, dry-run sukses (1 migrasi + seed). Tinggal push.

- [ ] Push migrasi + seed (di PowerShell, folder `indra-jaya-app/`), ketik `Y` saat diminta:
      ```powershell
      bunx supabase db push --include-seed
      ```
- [ ] Hapus baris `DATABASE_PASSWORD` dari `.env` (tidak dipakai CLI; CLI login lewat akun Supabase).
- [ ] Cek tabel terbaca publik, harus keluar 4 produk:
      Dashboard > Table Editor > `products`, atau buka
      `https://feacfxvayhykrboapfyt.supabase.co/rest/v1/products?select=code` dengan header `apikey`.

## 1b. Akun internal (developer, owner, staff)

- [x] Isi `SUPABASE_SECRET_KEY` di `.env` (Dashboard > Project Settings > API keys > Secret key, `sb_secret_...`).
      Di Vercel, isi juga `DEV_ADMIN_USERNAME`, `DEV_ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, `SUPABASE_SECRET_KEY`.
- [x] Push migrasi `internal_users`: `bunx supabase db push`
- [ ] Untuk prod, ganti password developer: `bunx create-password <password-baru>`, tempel ke `DEV_ADMIN_PASSWORD_HASH`.
- [ ] Login di `/admin` sebagai `developer`, buka "Akun internal", buat owner lalu staff.

## 2. Akun admin (Supabase Auth, TIDAK dipakai lagi)

Login sekarang memakai tabel `internal_users` + akun developer dari `.env`, jadi langkah di bawah bisa dilewati.


- [ ] Buat user: Dashboard > Authentication > Users > Add user (email + password).
- [ ] Jadikan admin lewat SQL Editor:
      ```sql
      update auth.users
      set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
      where email = 'email-kamu@contoh.com';
      ```
      Kalau sudah terlanjur login, logout lalu login lagi supaya token memuat role baru.
- [ ] (Opsional) Matikan signup publik: Authentication > Sign In / Providers > "Allow new users to sign up".
      Tidak wajib, karena hak tulis sudah dibatasi ke `role = admin`.

## 3. Gambar produk

- [ ] Upload ke Storage, bucket `product-images`, nama file harus sama dengan `image_path` di seed:
      `sm-05.webp`, `sm-08.webp`, `sm-10.webp`, `sm-40.webp` (ambil dari `public/assets/`).

## 4. Sambungkan aplikasi ke Supabase

- [ ] Ganti data produk hard-coded di `components/Landing.tsx` dengan data dari tabel `products`
      (hanya `is_active = true`, urut `sort_order`; gambar dari URL publik bucket `product-images`).
- [ ] Update bagian "Status saat ini" di `AGENTS.md` dan "Catatan" di `README.md`
      (migrasi sudah ditulis dan di-push; keputusan: specs kolom tetap, gambar via Storage).

## 5. Deploy (Vercel)

- [ ] Isi Environment Variables di Vercel: `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
