-- Seed produk SUMATO (dari data hard-coded di components/Landing.tsx).
-- image_path memakai nama file yang sama dengan public/assets/*.webp,
-- jadi tinggal di-upload ke bucket product-images dengan key yang sama.
-- Idempotent: on conflict (code) do update.

insert into public.products
  (code, name, slug, price_original, price_current,
   capacity, coverage, life, composition,
   image_path, featured, is_active, sort_order)
values
  ('SM-05', 'SUMATO SM-05', 'sumato-sm-05', 1058000, 899999,
   '500 gram', '1 m³', '3 tahun', 'Powder & Aerosol',
   'sm-05.webp', true, true, 1),

  ('SM-08', 'SUMATO SM-08', 'sumato-sm-08', 628000, 489999,
   '800 ml', '1 m²', '3 tahun', 'Foam',
   'sm-08.webp', false, true, 2),

  ('SM-10', 'SUMATO SM-10', 'sumato-sm-10', 728000, 569999,
   '1 liter', '2 m²', '3 tahun', 'Foam',
   'sm-10.webp', false, true, 3),

  ('SM-40', 'SUMATO SM-40', 'sumato-sm-40', 1358000, 1099000,
   '4 liter', '7 m²', '3 tahun', 'Foam',
   'sm-40.webp', false, true, 4)
on conflict (code) do update set
  name           = excluded.name,
  slug           = excluded.slug,
  price_original = excluded.price_original,
  price_current  = excluded.price_current,
  capacity       = excluded.capacity,
  coverage       = excluded.coverage,
  life           = excluded.life,
  composition    = excluded.composition,
  image_path     = excluded.image_path,
  featured       = excluded.featured,
  is_active      = excluded.is_active,
  sort_order     = excluded.sort_order;
