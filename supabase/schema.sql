-- ================================================================
-- Josi App — Supabase Schema (Completo)
-- Execute no SQL Editor do seu projeto Supabase
-- ================================================================

-- ── PROFILES ────────────────────────────────────────────────────
-- Dados do usuário e resultado do onboarding

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
  avatar_url           text,
  pontos               integer default 0,
  sequencia_atual      integer default 0,   -- dias consecutivos
  sequencia_recorde    integer default 0,
  onboarding_completed boolean default false,
  is_admin             boolean default false,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

-- ── DESAFIO 21 DIAS ─────────────────────────────────────────────

-- Configuração de cada dia do desafio (conteúdo criado pela Josi)
create table if not exists public.challenge_days (
  day          integer primary key check (day between 1 and 21),
  titulo       text not null,
  descricao    text,
  video_url    text,
  duracao_min  integer,       -- duração estimada em minutos
  tipo         text check (tipo in ('treino','meditacao','nutricao','mentalidade','descanso')) default 'treino',
  dica         text,          -- dica do dia da Josi
  created_at   timestamptz default now()
);

-- Progresso do usuário no desafio
create table if not exists public.challenge_progress (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references public.profiles(id) on delete cascade,
  day              integer not null check (day between 1 and 21),
  completed        boolean default false,
  completed_at     timestamptz,
  anotacao         text,       -- nota pessoal do usuário naquele dia
  humor            integer check (humor between 1 and 5),  -- 1=péssimo 5=ótimo
  created_at       timestamptz default now(),
  unique (user_id, day)
);

-- Data de início do desafio do usuário
create table if not exists public.challenge_enrollments (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references public.profiles(id) on delete cascade,
  start_date   date not null default current_date,
  finished_at  timestamptz,
  created_at   timestamptz default now(),
  unique (user_id)
);

-- ── EXERCÍCIOS ──────────────────────────────────────────────────

-- Catálogo de exercícios
create table if not exists public.exercises (
  id           uuid default gen_random_uuid() primary key,
  nome         text not null,
  descricao    text,
  video_url    text,
  thumbnail_url text,
  categoria    text check (categoria in ('cardio','forca','mobilidade','yoga','meditacao','alongamento')) not null,
  nivel        text check (nivel in ('iniciante','intermediario','avancado')) default 'iniciante',
  duracao_min  integer,
  calorias_est integer,        -- calorias estimadas
  equipamento  text[] default '{}',  -- ex: ['halteres','tapete']
  musculos     text[] default '{}',  -- ex: ['gluteos','quadriceps']
  is_premium   boolean default false,
  created_at   timestamptz default now()
);

-- Sessões de treino realizadas pelo usuário
create table if not exists public.workout_sessions (
  id             uuid default gen_random_uuid() primary key,
  user_id        uuid references public.profiles(id) on delete cascade,
  exercise_id    uuid references public.exercises(id) on delete set null,
  date           date not null default current_date,
  duracao_min    integer,
  series         integer,
  repeticoes     integer,
  peso_kg        decimal(5,2),
  notas          text,
  created_at     timestamptz default now()
);

-- ── HÁBITOS DIÁRIOS ─────────────────────────────────────────────

create table if not exists public.habits_log (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references public.profiles(id) on delete cascade,
  date       date not null default current_date,
  agua       boolean default false,      -- 2L de água
  proteina   boolean default false,      -- meta de proteína
  passos     boolean default false,      -- 7k passos
  treino     boolean default false,      -- treinou hoje
  sono       boolean default false,      -- 7-8h de sono
  meditacao  boolean default false,      -- meditou
  sem_acucar boolean default false,      -- sem açúcar refinado
  notas      text,
  created_at timestamptz default now(),
  unique (user_id, date)
);

-- ── MEDIDAS CORPORAIS ───────────────────────────────────────────

create table if not exists public.measurements (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references public.profiles(id) on delete cascade,
  date          date not null default current_date,
  peso          decimal(5,2),
  cintura       decimal(5,1),
  quadril       decimal(5,1),
  braco         decimal(5,1),
  coxa          decimal(5,1),
  abdomen       decimal(5,1),
  panturrilha   decimal(5,1),
  foto_url      text,         -- foto de progresso
  notas         text,
  created_at    timestamptz default now()
);

-- ── COMUNIDADE ──────────────────────────────────────────────────

-- Posts da comunidade
create table if not exists public.community_posts (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references public.profiles(id) on delete cascade,
  conteudo     text not null,
  foto_url     text,
  tipo         text check (tipo in ('resultado','motivacao','pergunta','receita','dica')) default 'motivacao',
  likes_count  integer default 0,
  is_pinned    boolean default false,   -- post fixado pela Josi/admin
  is_deleted   boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Curtidas nos posts
create table if not exists public.post_likes (
  user_id    uuid references public.profiles(id) on delete cascade,
  post_id    uuid references public.community_posts(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);

-- Comentários nos posts
create table if not exists public.post_comments (
  id         uuid default gen_random_uuid() primary key,
  post_id    uuid references public.community_posts(id) on delete cascade,
  user_id    uuid references public.profiles(id) on delete cascade,
  conteudo   text not null,
  is_deleted boolean default false,
  created_at timestamptz default now()
);

-- ── EDUCAÇÃO ────────────────────────────────────────────────────

-- Conteúdo educativo (vídeos, artigos)
create table if not exists public.education_content (
  id           uuid default gen_random_uuid() primary key,
  titulo       text not null,
  descricao    text,
  conteudo     text,           -- texto do artigo (markdown)
  video_url    text,
  thumbnail_url text,
  categoria    text check (categoria in ('nutricao','treino','mentalidade','receitas','saude','estilo_de_vida')) not null,
  duracao_min  integer,
  is_premium   boolean default false,
  ordem        integer default 0,  -- para ordenar dentro da categoria
  published_at timestamptz default now(),
  created_at   timestamptz default now()
);

-- Progresso de leitura/visualização do usuário
create table if not exists public.education_progress (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.profiles(id) on delete cascade,
  content_id  uuid references public.education_content(id) on delete cascade,
  viewed      boolean default true,
  completed   boolean default false,
  percent     integer default 0 check (percent between 0 and 100),
  viewed_at   timestamptz default now(),
  unique (user_id, content_id)
);

-- ── LOJA ────────────────────────────────────────────────────────

-- Produtos da loja
create table if not exists public.products (
  id            uuid default gen_random_uuid() primary key,
  nome          text not null,
  descricao     text,
  preco         decimal(8,2) not null,
  preco_original decimal(8,2),   -- preço antes do desconto
  foto_url      text,
  categoria     text check (categoria in ('plano','ebook','consultoria','suplemento','roupa','acessorio')) not null,
  estoque       integer,         -- null = digital/ilimitado
  is_active     boolean default true,
  destaque      boolean default false,
  created_at    timestamptz default now()
);

-- Histórico de pedidos
create table if not exists public.orders (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references public.profiles(id) on delete cascade,
  product_id   uuid references public.products(id) on delete set null,
  status       text check (status in ('pendente','pago','cancelado','entregue')) default 'pendente',
  valor        decimal(8,2) not null,
  metodo_pag   text,           -- 'pix', 'cartao', etc
  referencia   text,           -- ID externo do pagamento
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── NOTIFICAÇÕES ────────────────────────────────────────────────

create table if not exists public.notifications (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references public.profiles(id) on delete cascade,
  titulo     text not null,
  mensagem   text,
  tipo       text check (tipo in ('desafio','habito','comunidade','loja','sistema')) default 'sistema',
  lida       boolean default false,
  url        text,             -- link de destino ao clicar
  created_at timestamptz default now()
);

-- ── ROW LEVEL SECURITY ──────────────────────────────────────────

alter table public.profiles             enable row level security;
alter table public.challenge_days       enable row level security;
alter table public.challenge_progress   enable row level security;
alter table public.challenge_enrollments enable row level security;
alter table public.exercises            enable row level security;
alter table public.workout_sessions     enable row level security;
alter table public.habits_log           enable row level security;
alter table public.measurements         enable row level security;
alter table public.community_posts      enable row level security;
alter table public.post_likes           enable row level security;
alter table public.post_comments        enable row level security;
alter table public.education_content    enable row level security;
alter table public.education_progress   enable row level security;
alter table public.products             enable row level security;
alter table public.orders               enable row level security;
alter table public.notifications        enable row level security;

-- Profiles
create policy "profiles: select own"    on public.profiles for select using (auth.uid() = id);
create policy "profiles: insert own"    on public.profiles for insert with check (auth.uid() = id);
create policy "profiles: update own"    on public.profiles for update using (auth.uid() = id);

-- Challenge days (conteúdo público — todos leem)
create policy "challenge_days: public read" on public.challenge_days for select using (true);

-- Challenge progress
create policy "progress: all own"       on public.challenge_progress for all using (auth.uid() = user_id);

-- Challenge enrollment
create policy "enrollment: all own"     on public.challenge_enrollments for all using (auth.uid() = user_id);

-- Exercises (catálogo público — todos leem)
create policy "exercises: public read"  on public.exercises for select using (true);

-- Workout sessions
create policy "workouts: all own"       on public.workout_sessions for all using (auth.uid() = user_id);

-- Habits
create policy "habits: all own"         on public.habits_log for all using (auth.uid() = user_id);

-- Measurements
create policy "measurements: all own"   on public.measurements for all using (auth.uid() = user_id);

-- Community posts (todos leem posts não deletados)
create policy "posts: public read"      on public.community_posts for select using (is_deleted = false);
create policy "posts: insert own"       on public.community_posts for insert with check (auth.uid() = user_id);
create policy "posts: update own"       on public.community_posts for update using (auth.uid() = user_id);

-- Post likes
create policy "likes: public read"      on public.post_likes for select using (true);
create policy "likes: insert own"       on public.post_likes for insert with check (auth.uid() = user_id);
create policy "likes: delete own"       on public.post_likes for delete using (auth.uid() = user_id);

-- Post comments
create policy "comments: public read"   on public.post_comments for select using (is_deleted = false);
create policy "comments: insert own"    on public.post_comments for insert with check (auth.uid() = user_id);
create policy "comments: update own"    on public.post_comments for update using (auth.uid() = user_id);

-- Education content (público — todos leem)
create policy "edu_content: public read" on public.education_content for select using (true);

-- Education progress
create policy "edu_progress: all own"   on public.education_progress for all using (auth.uid() = user_id);

-- Products (público — todos leem produtos ativos)
create policy "products: public read"   on public.products for select using (is_active = true);

-- Orders
create policy "orders: all own"         on public.orders for all using (auth.uid() = user_id);

-- Notifications
create policy "notifs: all own"         on public.notifications for all using (auth.uid() = user_id);

-- ── FUNÇÕES E TRIGGERS ──────────────────────────────────────────

-- Auto-cria profile ao cadastrar
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

-- Atualiza likes_count automaticamente ao dar like/unlike
create or replace function public.update_post_likes_count()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if TG_OP = 'INSERT' then
    update public.community_posts set likes_count = likes_count + 1 where id = NEW.post_id;
  elsif TG_OP = 'DELETE' then
    update public.community_posts set likes_count = greatest(likes_count - 1, 0) where id = OLD.post_id;
  end if;
  return null;
end;
$$;

drop trigger if exists on_post_like on public.post_likes;
create trigger on_post_like
  after insert or delete on public.post_likes
  for each row execute procedure public.update_post_likes_count();

-- Atualiza updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at       before update on public.profiles         for each row execute procedure public.set_updated_at();
create trigger posts_updated_at          before update on public.community_posts   for each row execute procedure public.set_updated_at();
create trigger orders_updated_at         before update on public.orders            for each row execute procedure public.set_updated_at();
