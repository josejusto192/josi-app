-- Atualiza trigger para salvar o nome do metadata de cadastro
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nome)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', new.raw_user_meta_data->>'full_name', null)
  )
  on conflict (id) do update set
    nome = coalesce(excluded.nome, public.profiles.nome);
  return new;
end;
$$;
