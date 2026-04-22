-- ================================================================
-- Migration 001 — Admin role
-- Execute no SQL Editor do Supabase
-- ================================================================

-- Adiciona coluna is_admin à tabela profiles
alter table public.profiles
  add column if not exists is_admin boolean default false;

-- Para tornar a Josiane admin, execute depois:
-- update public.profiles set is_admin = true where id = '<uuid-da-josiane>';
--
-- Você acha o UUID dela em: Supabase → Authentication → Users
