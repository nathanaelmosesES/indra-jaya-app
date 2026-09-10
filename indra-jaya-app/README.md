# Indra Jaya Kenari Mas

Landing page + admin untuk **SUMATO Smart Fire Extinguisher**, dibangun dengan **Next.js (App Router)** dan Supabase. Dirancang untuk SEO (HTML server-rendered) dan penggunaan di HP.

## Stack

- Next.js 16 (App Router, komponen server + client)
- React 19
- CSS biasa dengan design token (lihat `app/globals.css`)
- Supabase (`lib/supabase.ts`), belum dipakai UI

## Menjalankan

```bash
bun install
cp .env.example .env.local   # isi kredensial Supabase (publishable key)
bun run dev                  # http://localhost:3000
```

Script: `bun run dev`, `bun run build`, `bun run start`.

## Struktur

```
app/
  layout.tsx      root layout + metadata SEO (title, description, Open Graph)
  page.tsx        landing (SSG) -> <Landing/>
  admin/page.tsx  login /admin (noindex) -> <AdminLogin/>
  globals.css     design token + base
components/
  Landing.tsx     landing (client: scroll-reveal), Landing.css
  AdminLogin.tsx  login UI (auth belum dipasang), admin.css
lib/              supabase + helper db/storage, useReveal
public/assets/    gambar produk (webp)
```

## Deploy

Target: **Vercel** (native Next). Kedua route saat ini prerender statis.

## Catatan

- Autentikasi admin belum diaktifkan (login page masih UI). Titik sambung ada di `components/AdminLogin.tsx` (`TODO(auth)`).
- Data produk masih hard-coded di `components/Landing.tsx`; rencana dipindah ke tabel `products` Supabase.
