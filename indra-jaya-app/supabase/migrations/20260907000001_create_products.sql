-- Products untuk landing SUMATO (Indra Jaya Kenari Mas)
-- Specs sebagai kolom tetap (semua produk berbagi field yang sama),
-- gambar via Supabase Storage (bucket product-images), harga int rupiah.

-- Extension untuk gen_random_uuid()
create extension if not exists "pgcrypto";

-- --- Tabel -----------------------------------------------------------------

create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  code           text not null unique,          -- mis. "SM-05"
  name           text not null,                 -- mis. "SUMATO SM-05"
  slug           text not null unique,          -- mis. "sumato-sm-05"

  price_original int,                            -- rupiah, nullable (harga coret)
  price_current  int not null,                   -- rupiah

  -- specs (kolom tetap)
  capacity       text,                           -- Kapasitas, mis. "500 gram"
  coverage       text,                           -- Jangkauan, mis. "1 m³"
  life           text,                           -- Masa pakai, mis. "3 tahun"
  composition    text,                           -- Komposisi, mis. "Foam"

  image_path     text,                           -- object key di bucket product-images
  badge          text,                           -- label opsional, mis. "Terlaris"
  featured       boolean not null default false, -- disorot di landing
  is_active      boolean not null default true,
  sort_order     int not null default 0,
  whatsapp_note  text,                           -- catatan tambahan utk pesan WA

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint products_price_current_nonneg check (price_current >= 0),
  constraint products_price_original_nonneg check (price_original is null or price_original >= 0)
);

create index if not exists products_active_sort_idx
  on public.products (is_active, sort_order);

-- --- updated_at otomatis ----------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- --- Row Level Security -----------------------------------------------------

alter table public.products enable row level security;

-- Publik (anon + authenticated) hanya boleh baca produk aktif.
drop policy if exists products_select_active on public.products;
create policy products_select_active
  on public.products
  for select
  using (is_active = true);

-- Admin (siapa pun yang authenticated; hanya pemilik yang punya akun)
-- boleh baca semua + tulis penuh.
drop policy if exists products_admin_all on public.products;
create policy products_admin_all
  on public.products
  for all
  to authenticated
  using (true)
  with check (true);

-- --- Storage: bucket product-images (public read) ---------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Baca publik untuk objek di bucket ini.
drop policy if exists product_images_public_read on storage.objects;
create policy product_images_public_read
  on storage.objects
  for select
  using (bucket_id = 'product-images');

-- Tulis/ubah/hapus hanya untuk authenticated (admin).
drop policy if exists product_images_admin_write on storage.objects;
create policy product_images_admin_write
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists product_images_admin_update on storage.objects;
create policy product_images_admin_update
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

drop policy if exists product_images_admin_delete on storage.objects;
create policy product_images_admin_delete
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'product-images');
