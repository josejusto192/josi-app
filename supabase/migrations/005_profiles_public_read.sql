-- Permite que usuárias autenticadas leiam informações básicas de outros perfis
-- (necessário para mostrar nome e avatar nos posts da comunidade)
create policy "profiles: authenticated read basic"
  on public.profiles
  for select
  using (auth.role() = 'authenticated');
