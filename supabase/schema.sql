-- ================================================================
-- Josi App — Supabase Schema
-- Execute no SQL Editor do seu projeto Supabase
-- ================================================================

-- Profiles (criado automaticamente após signup)
create table if not exists public.profiles (
  id                   uuid references auth.users on delete cascade primary key,
  nome                 text,
  idade                integer,
  peso_inicial         decimal(5,2),
  altura               integer,
  imc                  decimal(4,1),
  objetivo             text check (objetivo in ('emagrecer','definir','massa','saude','manutencao')),
  nivel_atividade      text check (nivel_atividade in ('sedentario','leve','moderada','ativa')),
  condicoes_saude      text[] default '{}',
  dias_semana          integer check (dias_semana between 1 and 7),
  motivacao            text,
  onboarding_completed boolean default false,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

-- Challenge progress per day
create table if not exists public.challenge_progress (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references public.profiles(id) on delete cascade,
  day          integer not null check (day between 1 and 21),
  completed    boolean default false,
  lesson_done  boolean default false,
  completed_at timestamptz,
  created_at   timestamptz default now(),
  unique (user_id, day)
);

-- Daily habits log
create table if not exists public.habits_log (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references public.profiles(id) on delete cascade,
  date       date not null,
  agua       boolean default false,
  proteina   boolean default false,
  passos     boolean default false,
  treino     boolean default false,
  created_at timestamptz default now(),
  unique (user_id, date)
);

-- Body measurements log
create table if not exists public.measurements (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references public.profiles(id) on delete cascade,
  date       date not null,
  peso       decimal(5,2),
  cintura    decimal(5,1),
  quadril    decimal(5,1),
  braco      decimal(5,1),
  coxa       decimal(5,1),
  created_at timestamptz default now()
);

-- ── Row Level Security ──────────────────────────────────────────

alter table public.profiles           enable row level security;
alter table public.challenge_progress enable row level security;
alter table public.habits_log         enable row level security;
alter table public.measurements       enable row level security;

-- Profiles
create policy "profiles: select own"
  on public.profiles for select using (auth.uid() = id);
create policy "profiles: insert own"
  on public.profiles for insert with check (auth.uid() = id);
create policy "profiles: update own"
  on public.profiles for update using (auth.uid() = id);

-- Challenge progress
create policy "progress: all own"
  on public.challenge_progress for all using (auth.uid() = user_id);

-- Habits
create policy "habits: all own"
  on public.habits_log for all using (auth.uid() = user_id);

-- Measurements
create policy "measurements: all own"
  on public.measurements for all using (auth.uid() = user_id);

-- ── Auto-create profile on signup ──────────────────────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
