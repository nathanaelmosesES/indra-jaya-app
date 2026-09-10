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
app/admin/page.tsx  /admin (server, robots noindex) -> render <AdminLogin/>
app/globals.css     design token + base (masih @import Google Fonts)
components/Landing.tsx    'use client', semua section + scroll-reveal; Landing.css
components/AdminLogin.tsx 'use client', login UI; admin.css; pakai next/link
lib/                supabase (env NEXT_PUBLIC_*), database, storage, useReveal
public/assets/      gambar produk .webp, dirujuk via string URL (bukan import)
```

## Aturan yang HARUS dijaga

- **JANGAN pakai em-dash (—) di mana pun**: copy, balasan chat, komentar kode.
  Ganti dengan koma/titik/"dan"/"serta" atau middle dot (·). Cek: grep `—` di
  `app`, `components`, `lib`. (Ini permintaan tegas pemilik.)
- **Anti-"AI slop"**: arah desain "clean editorial light". Satu anchor warna
  merah SUMATO `#d81e22` (hemat, hanya untuk bahaya/harga/CTA), netral off-white
  hangat + near-black, whitespace lega, hierarki tipografi kuat. Motion hanya
  reveal-on-scroll halus + satu float hero; hormati `prefers-reduced-motion`.
  Setiap perubahan landing harus bisa dipertanggungjawabkan terhadap aturan ini.
- **Copy Bahasa Indonesia**, jujur (tanpa lorem/typo).
- **CTA WhatsApp** ke `628118998098` (tampil `+62 811-8998-098`).

## Status saat ini

- **Auth admin BELUM dipasang** (sengaja). `/admin` masih UI saja; titik sambung
  `TODO(auth)` di `components/AdminLogin.tsx` untuk Supabase `signInWithPassword`.
- **Data produk masih hard-coded** di `components/Landing.tsx`. Rencana pindah ke
  tabel `products` di Supabase (schema sudah dirancang, migration belum ditulis;
  keputusan terbuka: specs jsonb vs kolom, gambar Storage vs URL, kategori dinamis).
- **Deploy target: Vercel** (native Next; kedua route prerender statis).

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
