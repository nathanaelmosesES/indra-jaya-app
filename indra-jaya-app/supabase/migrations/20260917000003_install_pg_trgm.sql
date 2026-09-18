create extension if not exists pg_trgm with schema extensions;

create index if not exists products_name_trgm_idx
  on public.products using gist (name extensions.gist_trgm_ops);

create index if not exists products_code_trgm_idx
  on public.products using gist (code extensions.gist_trgm_ops);
