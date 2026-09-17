alter table public.products
  add column if not exists stock int not null default 0;

alter table public.products
  add constraint products_stock_nonneg check (stock >= 0);
