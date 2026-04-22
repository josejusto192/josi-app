-- ================================================================
-- Migration 002 — Corrige NULLs no campo is_admin
-- Execute no SQL Editor do Supabase
-- ================================================================

-- Garante que todos os usuários existentes tenham is_admin = false (não NULL)
update public.profiles
set is_admin = false
where is_admin is null;

-- Garante que novos usuários sempre recebam false
alter table public.profiles
  alter column is_admin set default false,
  alter column is_admin set not null;
