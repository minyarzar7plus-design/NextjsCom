-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ─── PROFILES ────────────────────────────────────────────────────────────────
create type user_role as enum ('user', 'admin');
create type locale_code as enum ('en', 'my', 'th', 'lo');

create table public.profiles (
  id           uuid primary key references auth.users on delete cascade,
  email        text not null unique,
  full_name    text,
  avatar_url   text,
  phone        text,
  role         user_role not null default 'user',
  locale       locale_code not null default 'en',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles"
  on public.profiles for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── TASKS ───────────────────────────────────────────────────────────────────
create type task_status as enum ('open', 'in_progress', 'completed', 'cancelled');
create type task_priority as enum ('low', 'medium', 'high');

create table public.tasks (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  description  text,
  status       task_status not null default 'open',
  priority     task_priority not null default 'medium',
  price        numeric(12,2) not null check (price >= 0),
  currency     text not null default 'USD',
  poster_id    uuid not null references public.profiles(id) on delete cascade,
  assignee_id  uuid references public.profiles(id) on delete set null,
  category     text not null,
  deadline     timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.tasks enable row level security;
create policy "Anyone can view open tasks" on public.tasks for select using (status = 'open');
create policy "Poster can manage own tasks" on public.tasks for all using (auth.uid() = poster_id);
create policy "Assignee can view assigned tasks" on public.tasks for select using (auth.uid() = assignee_id);

-- ─── ORDERS ──────────────────────────────────────────────────────────────────
create type order_status as enum ('pending','accepted','in_progress','delivered','completed','disputed','cancelled');

create table public.orders (
  id           uuid primary key default uuid_generate_v4(),
  task_id      uuid not null references public.tasks(id) on delete restrict,
  buyer_id     uuid not null references public.profiles(id) on delete restrict,
  seller_id    uuid not null references public.profiles(id) on delete restrict,
  status       order_status not null default 'pending',
  amount       numeric(12,2) not null,
  currency     text not null default 'USD',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.orders enable row level security;
create policy "Parties can view own orders"
  on public.orders for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "Buyer can create orders"
  on public.orders for insert with check (auth.uid() = buyer_id);
create policy "Parties can update own orders"
  on public.orders for update using (auth.uid() = buyer_id or auth.uid() = seller_id);

-- ─── PAYMENTS ────────────────────────────────────────────────────────────────
create type payment_status as enum ('pending','processing','completed','failed','refunded');
create type payment_provider as enum ('stripe','kbzpay','wavepay','promptpay','lao_qr');

create table public.payments (
  id            uuid primary key default uuid_generate_v4(),
  order_id      uuid not null references public.orders(id) on delete restrict,
  user_id       uuid not null references public.profiles(id) on delete restrict,
  amount        numeric(12,2) not null,
  currency      text not null default 'USD',
  status        payment_status not null default 'pending',
  provider      payment_provider not null,
  provider_ref  text,
  created_at    timestamptz not null default now()
);

alter table public.payments enable row level security;
create policy "Users can view own payments"
  on public.payments for select using (auth.uid() = user_id);

-- ─── WALLETS ─────────────────────────────────────────────────────────────────
create table public.wallets (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null unique references public.profiles(id) on delete cascade,
  balance     numeric(12,2) not null default 0 check (balance >= 0),
  currency    text not null default 'USD',
  updated_at  timestamptz not null default now()
);

alter table public.wallets enable row level security;
create policy "Users can view own wallet" on public.wallets for select using (auth.uid() = user_id);

create type tx_type as enum ('credit','debit','hold','release');

create table public.wallet_transactions (
  id             uuid primary key default uuid_generate_v4(),
  wallet_id      uuid not null references public.wallets(id) on delete restrict,
  type           tx_type not null,
  amount         numeric(12,2) not null,
  balance_after  numeric(12,2) not null,
  reference_id   uuid,
  description    text not null,
  created_at     timestamptz not null default now()
);

alter table public.wallet_transactions enable row level security;
create policy "Users can view own transactions"
  on public.wallet_transactions for select
  using (wallet_id in (select id from public.wallets where user_id = auth.uid()));

-- Auto-create wallet on profile creation
create or replace function public.handle_new_profile()
returns trigger language plpgsql security definer as $$
begin
  insert into public.wallets (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_profile();

-- Updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger set_tasks_updated_at before update on public.tasks
  for each row execute procedure public.set_updated_at();
create trigger set_orders_updated_at before update on public.orders
  for each row execute procedure public.set_updated_at();
create trigger set_wallets_updated_at before update on public.wallets
  for each row execute procedure public.set_updated_at();
