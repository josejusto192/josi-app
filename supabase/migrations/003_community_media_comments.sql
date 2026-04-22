-- Adiciona video_url e media_url ao community_posts
alter table public.community_posts add column if not exists video_url text;

-- Adiciona parent_id a post_comments para suporte a respostas
alter table public.post_comments add column if not exists parent_id uuid references public.post_comments(id) on delete cascade;

-- Tabela de curtidas em comentários
create table if not exists public.comment_likes (
  user_id    uuid references public.profiles(id) on delete cascade,
  comment_id uuid references public.post_comments(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, comment_id)
);

alter table public.comment_likes enable row level security;

create policy "comment_likes: public read" on public.comment_likes for select using (true);
create policy "comment_likes: insert own"  on public.comment_likes for insert with check (auth.uid() = user_id);
create policy "comment_likes: delete own"  on public.comment_likes for delete using (auth.uid() = user_id);

-- Coluna de likes em comentários
alter table public.post_comments add column if not exists likes_count integer default 0;

-- Trigger para atualizar likes_count em comentários
create or replace function public.update_comment_likes_count()
returns trigger language plpgsql security definer as $$
begin
  if TG_OP = 'INSERT' then
    update public.post_comments set likes_count = likes_count + 1 where id = NEW.comment_id;
  elsif TG_OP = 'DELETE' then
    update public.post_comments set likes_count = greatest(likes_count - 1, 0) where id = OLD.comment_id;
  end if;
  return null;
end;
$$;

drop trigger if exists on_comment_like on public.comment_likes;
create trigger on_comment_like
  after insert or delete on public.comment_likes
  for each row execute procedure public.update_comment_likes_count();

-- Policy para admin deletar qualquer post (via update is_deleted)
-- Admins usam service role então não precisam de policy separada.
-- Para o client normal, adicionar policy de delete próprio:
create policy "posts: delete own" on public.community_posts for delete using (auth.uid() = user_id);
create policy "comments: delete own" on public.post_comments for delete using (auth.uid() = user_id);

-- Storage bucket para mídias da comunidade
-- EXECUTE NO DASHBOARD SUPABASE → Storage → New bucket:
--   Nome: community-media
--   Public: true
-- Ou via SQL:
insert into storage.buckets (id, name, public)
  values ('community-media', 'community-media', true)
  on conflict (id) do nothing;

-- Policies de storage para community-media
create policy "community-media: public read"
  on storage.objects for select
  using (bucket_id = 'community-media');

create policy "community-media: authenticated upload"
  on storage.objects for insert
  with check (bucket_id = 'community-media' and auth.role() = 'authenticated');

create policy "community-media: owner delete"
  on storage.objects for delete
  using (bucket_id = 'community-media' and auth.uid() = owner);
