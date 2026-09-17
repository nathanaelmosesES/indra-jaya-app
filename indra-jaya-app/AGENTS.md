# Indra Jaya Kenari Mas · agent guide

Landing page + admin untuk **SUMATO Smart Fire Extinguisher** (distributor Indra Jaya
Kenari Mas, Jakarta). Fokus: SEO dan penggunaan di HP.

## Stack (PENTING, jangan keliru)

Ini **Next.js 16 (App Router)** + React 19 + Supabase. **Bukan Vite**, bukan
react-router. Kalau ada dokumen/ingatan lama yang menyebut Vite/react-router, itu
usang. Package manager: **bun**. Dev: `bun run dev` (aku jalankan di port 5199),
build: `bun run build`, start: `bun run start`.

## Struktur

```
app/layout.tsx      metadata SEO (title/description/OG), lang="id", viewport export
app/page.tsx        landing (server) -> render <Landing/> (SSG)
app/admin/page.tsx  /admin login (dynamic, noindex); redirect ke dashboard bila sudah login
app/admin/actions.ts      server actions: login, logout, buat/hapus akun internal
app/admin/dashboard, app/admin/users   halaman setelah login (users khusus developer)
app/globals.css     design token + base (masih @import Google Fonts)
components/Landing.tsx    'use client', semua section + scroll-reveal; Landing.css
components/AdminLogin.tsx 'use client', login username+password; admin.css
components/AdminShell.tsx, CreateUserForm.tsx   kerangka admin + form akun
lib/                supabase (env NEXT_PUBLIC_*), database, storage, useReveal
lib/auth.ts, session.ts, supabase-admin.ts      auth internal (server-only)
scripts/create-password/  hash scrypt; `bunx create-password <pw>` (devDependency file:)
public/assets/      gambar produk .webp, dirujuk via string URL (bukan import)
```

## Aturan yang HARUS dijaga

- **JANGAN pakai em-dash (—) di mana pun**: copy, balasan chat, komentar kode.
  Ganti dengan koma/titik/"dan"/"serta" atau middle dot (·). Cek: grep `—` di
  `app`, `components`, `lib`. (Ini permintaan tegas pemilik.)
- **JANGAN menambah comment di kode, sama sekali** (termasuk JSDoc, comment
  SQL/CSS, dan penjelasan di `.env`). Kode harus bisa dipahami tanpa comment:
  nama variabel/fungsi yang jelas, konstanta bernama untuk angka dan string
  ajaib, fungsi kecil dengan satu tugas. Penjelasan setup ditaruh di
  `README.md`/`TODO.md`, bukan di kode. (Permintaan tegas pemilik.)
- **Anti-"AI slop"**: arah desain "clean editorial light". Satu anchor warna
  merah SUMATO `#d81e22` (hemat, hanya untuk bahaya/harga/CTA), netral off-white
  hangat + near-black, whitespace lega, hierarki tipografi kuat. Motion hanya
  reveal-on-scroll halus + satu float hero; hormati `prefers-reduced-motion`.
  Setiap perubahan landing harus bisa dipertanggungjawabkan terhadap aturan ini.
- **Mobile-first dan UI/UX best practice di setiap layar** (app ini paling sering
  dibuka di HP). Minimum: layout mulai dari 360px tanpa scroll horizontal; input
  font-size >= 16px (cegah auto-zoom iOS) dan tinggi >= 48px; target sentuh >= 44px;
  label terlihat (bukan placeholder); hint + error per field (`aria-invalid`,
  `aria-describedby`), fokus ke field salah pertama; nilai form tidak hilang saat
  error; state loading/disabled/sukses/kosong; aksi berbahaya pakai konfirmasi;
  password baru selalu dengan konfirmasi + tombol tampilkan; `autocomplete`,
  `enterkeyhint`, `inputmode` yang tepat; `focus-visible` jelas; hormati
  `prefers-reduced-motion`. Validasi yang sama dipakai di client dan server.
  Cek di lebar HP (390px) dan desktop sebelum dianggap selesai.
- **Copy Bahasa Indonesia**, jujur (tanpa lorem/typo).
- **CTA WhatsApp** ke `628118998098` (tampil `+62 811-8998-098`).

## Status saat ini

- **Auth admin: custom, bukan Supabase Auth.** Akun developer dari `.env`
  (`DEV_ADMIN_USERNAME`, `DEV_ADMIN_PASSWORD_HASH`), owner/staff di tabel
  `internal_users` (hanya diakses server lewat `SUPABASE_SECRET_KEY`). Sesi =
  cookie HMAC (`ADMIN_SESSION_SECRET`). Hanya developer yang membuat akun.
- **Data produk masih hard-coded** di `components/Landing.tsx`. Tabel `products`
  sudah ada di Supabase (specs kolom tetap, gambar di bucket `product-images`).
- **Deploy target: Vercel.** `/` statis, route `/admin/*` dinamis.

## Verifikasi (browser remote tak bisa akses localhost-ku)

Screenshot pakai Chrome lokal. Untuk cek mobile/responsif yang andal, pakai
puppeteer-core (`bun add -d puppeteer-core`, hapus lagi setelah selesai): set
viewport + `waitUntil:'networkidle0'`, cek `document.documentElement.scrollWidth`
untuk overflow. `chrome --headless --window-size --screenshot` salah render lebar
mobile, jadi jangan dipakai untuk audit responsif.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
