-- ── EDUCAÇÃO: CURSOS → MÓDULOS → AULAS ──────────────────────────────────────

create table if not exists public.courses (
  id            uuid default gen_random_uuid() primary key,
  titulo        text not null,
  descricao     text,
  thumbnail_url text,
  categoria     text check (categoria in ('nutricao','treino','mentalidade','receitas','saude','beleza')) not null default 'nutricao',
  is_premium    boolean default false,
  is_published  boolean default true,
  ordem         integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create table if not exists public.course_modules (
  id         uuid default gen_random_uuid() primary key,
  course_id  uuid references public.courses(id) on delete cascade not null,
  titulo     text not null,
  descricao  text,
  ordem      integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.lessons (
  id           uuid default gen_random_uuid() primary key,
  module_id    uuid references public.course_modules(id) on delete cascade not null,
  titulo       text not null,
  descricao    text,
  tipo         text check (tipo in ('video','texto','markdown','imagem','pdf')) not null default 'video',
  conteudo     text,
  video_url    text,
  imagem_url   text,
  duracao_min  integer,
  ordem        integer default 0,
  is_premium   boolean default false,
  is_published boolean default true,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table if not exists public.lesson_progress (
  user_id      uuid references public.profiles(id) on delete cascade,
  lesson_id    uuid references public.lessons(id) on delete cascade,
  completed    boolean default true,
  completed_at timestamptz default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.course_enrollments (
  user_id      uuid references public.profiles(id) on delete cascade,
  course_id    uuid references public.courses(id) on delete cascade,
  enrolled_at  timestamptz default now(),
  completed_at timestamptz,
  primary key (user_id, course_id)
);

-- RLS
alter table public.courses            enable row level security;
alter table public.course_modules     enable row level security;
alter table public.lessons            enable row level security;
alter table public.lesson_progress    enable row level security;
alter table public.course_enrollments enable row level security;

create policy "courses: public read"      on public.courses            for select using (is_published = true);
create policy "modules: public read"      on public.course_modules     for select using (true);
create policy "lessons: public read"      on public.lessons            for select using (is_published = true);
create policy "lesson_progress: all own"  on public.lesson_progress    for all   using (auth.uid() = user_id);
create policy "enrollments: all own"      on public.course_enrollments for all   using (auth.uid() = user_id);

-- Triggers updated_at
create trigger courses_updated_at before update on public.courses for each row execute procedure public.set_updated_at();
create trigger lessons_updated_at before update on public.lessons for each row execute procedure public.set_updated_at();

-- ── DADOS DE DEMONSTRAÇÃO ─────────────────────────────────────────────────────
-- UUIDs válidos (apenas hex: 0-9, a-f)

-- CURSOS
insert into public.courses (id, titulo, descricao, categoria, is_premium, ordem) values
('10000000-0000-0000-0000-000000000001',
 'Nutrição Real no Dia a Dia',
 'Aprenda a se alimentar de forma saudável, prática e sem sofrimento. Sem dietas restritivas, com foco em hábitos reais que cabem na sua rotina.',
 'nutricao', false, 1),
('10000000-0000-0000-0000-000000000002',
 'Mindset de Transformação',
 'Trabalhe sua mente para sustentar as mudanças que você quer no corpo. Autoconhecimento, crenças limitantes e construção de hábitos duradouros.',
 'mentalidade', false, 2),
('10000000-0000-0000-0000-000000000003',
 'Receitas Práticas da Chácara',
 'As receitas saudáveis e deliciosas que a Josi faz na chácara — fáceis de fazer em casa, com ingredientes simples e muito sabor.',
 'receitas', true, 3);

-- MÓDULOS — Curso 1: Nutrição
insert into public.course_modules (id, course_id, titulo, descricao, ordem) values
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Fundamentos da Alimentação Saudável', 'A base para uma relação positiva com a comida', 1),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Montando o Prato Perfeito', 'Proporções, variedade e praticidade', 2),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Planejamento Semanal', 'Como organizar refeições sem estresse', 3);

-- MÓDULOS — Curso 2: Mindset
insert into public.course_modules (id, course_id, titulo, descricao, ordem) values
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'A Base Mental', 'Entenda o que está por trás dos seus padrões', 1),
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', 'Construindo Hábitos Duradouros', 'Da vontade para a ação consistente', 2);

-- MÓDULOS — Curso 3: Receitas
insert into public.course_modules (id, course_id, titulo, descricao, ordem) values
('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003', 'Café da Manhã Poderoso', 'Começos de dia nutritivos e gostosos', 1),
('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000003', 'Almoço e Jantar Sem Culpa', 'Refeições completas e leves', 2);

-- AULAS — Módulo 1 (Fundamentos)
insert into public.lessons (module_id, titulo, descricao, tipo, video_url, conteudo, duracao_min, ordem) values
('20000000-0000-0000-0000-000000000001',
 'Por que dietas restritivas não funcionam',
 'A verdade sobre o efeito sanfona e como sair desse ciclo',
 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', null, 8, 1),

('20000000-0000-0000-0000-000000000001',
 'Macronutrientes descomplicados',
 'Proteínas, carboidratos e gorduras — o que realmente importa saber',
 'markdown', null,
 E'# Macronutrientes: o básico que você precisa saber\n\n## 🥩 Proteínas\nAs proteínas são responsáveis pela construção e reparação muscular. Fontes: carnes, ovos, leguminosas, laticínios.\n\n**Meta diária:** 1,2 a 2g por kg de peso corporal.\n\n## 🍚 Carboidratos\nSua principal fonte de energia. Priorize os complexos: aveia, batata-doce, arroz integral, frutas.\n\n> Carboidrato não engorda — excesso de calorias engorda.\n\n## 🥑 Gorduras\nEssenciais para hormônios, saúde cerebral e absorção de vitaminas. Inclua: azeite, abacate, castanhas, ovo.\n\n## ⚖️ Equilíbrio é tudo\nNão existe alimento proibido. Existe quantidade e frequência. Aprenda a ouvir seu corpo.',
 6, 2),

('20000000-0000-0000-0000-000000000001',
 'A importância da hidratação',
 'Água, chás e o que conta como hidratação de verdade',
 'texto', null,
 E'Você sabia que a desidratação leve já causa fadiga, dificuldade de concentração e até fome falsa?\n\nMuitas vezes o que sentimos como fome é sede. Antes de beliscar fora de hora, tome um copo d''água e espere 10 minutos.\n\nMeta diária: 35ml por kg de peso. Para 60kg: 2,1 litros.\n\nDicas para beber mais água:\n- Tenha sempre uma garrafinha visível na mesa\n- Adicione limão, hortelã ou pepino para variar\n- Chás naturais contam (sem açúcar)\n- Evite refrigerantes e sucos industrializados',
 5, 3);

-- AULAS — Módulo 2 (Prato Perfeito)
insert into public.lessons (module_id, titulo, descricao, tipo, video_url, conteudo, duracao_min, ordem) values
('20000000-0000-0000-0000-000000000002',
 'O método do prato equilibrado',
 'Metade legumes, um quarto proteína, um quarto carboidrato — simples assim',
 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', null, 10, 1),

('20000000-0000-0000-0000-000000000002',
 'Substituições inteligentes',
 'Trocas que fazem diferença sem abrir mão do sabor',
 'markdown', null,
 E'# Substituições que funcionam de verdade\n\n| Em vez de | Experimente |\n|-----------|-------------|\n| Arroz branco | Arroz + couve-flor misturado |\n| Farinha de trigo | Farinha de aveia |\n| Açúcar | Banana madura amassada |\n| Maionese | Iogurte natural + limão |\n| Fritura | Air fryer com azeite |\n| Refrigerante | Água com gás + limão + hortelã |\n\n## 🌟 Regra de ouro\nNão precisa eliminar nada. Comece fazendo 50% de substituição. Com o tempo, seu paladar vai se adaptar.',
 7, 2);

-- AULAS — Módulo 3 (Planejamento)
insert into public.lessons (module_id, titulo, descricao, tipo, video_url, conteudo, duracao_min, ordem) values
('20000000-0000-0000-0000-000000000003',
 'Marmitas da semana em 1 hora',
 'O método batch cooking da Josi para semanas organizadas',
 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', null, 15, 1),

('20000000-0000-0000-0000-000000000003',
 'Lista de compras estratégica',
 'Como montar sua lista para não desperdiçar e economizar',
 'markdown', null,
 E'# Lista de compras estratégica\n\n## 🥬 Vegetais base (compre sempre)\n- Espinafre, couve, rúcula\n- Brócolis, abobrinha, cenoura\n- Tomate, pepino, cebola, alho\n\n## 🥩 Proteínas\n- Peito de frango (congele em porções)\n- Ovos (duram a semana toda)\n- Atum em lata (prático para emergências)\n- Leguminosas: feijão, grão-de-bico, lentilha\n\n## 🍚 Carboidratos complexos\n- Batata-doce, inhame\n- Arroz integral\n- Aveia em flocos\n\n## 🥫 Despensa inteligente\n- Azeite de oliva extra virgem\n- Coco ralado sem açúcar\n- Castanhas e nozes\n- Temperos naturais\n\n## 💡 Dica da Josi\nCompre com estômago cheio e lista na mão. Evite os corredores do meio (processados). Fique no perímetro do mercado.',
 8, 2);

-- AULAS — Módulo 4 (Base Mental)
insert into public.lessons (module_id, titulo, descricao, tipo, video_url, conteudo, duracao_min, ordem) values
('20000000-0000-0000-0000-000000000004',
 'Por que você sabota seus próprios resultados',
 'Os mecanismos inconscientes que nos impedem de avançar',
 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', null, 12, 1),

('20000000-0000-0000-0000-000000000004',
 'Identificando crenças limitantes',
 'O que você acredita sobre si mesma que te prende',
 'markdown', null,
 E'# Crenças limitantes: o que são e como reconhecer\n\n## O que é uma crença limitante?\nÉ uma ideia que você tem sobre si mesma ou o mundo que te impede de agir. Geralmente aprendemos essas crenças na infância.\n\n## Exemplos comuns\n- *"Nunca fui de esportes"*\n- *"Na minha família todo mundo é gordo"*\n- *"Não tenho força de vontade"*\n- *"Moro para os outros, não tenho tempo pra mim"*\n\n## Como identificar as suas\n1. Pense em algo que você quer mas não consegue manter\n2. Pergunte: *"O que eu acredito sobre isso?"*\n3. Escreva sem julgamento\n4. Questione: *"Isso é um fato ou uma história que conto pra mim?"*\n\n## ✍️ Exercício\nEscreva 3 frases que começam com "Eu nunca consegui..." e investigue de onde veio cada uma.',
 9, 2),

('20000000-0000-0000-0000-000000000004',
 'A roda da vida: onde você está agora',
 'Uma fotografia honesta da sua vida em 8 áreas',
 'texto', null,
 E'A Roda da Vida é uma ferramenta poderosa de autoconhecimento. Ela divide sua vida em 8 áreas e pede que você avalie de 0 a 10 onde está em cada uma:\n\n• Saúde e Corpo\n• Alimentação\n• Carreira/Finanças\n• Relacionamentos\n• Desenvolvimento Pessoal\n• Espiritualidade\n• Lazer e Diversão\n• Ambiente/Casa\n\nO objetivo não é ter 10 em tudo — isso é impossível e esgotante. O objetivo é ter equilíbrio e saber ONDE focar energia agora.\n\nExercício: Dê uma nota de 1 a 10 em cada área. As que ficaram abaixo de 6 são suas prioridades.',
 7, 3);

-- AULAS — Módulo 5 (Hábitos Duradouros)
insert into public.lessons (module_id, titulo, descricao, tipo, video_url, conteudo, duracao_min, ordem) values
('20000000-0000-0000-0000-000000000005',
 'A ciência dos hábitos',
 'Como o loop hábito funciona e como usar isso a seu favor',
 'markdown', null,
 E'# Como hábitos se formam (e se quebram)\n\nBaseado no livro *Hábitos Atômicos* de James Clear.\n\n## O Loop do Hábito\n\n```\nSinal → Anseio → Resposta → Recompensa\n```\n\n**Exemplo de hábito ruim:**\n- Sinal: Tédio/estresse\n- Anseio: Alívio\n- Resposta: Comer doce\n- Recompensa: Sensação momentânea de prazer\n\n**Como criar um hábito bom:**\n- Torne o sinal óbvio (coloque a marmita pronta na geladeira)\n- Torne o desejo atraente (prepare uma refeição bonita)\n- Torne a resposta fácil (deixe tudo cortado e pronto)\n- Torne a recompensa satisfatória (registre no app!)\n\n## Regra dos 2 minutos\nSe um hábito novo parece difícil, reduza até ele levar só 2 minutos.\n\n> *"Você não sobe ao nível das suas metas. Você cai ao nível dos seus sistemas."*\n> — James Clear',
 10, 1),

('20000000-0000-0000-0000-000000000005',
 'Sua rotina matinal poderosa',
 'Como os primeiros 30 minutos do dia moldam tudo que vem depois',
 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', null, 11, 2),

('20000000-0000-0000-0000-000000000005',
 'Diário de bordo: o poder de escrever',
 'Por que anotar seu progresso acelera resultados',
 'texto', null,
 E'Escrever tem um poder transformador comprovado pela ciência. Quando você coloca pensamentos no papel, ativa o córtex pré-frontal — a parte lógica do cérebro — e reduz a reatividade emocional.\n\nComo usar o diário no seu processo:\n\n1. GRATIDÃO (2 minutos): Escreva 3 coisas pelas quais é grata hoje. Isso treina o cérebro para notar o positivo.\n\n2. INTENÇÃO DO DIA (2 minutos): O que você vai fazer hoje em prol da sua saúde? Seja específica.\n\n3. REFLEXÃO NOTURNA (3 minutos): O que funcionou? O que pode melhorar amanhã? Sem julgamento.\n\nNão precisa ser longo. 7 minutos por dia é suficiente para mudança real.',
 6, 3);

-- AULAS — Módulo 6 (Café da Manhã)
insert into public.lessons (module_id, titulo, descricao, tipo, video_url, conteudo, duracao_min, ordem, is_premium) values
('20000000-0000-0000-0000-000000000006',
 'Tapioca proteica com ovo e queijo',
 'A tapioca perfeita que sustenta de verdade',
 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', null, 7, 1, true),

('20000000-0000-0000-0000-000000000006',
 'Vitamina verde da Josi',
 'O blend que a Josi toma toda manhã na chácara',
 'markdown', null,
 E'# Vitamina Verde da Josi\n\n## 🥬 Ingredientes (1 porção)\n- 1 xícara de espinafre fresco\n- 1/2 banana congelada\n- 1 colher de sopa de pasta de amendoim\n- 200ml de leite vegetal (amêndoas ou aveia)\n- 1 colher de chá de mel\n- Gelo a gosto\n- Opcional: 1 scoop de proteína de baunilha\n\n## 🫙 Modo de preparo\n1. Coloque todos os ingredientes no liquidificador\n2. Bata por 1 minuto até ficar cremoso\n3. Prove e ajuste o mel se necessário\n4. Sirva imediatamente\n\n## 💚 Por que é tão bom?\n- Espinafre: ferro, magnésio, vitaminas A e K\n- Banana: potássio e energia natural\n- Pasta de amendoim: proteína e gordura boa\n\n> Dica da Josi: Congele o espinafre em cubinhos para sempre ter à mão!',
 5, 2, true),

('20000000-0000-0000-0000-000000000006',
 'Panqueca de banana com aveia',
 'Zero farinha, zero açúcar, 100% satisfatória',
 'markdown', null,
 E'# Panqueca de Banana com Aveia\n\n## 🍌 Ingredientes (8 panquecas)\n- 2 bananas maduras\n- 2 ovos\n- 4 colheres de sopa de aveia em flocos finos\n- 1 pitada de canela\n- 1 pitada de sal\n- Pasta de amendoim para servir\n\n## 🥞 Modo de preparo\n1. Amasse as bananas com um garfo até virar um purê\n2. Adicione os ovos e misture bem\n3. Acrescente a aveia, canela e sal\n4. Aqueça uma frigideira antiaderente em fogo médio\n5. Despeje pequenas porções e cozinhe ~2 min de cada lado\n\n## 📊 Informações nutricionais (por porção de 2 panquecas)\n- Calorias: ~180kcal\n- Proteínas: 8g\n- Carboidratos: 24g\n- Gorduras: 5g',
 6, 3, true);

-- AULAS — Módulo 7 (Almoço e Jantar)
insert into public.lessons (module_id, titulo, descricao, tipo, video_url, conteudo, duracao_min, ordem, is_premium) values
('20000000-0000-0000-0000-000000000007',
 'Frango desfiado no limão siciliano',
 'Simples, rápido e serve para montar vários pratos',
 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', null, 12, 1, true),

('20000000-0000-0000-0000-000000000007',
 'Bowl de quinoa com legumes assados',
 'Uma refeição completa e bonita',
 'markdown', null,
 E'# Bowl de Quinoa com Legumes Assados\n\n## 🌾 Ingredientes (2 porções)\n\n**Base:**\n- 1 xícara de quinoa\n- 2 xícaras de água\n- Sal\n\n**Legumes assados:**\n- 1 abobrinha em cubos\n- 1 pimentão vermelho\n- 1/2 cebola roxa\n- 200g de tomate cereja\n- Azeite, sal, orégano\n\n**Para servir:**\n- Homus\n- Rúcula fresca\n- Castanhas do Pará picadas\n- Limão siciliano\n\n## 👩‍🍳 Preparo\n\n**Quinoa:** Lave bem, cozinhe com 2x o volume de água por 15 minutos em fogo médio.\n\n**Legumes:** Misture com azeite e temperos, asse a 200°C por 25 minutos.\n\n**Montagem:** Quinoa na base, legumes por cima, homus, rúcula, castanhas e squeeze de limão.',
 14, 2, true);
