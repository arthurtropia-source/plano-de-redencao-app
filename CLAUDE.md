# CLAUDE.md — Cátedra (coleção de aulas de estudo)

> Antes "Plano de Redenção App" (aula única). Agora é uma **coleção de aulas**
> em formato de leitura contínua com aprofundamento ("Aprofundar ▼").
> "Cátedra" é um nome placeholder — trocável em `public/data/courses.json`
> (`app.nome`), `index.html` e `vite.config.js`.

## Regras invioláveis

- **Este app é apenas leitura.** Nenhum input do usuário. Nenhum login. Nenhum admin UI.
- **Todo conteúdo visível na tela vem exclusivamente do material de cada aula** (Plano de Redenção: Pr. Ricardo e Tia Mônica; Ósio de Córdoba: exposição histórica baseada em fontes primárias). Nunca completar, inferir ou adicionar conteúdo de conhecimento próprio.
- **Toda alteração no JSON deve manter o campo `_fonte` correspondente** (`_fonte_body`, `_fonte_expand`, `_fonte_meta`, …). Adicionar conteúdo sem fonte é um anti-padrão crítico deste projeto.

## Arquitetura

- `public/data/courses.json` — manifesto: `app` (nome/subtítulo) + `cursos[]` (id, título, tema, `arquivo`, capa). É o ponto de entrada.
- `public/data/courses/<aula>.json` — conteúdo de cada aula, carregado sob demanda. Esquema baseado em seções:
  - `hero_html`, `nav[]` (âncoras), `secoes[]`, `footer_html`.
  - Seção **estruturada** (Redenção): `{ id, kicker, titulo, intro, body_html, expand_html, _fonte_body, _fonte_expand, … }` — `body_html` é o resumo visível; `expand_html` abre no "Aprofundar".
  - Seção **verbatim** (Ósio): `{ id, raw_html, _fonte }` — o `raw_html` é renderizado como veio.
- `data-source/timeline.json` — **fonte histórica** da aula de Redenção (não é servido). Base da reescrita em prosa; mantém `_fonte` por estação.
- `src/styles/redencao.css` — tema verde da aula de Redenção (jogadas visuais do v3 + componentes de leitura), todo seletor sob `.curso-redencao`. **Não reescrever em Tailwind.**
- `src/styles/osio.css` — tema cobalto da aula de Ósio, todo seletor sob `.curso-osio`.
- `src/styles/leitura.css` — shell neutro (tela inicial `.app-home`, botão voltar, wrapper de leitura).
- `src/components/CursoLeitura.jsx` — renderer de leitura (hero, nav fixa, seções, "Aprofundar" via delegação, fade-in via IntersectionObserver).
- `src/components/CoursePicker.jsx` — tela inicial de seleção de aulas.
- `src/App.jsx` — shell: manifesto, hooks de fetch, rota por hash (`#/curso/<id>`).
- Conteúdo renderizado via `dangerouslySetInnerHTML` — seguro porque o JSON é editado exclusivamente via Claude.

## Como editar conteúdo

1. Abrir `public/data/courses/<aula>.json`.
2. Localizar a seção pelo campo `id`.
3. Editar `body_html` / `expand_html` (ou `raw_html`) mantendo as classes CSS do tema da aula (`.curso-redencao` ou `.curso-osio`).
4. Atualizar o `_fonte` correspondente (arquivo + localização + autor).
5. Commit + push → Vercel atualiza automaticamente.

## Restrições técnicas críticas

- **NÃO trocar `orientation: "any"` no manifest.**
- **NÃO adicionar react-router-dom** → navegação por estado + hash.
- **NÃO usar localStorage** → app não tem estado persistente do usuário.
- **NÃO instalar Recharts** → sem séries temporais neste projeto.
- **Isolar temas:** todo seletor de uma aula deve ficar sob a classe-raiz `.curso-<tema>`. Não estilizar `body` puro nos arquivos de tema — usar o wrapper da aula.

## Aulas

- **Plano de Redenção** (`redencao`) — 14 estações, de Gênesis ao Apocalipse (Pr. Ricardo · Tia Mônica).
- **Ósio de Córdoba** (`osio`) — exposição histórica do cristianismo primitivo.
- Novas aulas: adicionar entrada em `courses.json` + arquivo em `courses/`.

## Referência visual

`plano-redencao-v3.html` (fora do repositório) é o alvo visual original da aula de Redenção; as jogadas visuais foram preservadas em `redencao.css`. O formato de leitura corrida segue o material da aula de Ósio.
