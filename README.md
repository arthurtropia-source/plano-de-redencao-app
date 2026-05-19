# Plano de Redenção — PWA

Leitor visual interativo do Plano de Redenção, baseado no curso do Pr. Ricardo.

## Stack

Vite · React · Tailwind CSS · vite-plugin-pwa · Framer Motion

## Como rodar localmente

```bash
npm install
npm run dev       # → http://localhost:5173
npm run build     # build de produção em /dist
```

## Deploy

GitHub (privado) → Vercel (deploy automático a cada push na `main`).

## JSON canônico

`public/data/timeline.json` — 14 estações do Plano de Redenção com conteúdo HTML e campo `_fonte` rastreável em cada afirmação.

**Fluxo de atualização:** Arthur fala com Claude → Claude edita `timeline.json` → commit + push → Vercel atualiza em <2 min → Arthur recarrega o app.

## Referência visual

`plano-redencao-v3.html` (na pasta do projeto, fora do repositório) é o artefato visual original. Para qualquer dúvida de "como deve ficar visualmente", abrir o v3 no navegador.

## URL de produção

*(preencher após deploy)*
