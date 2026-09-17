create table if not exists public.opname (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.products(id) on delete restrict,
  tanggal      date not null default current_date,
  stock_sistem int not null,
  stock_terhitung int not null,
  selisih      int generated always as (stock_terhitung - stock_sistem) stored,
  notes        text,
  created_by   uuid references public.internal_users(id) on delete set null,
  created_at   timestamptz not null default now(),

  constraint opname_stock_sistem_nonneg check (stock_sistem >= 0),
  constraint opname_stock_terhitung_nonneg check (stock_terhitung >= 0)
);

create index if not exists opname_tanggal_idx
  on public.opname (tanggal desc);

create index if not exists opname_product_idx
  on public.opname (product_id, tanggal desc);

create or replace function public.apply_opname_to_product()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  update public.products
  set stock = NEW.stock_terhitung
  where id = NEW.product_id;
  return NEW;
end;
$$;

drop trigger if exists opname_apply_stock on public.opname;
create trigger opname_apply_stock
  after insert on public.opname
  for each row execute function public.apply_opname_to_product();

alter table public.opname enable row level security;
revoke all on public.opname from anon, authenticated;
