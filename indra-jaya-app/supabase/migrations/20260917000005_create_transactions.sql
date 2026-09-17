create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  tanggal     date not null default current_date,
  jenis       text not null,
  keterangan  text,
  notes       text,
  created_by  uuid references public.internal_users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint transactions_jenis_check check (jenis in ('masuk', 'keluar'))
);

create table if not exists public.transaction_items (
  id             uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  product_id     uuid not null references public.products(id) on delete restrict,
  jumlah         int not null,
  harga_satuan   int not null default 0,
  created_at     timestamptz not null default now(),

  constraint transaction_items_jumlah_pos check (jumlah > 0),
  constraint transaction_items_harga_nonneg check (harga_satuan >= 0)
);

create index if not exists transactions_tanggal_idx
  on public.transactions (tanggal desc, created_at desc);

create index if not exists transactions_jenis_tanggal_idx
  on public.transactions (jenis, tanggal desc);

create index if not exists transaction_items_transaction_idx
  on public.transaction_items (transaction_id);

create index if not exists transaction_items_product_idx
  on public.transaction_items (product_id);

drop trigger if exists transactions_set_updated_at on public.transactions;
create trigger transactions_set_updated_at
  before update on public.transactions
  for each row execute function public.set_updated_at();

create or replace function public.update_stock_from_transaction_item()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_jenis text;
  v_delta int;
begin
  if TG_OP = 'INSERT' then
    select jenis into v_jenis from public.transactions where id = NEW.transaction_id;
    v_delta := case when v_jenis = 'masuk' then NEW.jumlah else -NEW.jumlah end;
    update public.products set stock = stock + v_delta where id = NEW.product_id;
    return NEW;

  elsif TG_OP = 'DELETE' then
    select jenis into v_jenis from public.transactions where id = OLD.transaction_id;
    v_delta := case when v_jenis = 'masuk' then -OLD.jumlah else OLD.jumlah end;
    update public.products set stock = stock + v_delta where id = OLD.product_id;
    return OLD;

  elsif TG_OP = 'UPDATE' then
    select jenis into v_jenis from public.transactions where id = OLD.transaction_id;
    if v_jenis = 'masuk' then
      v_delta := NEW.jumlah - OLD.jumlah;
    else
      v_delta := OLD.jumlah - NEW.jumlah;
    end if;
    update public.products set stock = stock + v_delta where id = OLD.product_id;
    return NEW;
  end if;
end;
$$;

drop trigger if exists transaction_items_update_stock on public.transaction_items;
create trigger transaction_items_update_stock
  after insert or update or delete on public.transaction_items
  for each row execute function public.update_stock_from_transaction_item();

alter table public.transactions enable row level security;
revoke all on public.transactions from anon, authenticated;

alter table public.transaction_items enable row level security;
revoke all on public.transaction_items from anon, authenticated;
