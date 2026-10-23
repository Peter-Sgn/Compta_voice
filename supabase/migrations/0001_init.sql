-- Profil de l'utilisateur
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  business_name text,
  business_type text check (business_type in
    ('boutique','marche','restauration','couture','boissons','autre')),
  language text not null default 'fr',
  currency text not null default 'XOF',
  reminder_time time,
  created_at timestamptz not null default now()
);

-- Opérations (ventes et dépenses)
create table operations (
  id uuid primary key,                       -- généré côté client (idempotence hors ligne)
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('sale','expense')),
  label text not null,                       -- ex. "savon", "transport"
  category text,
  quantity numeric,
  unit text,                                 -- ex. "carton", "sac"
  unit_price bigint,                         -- FCFA, entier
  total_amount bigint not null check (total_amount >= 0),  -- FCFA, entier
  occurred_at timestamptz not null default now(),
  source text not null check (source in ('voice','text','manual')),
  transcript text,                           -- texte compris (pas d'audio en V1)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz                     -- suppression douce
);
create index operations_user_date_idx on operations (user_id, occurred_at desc);

-- Historique des modifications
create table operation_edits (
  id uuid primary key default gen_random_uuid(),
  operation_id uuid not null references operations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  changed_at timestamptz not null default now(),
  before jsonb not null,
  after jsonb not null
);

-- Unités personnalisées (« tas », « bassine »…)
create table custom_units (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  aliases text[] not null default '{}'
);

-- Compteur d'appels IA (protège le quota gratuit)
create table ai_usage_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  calls int not null default 0,
  primary key (user_id, day)
);

-- Row Level Security : chacun ne voit que ses lignes
alter table profiles enable row level security;
alter table operations enable row level security;
alter table operation_edits enable row level security;
alter table custom_units enable row level security;
alter table ai_usage_daily enable row level security;

create policy "own profile" on profiles
  for all using (id = auth.uid()) with check (id = auth.uid());
create policy "own operations" on operations
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own edits" on operation_edits
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own units" on custom_units
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own usage" on ai_usage_daily
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
