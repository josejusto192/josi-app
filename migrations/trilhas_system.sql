-- ================================================================
-- SISTEMA DE TRILHAS — Viver Bem
-- Execute no Supabase Dashboard → SQL Editor
-- ================================================================

-- 1. Trilhas (caminhos de aprendizado)
CREATE TABLE IF NOT EXISTS trilhas (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo       TEXT NOT NULL,
  descricao    TEXT,
  ordem        INTEGER DEFAULT 1,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- 2. Desafios dentro de cada trilha
CREATE TABLE IF NOT EXISTS desafios (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trilha_id    UUID REFERENCES trilhas(id) ON DELETE CASCADE NOT NULL,
  titulo       TEXT NOT NULL,
  descricao    TEXT,
  duracao_dias INTEGER NOT NULL DEFAULT 21,
  ordem        INTEGER DEFAULT 1,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- 3. Conteúdo diário de cada desafio
CREATE TABLE IF NOT EXISTS desafio_dias (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  desafio_id   UUID REFERENCES desafios(id) ON DELETE CASCADE NOT NULL,
  day          INTEGER NOT NULL CHECK (day >= 1),
  titulo       TEXT,
  descricao    TEXT,
  video_url    TEXT,
  duracao_min  INTEGER,
  tipo         TEXT,
  dica         TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(desafio_id, day)
);

-- 4. Matrícula da usuária em cada desafio
CREATE TABLE IF NOT EXISTS user_desafios (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  desafio_id   UUID REFERENCES desafios(id) ON DELETE CASCADE NOT NULL,
  trilha_id    UUID REFERENCES trilhas(id) NOT NULL,
  start_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, desafio_id)
);

-- 5. Progresso diário por desafio
CREATE TABLE IF NOT EXISTS desafio_day_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  desafio_id   UUID REFERENCES desafios(id) ON DELETE CASCADE NOT NULL,
  day          INTEGER NOT NULL CHECK (day >= 1),
  completed    BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  anotacao     TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, desafio_id, day)
);

-- ── RLS ────────────────────────────────────────────────────────
ALTER TABLE trilhas              ENABLE ROW LEVEL SECURITY;
ALTER TABLE desafios             ENABLE ROW LEVEL SECURITY;
ALTER TABLE desafio_dias         ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_desafios        ENABLE ROW LEVEL SECURITY;
ALTER TABLE desafio_day_progress ENABLE ROW LEVEL SECURITY;

-- Trilhas/desafios/dias: leitura pública
CREATE POLICY "trilhas_public_read"      ON trilhas              FOR SELECT USING (true);
CREATE POLICY "desafios_public_read"     ON desafios             FOR SELECT USING (true);
CREATE POLICY "desafio_dias_public_read" ON desafio_dias         FOR SELECT USING (true);

-- Admin: escrita nas tabelas de conteúdo
CREATE POLICY "trilhas_admin_write"      ON trilhas              FOR ALL   USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "desafios_admin_write"     ON desafios             FOR ALL   USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "desafio_dias_admin_write" ON desafio_dias         FOR ALL   USING (auth.jwt() ->> 'role' = 'service_role');

-- user_desafios: cada usuária lê/escreve os seus
CREATE POLICY "ud_select" ON user_desafios        FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ud_insert" ON user_desafios        FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ud_update" ON user_desafios        FOR UPDATE USING (auth.uid() = user_id);

-- desafio_day_progress: cada usuária lê/escreve os seus
CREATE POLICY "ddp_select" ON desafio_day_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ddp_insert" ON desafio_day_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ddp_update" ON desafio_day_progress FOR UPDATE USING (auth.uid() = user_id);

-- ── SEED INICIAL ───────────────────────────────────────────────
-- Cria a primeira trilha e o primeiro desafio (os 21 dias actuais)
INSERT INTO trilhas (titulo, descricao, ordem, is_active)
VALUES ('Viver Bem', 'Sua jornada de transformação contínua', 1, true)
ON CONFLICT DO NOTHING;

INSERT INTO desafios (trilha_id, titulo, descricao, duracao_dias, ordem, is_active)
SELECT id, 'Desafio 21 Dias', 'O início da sua transformação', 21, 1, true
FROM trilhas WHERE titulo = 'Viver Bem'
ON CONFLICT DO NOTHING;
