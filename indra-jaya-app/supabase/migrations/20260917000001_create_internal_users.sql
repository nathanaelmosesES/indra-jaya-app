create table if not exists public.internal_users (
  id            uuid primary key default gen_random_uuid(),
  username      text not null unique,
  password_hash text not null,
  role          text not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint internal_users_role_check check (role in ('owner', 'staff')),
  constraint internal_users_username_format check (username ~ '^[a-z0-9._-]{3,32}$')
);

drop trigger if exists internal_users_set_updated_at on public.internal_users;
create trigger internal_users_set_updated_at
  before update on public.internal_users
  for each row execute function public.set_updated_at();

alter table public.internal_users enable row level security;
revoke all on public.internal_users from anon, authenticated;
