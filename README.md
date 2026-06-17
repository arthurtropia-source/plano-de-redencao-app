# Cátedra — coleção de aulas de estudo (PWA)

Leitor de aulas em formato de leitura contínua, com aprofundamento sob demanda
("Aprofundar ▼"). Cada aula tem seu próprio tema visual.

> "Cátedra" é um nome placeholder, trocável em `public/data/courses.json`
> (`app.nome`), `index.html` e `vite.config.js`.

## Aulas

- **Plano de Redenção** — 14 estações, de Gênesis ao Apocalipse (Pr. Ricardo · Tia Mônica).
- **Ósio de Córdoba** — exposição histórica do cristianismo primitivo.

## Stack

Vite · React · Tailwind CSS · vite-plugin-pwa · Framer Motion

## Como rodar localmente

```bash
npm install
npm run dev       # → http://localhost:5173
npm run build     # build de produção em /dist
```

## Deploy

GitHub (privado) → Vercel (deploy automático a cada push).

## Conteúdo

- `public/data/courses.json` — manifesto (lista de aulas).
- `public/data/courses/<aula>.json` — conteúdo de cada aula (seções com `body_html`/`expand_html` e campo `_fonte` rastreável).
- `data-source/timeline.json` — fonte histórica da aula de Redenção (não servida).

**Fluxo de atualização:** Arthur fala com Claude → Claude edita o JSON da aula
→ commit + push → Vercel atualiza → Arthur recarrega o app.

Detalhes de arquitetura e regras em `CLAUDE.md`.

## URL de produção

https://plano-de-redencao-app.vercel.app
